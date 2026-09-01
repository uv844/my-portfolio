import type { Contributions, GitHubData, LeetCodeStats } from "@/lib/data";
import { formatNumber } from "@/lib/util";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Panel from "@/components/fx/Panel";
import Counter from "@/components/fx/Counter";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";
import DifficultyRings from "@/components/widgets/DifficultyRings";
import Heatmap from "@/components/widgets/Heatmap";
import ActivityFeed from "@/components/widgets/ActivityFeed";

function SourceTag({ live, source }: { live: boolean; source: string }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em]">
      <span
        aria-hidden="true"
        className={
          live
            ? "pulse-dot h-1.5 w-1.5 rounded-full bg-accent"
            : "h-1.5 w-1.5 rounded-full bg-dim"
        }
      />
      <span className={live ? "text-accent" : "text-dim"}>
        {live ? source : "cached"}
      </span>
    </span>
  );
}

/**
 * Live signal: real numbers pulled from LeetCode and GitHub at revalidation time.
 * Every panel labels its own source and degrades to a "cached" tag if the
 * upstream was unreachable, so nothing here is ever silently stale.
 */
export default function Signal({
  leetcode,
  contributions,
  github,
  now,
}: {
  leetcode: LeetCodeStats;
  contributions: Contributions;
  github: GitHubData;
  now: number;
}) {
  return (
    <section id="signal" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="01"
            eyebrow="Signal"
            title="Live activity, straight from the source."
            lede="These panels read the LeetCode and GitHub APIs on the server and cache the result. Nothing here is typed in by hand."
          />

          <Stair
            step={STEP.card}
            className="p3d grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
          >
            {/* LeetCode difficulty split */}
            <StairStep direction="left">
              <Panel
                tone="lime"
                depth="floating"
                hud
                className="h-full p-5 sm:p-6"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h3 className="mono-label">LeetCode</h3>
                  <SourceTag live={leetcode.live} source="live" />
                </div>
                <DifficultyRings stats={leetcode} />
              </Panel>
            </StairStep>

            {/* Recent public GitHub events */}
            <StairStep direction="right">
              <Panel
                tone="cyan"
                depth="raised"
                hud
                className="flex h-full flex-col p-5 sm:p-6"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="mono-label">Recent commits</h3>
                  <SourceTag live={github.live} source="github" />
                </div>
                <p className="mb-4 text-[13px] leading-relaxed text-muted">
                  Latest public pushes across{" "}
                  <span className="tnum text-text">{github.publicRepos}</span>{" "}
                  repositories.
                </p>
                <div className="flex-1">
                  <ActivityFeed items={github.activity} now={now} />
                </div>

                <a
                  href="https://github.com/uv844"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  className="link-wipe mt-5 inline-flex self-start font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-2"
                >
                  All activity on GitHub ↗
                </a>
              </Panel>
            </StairStep>
          </Stair>

          {/* Contribution grid. Sits flush with the section plane on purpose — the cells
              run their own relief field inside the scroll wrapper (see .heat-field), and
              stacking a second elevation under it would only compete with that. */}
          <Reveal variant="scale" delay={120} className="mt-4">
            <Panel tone="lime" hud className="p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="mono-label">Contribution graph</h3>
                  <p className="mt-2 flex items-baseline gap-2">
                    <Counter
                      value={contributions.total}
                      className="font-display text-[1.75rem] font-semibold leading-none tracking-tight"
                    />
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
                      contributions
                    </span>
                  </p>
                </div>
                <SourceTag live={contributions.live} source="live · @uv844" />
              </div>

              <Heatmap days={contributions.days} live={contributions.live} />
            </Panel>
          </Reveal>

          {/* Honest separation of the two problem-count figures. */}
          <Reveal
            delay={160}
            as="p"
            className="mt-5 max-w-3xl font-mono text-[10px] leading-relaxed tracking-[0.06em] text-dim"
          >
            LeetCode reports {formatNumber(leetcode.total)} accepted problems on this
            account. The 580+ figure quoted elsewhere is the combined total across
            LeetCode, GeeksforGeeks and CodeChef — the two are counted separately.
          </Reveal>
        </div>
      </Scene3D>
    </section>
  );
}
