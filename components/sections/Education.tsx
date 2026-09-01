import { education } from "@/content/profile";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Panel from "@/components/fx/Panel";
import Counter from "@/components/fx/Counter";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

export default function Education() {
  return (
    <section id="education" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="06"
            eyebrow="Education"
            title="Where I have studied."
          />

          {/* Entries descend the spine one beat apart, so the timeline reads
              top-to-bottom the way you'd actually walk through it. The spine
              itself is a plain span — not a StairStep — so it stays put while the
              cards arrive against it.

              The spine and its nodes stay at the section plane's own depth while the cards
              come forward (`depth="floating"` below). That is deliberate and not simply
              cheaper: a `translateZ` moves an element away from the perspective origin as
              well as toward the viewer, so a 9px node lifted 16px this far off-centre would
              paint ~5px outboard of the 1px rule it is supposed to sit on. Keeping the rail
              and its beads as one rigid assembly at Z=0 and floating only the cards gives
              the reading the plan asked for — a rail in space with the entries standing off
              it — without the misregistration. */}
          <Stair as="ol" step={STEP.card} tall className="relative">
            {/* Timeline spine, hidden on mobile where the cards stack full-width. */}
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/50 via-line-strong to-transparent sm:block"
            />

            {education.map((entry) => (
              <StairStep
                as="li"
                key={entry.title}
                rise={22}
                shift={20}
                className="relative sm:pl-10"
              >
                <span
                  aria-hidden="true"
                  className={
                    entry.current
                      ? "pulse-dot absolute left-0 top-7 hidden h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg sm:block"
                      : "absolute left-[3px] top-8 hidden h-[9px] w-[9px] rounded-full border border-line-strong bg-surface-2 sm:block"
                  }
                />

                <Panel
                  tone={entry.current ? "lime" : "violet"}
                  tilt={4}
                  lift={3}
                  depth="floating"
                  hud
                  className="mb-4 p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                        {entry.period}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
                        {entry.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] text-muted">
                        {entry.institution}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                        {entry.affiliation} · {entry.location}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="mono-label text-[9px]">{entry.metricLabel}</p>
                      <p className="mt-1.5 font-display text-[1.75rem] font-semibold leading-none tracking-tight">
                        <Counter
                          value={Number(entry.metric)}
                          decimals={entry.metric.includes(".") ? 2 : 0}
                          suffix={entry.metricSuffix}
                        />
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
                    {entry.note}
                  </p>
                </Panel>
              </StairStep>
            ))}
          </Stair>
        </div>
      </Scene3D>
    </section>
  );
}
