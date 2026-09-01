import { skillGroups } from "@/content/profile";
import type { Tone } from "@/components/fx/Panel";
import { pad2 } from "@/lib/util";
import { STEP, type DepthLevel } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Panel from "@/components/fx/Panel";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

const TONES: Tone[] = ["lime", "cyan", "violet"];
const GLOW: Record<Tone, string> = {
  lime: "var(--color-accent)",
  cyan: "var(--color-accent-2)",
  violet: "var(--color-violet)",
};

/**
 * Elevation by column, not by card. On the three-up grid this makes each column sit at a
 * fixed distance, so the six panels read as a stepped shelf receding to the right as the
 * section plane yaws — where one depth per card would just look like noise. It cycles on
 * the same index as `TONES`, so colour and distance stay locked together per column.
 */
const DEPTHS: DepthLevel[] = ["floating", "raised", "flush"];

export default function Stack() {
  return (
    <section id="stack" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="04"
            eyebrow="Toolkit"
            title="What I reach for."
            lede="Grouped the way I'd actually describe them — the interface layer, the services and data behind it, and the fundamentals underneath."
          />

          {/* Six panels arriving diagonally across the grid, one beat apart */}
          <Stair
            step={STEP.card}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {skillGroups.map((group, i) => {
              const tone = TONES[i % TONES.length];

              return (
                <StairStep key={group.title}>
                  <Panel
                    tone={tone}
                    tilt={5}
                    lift={4}
                    depth={DEPTHS[i % DEPTHS.length]}
                    hud
                    className="h-full p-5"
                    // Chips inherit the group's tint on hover.
                    style={{ ["--chip-glow" as string]: GLOW[tone] }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[15px] font-semibold tracking-tight">
                        {group.title}
                      </h3>
                      <span className="tnum text-[10px] tracking-[0.14em] text-dim">
                        {pad2(i + 1)}
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className="mt-3 block h-px w-full"
                      style={{
                        background: `linear-gradient(90deg, ${GLOW[tone]}, transparent 70%)`,
                        opacity: 0.4,
                      }}
                    />

                    {/* `.chip-field` gives the row its own short perspective, so a hovered
                        chip lifts clear of the card face and paints over its neighbours
                        instead of gaining a sub-pixel swell off the section plane. */}
                    <ul className="chip-field mt-4 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </StairStep>
              );
            })}
          </Stair>
        </div>
      </Scene3D>
    </section>
  );
}
