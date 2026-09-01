import { experience } from "@/content/profile";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Panel from "@/components/fx/Panel";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

export default function Experience() {
  return (
    <section id="experience" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="05"
            eyebrow="Leadership"
            title="Running a 30-person technical society."
          />

          <div className="p3d space-y-4">
            {experience.map((role, i) => (
              <Reveal key={role.title} variant="scale" delay={i * 80}>
                <Panel
                  tone="cyan"
                  tilt={5}
                  lift={4}
                  depth="raised"
                  hud
                  className="p-6 sm:p-8"
                >
                  <div className="p3d grid gap-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:gap-10">
                    <div>
                      <div className="flex items-center gap-2">
                        {role.current ? (
                          <span className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                            <span
                              aria-hidden="true"
                              className="pulse-dot h-1 w-1 rounded-full bg-accent"
                            />
                            Current
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight">
                        {role.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        {role.org}
                      </p>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                        {role.period}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                        {role.meta}
                      </p>
                    </div>

                    {/* Ruled list — the vertical line reads as a spine on desktop, and
                        the points descend it a beat apart. `d-raised` carries the whole
                        spine, rule and bullets together, off the card face, so as the card
                        tilts under the cursor the rail separates from the surface behind it
                        instead of being painted onto it. */}
                    <Stair
                      as="ul"
                      step={STEP.row}
                      delay={0.16}
                      className="d-raised space-y-3.5 md:border-l md:border-line md:pl-8"
                    >
                      {role.points.map((point) => (
                        <StairStep
                          as="li"
                          key={point}
                          rise={16}
                          shift={24}
                          className="relative flex gap-3 text-[14px] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2/70"
                          />
                          {point}
                        </StairStep>
                      ))}
                    </Stair>
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </div>
      </Scene3D>
    </section>
  );
}
