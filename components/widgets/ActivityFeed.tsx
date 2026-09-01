import type { ActivityItem } from "@/lib/data";
import { relativeTime } from "@/lib/util";
import { STEP } from "@/lib/motion";
import { Stair, StairStep } from "@/components/motion/Stair";

const EVENT = {
  PushEvent: { verb: "pushed to", tone: "text-accent" },
  CreateEvent: { verb: "created", tone: "text-accent-2" },
  PullRequestEvent: { verb: "opened a PR on", tone: "text-violet" },
} as const;

/**
 * Recent public GitHub events. Server-rendered from data fetched at revalidation
 * time; `now` is stamped on the server too so the relative timestamps are
 * identical in the HTML and after hydration.
 */
export default function ActivityFeed({
  items,
  now,
}: {
  items: ActivityItem[];
  now: number;
}) {
  if (!items.length) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
        Activity feed unavailable right now.
      </p>
    );
  }

  return (
    <Stair as="ol" step={STEP.row} delay={0.12} className="divide-y divide-line">
      {items.map((item) => {
        const meta = EVENT[item.type as keyof typeof EVENT] ?? {
          verb: "updated",
          tone: "text-muted",
        };
        const [owner, name] = item.repo.split("/");

        return (
          <StairStep as="li" key={item.id} rise={18} shift={22}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="group flex items-baseline gap-3 py-3 transition-colors hover:bg-white/[0.02]"
            >
              <span
                aria-hidden="true"
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${meta.tone}`}
              />

              <span className="min-w-0 flex-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
                  {meta.verb}
                </span>{" "}
                <span className="truncate text-[13px] font-medium text-text transition-colors group-hover:text-accent">
                  {name}
                </span>
                <span className="ml-1.5 font-mono text-[10px] text-dim">
                  {owner}
                </span>
                {item.commits > 0 ? (
                  <span className="ml-1.5 font-mono text-[10px] text-dim">
                    · {item.commits} commits
                  </span>
                ) : item.events > 1 ? (
                  <span className="ml-1.5 font-mono text-[10px] text-dim">
                    · {item.events} pushes
                  </span>
                ) : null}
              </span>

              <span className="tnum shrink-0 text-[10px] tracking-[0.06em] text-dim">
                {relativeTime(item.createdAt, now)}
              </span>
            </a>
          </StairStep>
        );
      })}
    </Stair>
  );
}
