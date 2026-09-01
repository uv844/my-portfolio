import { fallbackStats } from "@/content/profile";
import { projects, type Project } from "@/content/projects";

/**
 * Server-side data fetching. These run in React Server Components, so the numbers are
 * baked into the HTML the browser receives — no client-side loading spinners, no API
 * waterfall, and no CORS problems (LeetCode's endpoint rejects browser origins).
 *
 * Every fetcher is wrapped so an upstream outage degrades to the CV's static figures
 * instead of breaking the page. `live: false` on a result means you're seeing fallbacks.
 */

const GH_USER = "uv844";
const LC_USER = "yuvrajch1503";

const HOUR = 3600;

export type LeetCodeStats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  live: boolean;
};

export type ContributionDay = { date: string; count: number; level: number };

export type Contributions = {
  total: number;
  days: ContributionDay[];
  live: boolean;
};

export type RepoMeta = {
  fullName: string;
  language: string | null;
  stars: number;
  pushedAt: string;
  description: string | null;
};

export type ActivityItem = {
  id: string;
  repo: string;
  /** Event type of the most recent event in the group. */
  type: string;
  /** How many events rolled up into this row. */
  events: number;
  /** Summed commit count, when GitHub reports it — the public digest often omits it. */
  commits: number;
  createdAt: string;
  url: string;
};

export type GitHubData = {
  repos: RepoMeta[];
  activity: ActivityItem[];
  publicRepos: number;
  live: boolean;
};

const leetcodeFallback: LeetCodeStats = {
  total: fallbackStats.leetcodeSolved,
  easy: fallbackStats.leetcodeEasy,
  medium: fallbackStats.leetcodeMedium,
  hard: fallbackStats.leetcodeHard,
  ranking: fallbackStats.leetcodeRanking,
  live: false,
};

/**
 * LeetCode's public GraphQL endpoint. It requires a Referer header or it 403s,
 * which is also why this can only run server-side.
 */
export async function getLeetCode(): Promise<LeetCodeStats> {
  const query = `
    query userStats($username: String!) {
      matchedUser(username: $username) {
        profile { ranking }
        submitStatsGlobal { acSubmissionNum { difficulty count } }
      }
    }`;

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (portfolio-stats)",
      },
      body: JSON.stringify({ query, variables: { username: LC_USER } }),
      next: { revalidate: HOUR },
    });
    if (!res.ok) return leetcodeFallback;

    const json = await res.json();
    const user = json?.data?.matchedUser;
    const buckets = user?.submitStatsGlobal?.acSubmissionNum;
    if (!user || !Array.isArray(buckets)) return leetcodeFallback;

    const pick = (d: string) =>
      buckets.find((b: { difficulty: string }) => b.difficulty === d)?.count ?? 0;

    const total = pick("All");
    if (!total) return leetcodeFallback;

    return {
      total,
      easy: pick("Easy"),
      medium: pick("Medium"),
      hard: pick("Hard"),
      ranking: user.profile?.ranking ?? leetcodeFallback.ranking,
      live: true,
    };
  } catch {
    return leetcodeFallback;
  }
}

/** Synthesises a plausible-looking empty year so the heatmap keeps its layout on failure. */
function fallbackDays(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const end = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }
  return days;
}

export async function getContributions(): Promise<Contributions> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`,
      { next: { revalidate: HOUR } },
    );
    if (!res.ok) throw new Error(String(res.status));

    const json = await res.json();
    const days: ContributionDay[] = Array.isArray(json?.contributions)
      ? json.contributions.map(
          (c: { date: string; count: number; level: number }) => ({
            date: c.date,
            count: c.count ?? 0,
            level: c.level ?? 0,
          }),
        )
      : [];
    if (!days.length) throw new Error("no contribution data");

    return {
      total: json?.total?.lastYear ?? fallbackStats.contributions,
      // Keep only the trailing 365 days so the grid width is deterministic.
      days: days.slice(-365),
      live: true,
    };
  } catch {
    return {
      total: fallbackStats.contributions,
      days: fallbackDays(),
      live: false,
    };
  }
}

export async function getGitHub(): Promise<GitHubData> {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-stats",
  };

  try {
    const [reposRes, eventsRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: HOUR / 2 } },
      ),
      fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=30`, {
        headers,
        next: { revalidate: HOUR / 2 },
      }),
    ]);

    const reposJson = reposRes.ok ? await reposRes.json() : [];
    const eventsJson = eventsRes.ok ? await eventsRes.json() : [];

    const repos: RepoMeta[] = Array.isArray(reposJson)
      ? reposJson.map(
          (r: {
            full_name: string;
            language: string | null;
            stargazers_count: number;
            pushed_at: string;
            description: string | null;
          }) => ({
            fullName: r.full_name,
            language: r.language,
            stars: r.stargazers_count,
            pushedAt: r.pushed_at,
            description: r.description,
          }),
        )
      : [];

    /**
     * A burst of commits to one repo arrives as many separate events, which would
     * render as a wall of identical rows. Roll them up per repository instead:
     * newest timestamp wins, event counts accumulate. The API returns events
     * newest-first, so insertion order is already the order we want.
     */
    const grouped = new Map<string, ActivityItem>();

    if (Array.isArray(eventsJson)) {
      for (const e of eventsJson as Array<{
        id: string;
        type: string;
        repo: { name: string };
        created_at: string;
        payload?: { size?: number };
      }>) {
        if (
          e.type !== "PushEvent" &&
          e.type !== "CreateEvent" &&
          e.type !== "PullRequestEvent"
        ) {
          continue;
        }

        const existing = grouped.get(e.repo.name);
        if (existing) {
          existing.events += 1;
          existing.commits += e.payload?.size ?? 0;
          continue;
        }

        grouped.set(e.repo.name, {
          id: e.id,
          repo: e.repo.name,
          type: e.type,
          events: 1,
          commits: e.payload?.size ?? 0,
          createdAt: e.created_at,
          url: `https://github.com/${e.repo.name}`,
        });
      }
    }

    const activity = [...grouped.values()].slice(0, 6);

    const live = repos.length > 0 || activity.length > 0;
    return { repos, activity, publicRepos: repos.length, live };
  } catch {
    return { repos: [], activity: [], publicRepos: 0, live: false };
  }
}

/**
 * Overlays live GitHub metadata onto the hand-written project entries, matched by
 * `repoFullName`. Hand-written copy always wins for title/blurb — only the volatile
 * fields (language, stars, last push) come from the API.
 */
export type EnrichedProject = Project & {
  language?: string | null;
  stars?: number;
  pushedAt?: string;
};

export function mergeProjects(repos: RepoMeta[]): EnrichedProject[] {
  const byName = new Map(repos.map((r) => [r.fullName.toLowerCase(), r]));

  return projects.map((p) => {
    const meta = p.repoFullName
      ? byName.get(p.repoFullName.toLowerCase())
      : undefined;
    if (!meta) return p;
    return {
      ...p,
      language: meta.language,
      stars: meta.stars,
      pushedAt: meta.pushedAt,
    };
  });
}

export async function getSiteData() {
  const [leetcode, contributions, github] = await Promise.all([
    getLeetCode(),
    getContributions(),
    getGitHub(),
  ]);

  return {
    leetcode,
    contributions,
    github,
    projects: mergeProjects(github.repos),
    /** Stamped server-side so relative times in the activity feed hydrate consistently. */
    fetchedAt: Date.now(),
  };
}
