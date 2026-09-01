import { achievements, certifications } from "@/content/profile";
import type { Tone } from "@/components/fx/Panel";
import { STEP, type DepthLevel } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Panel from "@/components/fx/Panel";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

/** Gold/silver badges get a warmer treatment than a plain completion. */
function Badge({ badge }: { badge: string }) {
  const gold = badge.includes("Gold");
  const silver = badge.includes("Silver");

  return (
    <span
      className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
      style={{
        borderColor: gold
          ? "rgba(250,204,21,0.35)"
          : silver
            ? "rgba(203,213,225,0.3)"
            : "var(--color-line)",
        background: gold
          ? "rgba(250,204,21,0.1)"
          : silver
            ? "rgba(203,213,225,0.08)"
            : "transparent",
        color: gold ? "#facc15" : silver ? "#cbd5e1" : "var(--color-dim)",
      }}
    >
      {badge}
    </span>
  );
}

const ACHIEVEMENT_TONES: Tone[] = ["lime", "cyan", "violet", "lime"];

/**
 * The four headline numbers step back one level per column, so the row reads as a ramp
 * receding to the right rather than four identical tiles. It maps onto the 4-up desktop
 * grid exactly, and on the 2-up mobile grid it still descends consistently.
 */
const ACHIEVEMENT_DEPTHS: DepthLevel[] = [
  "front",
  "floating",
  "raised",
  "flush",
];

/** Two columns, so two levels — enough to separate the pair without a visible sawtooth. */
const CERT_DEPTHS: DepthLevel[] = ["raised", "flush"];

export default function Credentials() {
  return (
    <section id="credentials" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="07"
            eyebrow="Credentials"
            title="Certifications and recognition."
          />

          {/* Achievements — the headline numbers, sweeping across the row */}
          <Stair
            step={STEP.card}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {achievements.map((item, i) => (
              <StairStep key={item.label} shift={20}>
                <Panel
                  tone={ACHIEVEMENT_TONES[i % ACHIEVEMENT_TONES.length]}
                  tilt={5}
                  lift={5}
                  depth={ACHIEVEMENT_DEPTHS[i % ACHIEVEMENT_DEPTHS.length]}
                  glare
                  hud
                  className="flex h-full flex-col p-5"
                >
                  {/* This `.tilt-pop` finally does something: `.panel` used to carry
                      `isolation: isolate`, which forces `transform-style: flat` and so
                      silently discarded the standoff. The metric now sits genuinely clear
                      of the card face and rises further under the pointer. */}
                  <p className="tilt-pop font-display text-[1.6rem] font-semibold leading-none tracking-tight sm:text-[2rem]">
                    {item.metric}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {item.label}
                  </p>
                  <p className="mt-3 flex-1 text-[12px] leading-relaxed text-dim">
                    {item.detail}
                  </p>
                </Panel>
              </StairStep>
            ))}
          </Stair>

          <Reveal className="d-raised mt-14 flex items-center gap-4">
            <span className="mono-label">Certifications</span>
            <span className="hairline flex-1" aria-hidden="true" />
          </Reveal>

          <Stair
            as="ul"
            step={STEP.card}
            delay={0.06}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            {certifications.map((cert, i) => (
              <StairStep as="li" key={cert.title} shift={18}>
                <Panel
                  tone="cyan"
                  tilt={4}
                  lift={3}
                  depth={CERT_DEPTHS[i % CERT_DEPTHS.length]}
                  hud
                  className="flex h-full flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight">
                      {cert.title}
                    </h3>
                    <Badge badge={cert.badge} />
                  </div>

                  <p className="mt-3 flex-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {cert.issuer}
                  </p>

                  <p className="mt-4 tnum border-t border-line pt-3 text-[10px] tracking-[0.14em] text-dim">
                    {cert.year}
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
