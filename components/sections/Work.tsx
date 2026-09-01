import type { ReactNode } from "react";
import Image from "next/image";
import type { EnrichedProject } from "@/lib/data";
import { cn, pad2, relativeTime } from "@/lib/util";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Panel from "@/components/fx/Panel";
import Magnetic from "@/components/fx/Magnetic";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

/** GitHub's own language colours, so the dots read as familiar. */
const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4f5d95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#da5b0b",
};

function LiveMeta({
  project,
  now,
}: {
  project: EnrichedProject;
  now: number;
}) {
  if (!project.pushedAt && !project.language) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-dim">
      {project.language ? (
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{
              background: LANG_COLOR[project.language] ?? "var(--color-dim)",
            }}
          />
          {project.language}
        </span>
      ) : null}

      {project.stars ? (
        <span className="tnum">★ {project.stars}</span>
      ) : null}

      {project.pushedAt ? (
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent"
          />
          pushed {relativeTime(project.pushedAt, now)}
        </span>
      ) : null}
    </div>
  );
}

function StackList({ stack }: { stack: string[] }) {
  return (
    // `.chip-field` — its own short perspective, so a hovered chip rises off the card
    // rather than swelling imperceptibly against the section plane's 1800px.
    <ul className="chip-field flex flex-wrap gap-1.5">
      {stack.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * The tinted, gridded surface both project visuals sit on. The tone comes from
 * `--panel-glow`, which the enclosing Panel already sets, so the stage picks up
 * each card's accent colour without being told which card it is in.
 *
 * It fills the column (`md:h-full`) rather than shrink-wrapping its contents,
 * because the column's height is set by the copy beside it — a shrink-wrapped
 * stage would leave a bare gap inside the card instead of a continuous surface.
 *
 * `.pop-stage` makes it the perspective source for whatever floats on it, so the grid
 * and glow stay flat on the surface while the frame above them stands clear.
 */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="pop-stage relative flex min-h-[240px] items-center justify-center overflow-hidden bg-surface-2 p-5 sm:p-6 md:h-full">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--panel-glow, var(--color-accent)) 20%, transparent), transparent 75%)",
        }}
      />
      {children}
    </div>
  );
}

/**
 * A project screenshot, framed as a browser window.
 *
 * These are wide captures — 2.4:1 for VocalSure, 1.9:1 for Digital Heroes —
 * sitting in a column that is roughly square, since its height comes from the
 * copy alongside it. Cropping to fill (`object-cover`) showed a ~2.3x
 * enlargement of the top-left corner with the page heading sliced mid-word, so
 * the capture keeps its own aspect ratio and floats on the stage instead.
 * `next/image` reads the dimensions straight off the static import, so no ratio
 * is hardcoded here and none of the screenshot is thrown away.
 */
function Screenshot({ project }: { project: EnrichedProject }) {
  if (!project.image) return null;

  return (
    <Stage>
      <div className="tilt-pop relative w-full overflow-hidden rounded-lg border border-line-strong bg-bg shadow-[0_28px_70px_-30px_rgba(0,0,0,0.95)]">
        {/* Window chrome — makes the frame read as a live site rather than a
            stray border around an image. Monochrome, to stay inside the palette. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-line" />
        </div>

        <Image
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          sizes="(max-width: 768px) 88vw, 528px"
          placeholder="blur"
          className="h-auto w-full"
        />
      </div>
    </Stage>
  );
}

/**
 * Fallback for a featured project with no screenshot. Every featured project
 * currently has one, but the field is optional — without this the grid cell
 * would render as an empty bordered box and unbalance the card.
 */
function NoPreview({ project }: { project: EnrichedProject }) {
  return (
    <Stage>
      <p className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        {project.title}
      </p>
    </Stage>
  );
}

function FeaturedCard({
  project,
  index,
  now,
}: {
  project: EnrichedProject;
  index: number;
  now: number;
}) {
  const flip = index % 2 === 1;

  return (
    <Reveal variant="scale" delay={index * 80}>
      <Panel
        as="article"
        tone={project.tone}
        tilt={6}
        lift={5}
        glare
        readout
        className="overflow-hidden p-0"
      >
        <div className="grid md:grid-cols-2">
          {/* Visual */}
          <div
            className={cn(
              "relative border-b border-line md:border-b-0",
              flip ? "md:order-2 md:border-l" : "md:border-r",
            )}
          >
            {project.image ? (
              <Screenshot project={project} />
            ) : (
              <NoPreview project={project} />
            )}
          </div>

          {/* Copy — climbs the card in four steps: heading, prose, stack, actions.
              Each card carries its own staircase rather than sharing one across all
              three, because they are a screen apart and a shared stagger would fire
              for cards nobody has scrolled to yet. `tall` lowers the trigger
              threshold: stacked on narrow screens this column runs ~700px, and at
              the default 18% the sequence would only start once the first step was
              already well up the screen. */}
          <Stair
            step={STEP.card}
            delay={0.08}
            tall
            className="flex flex-col p-6 sm:p-8"
          >
            <StairStep shift={flip ? -20 : 20}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {pad2(index + 1)}
                </span>
                <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                <span className="mono-label text-[10px]">{project.period}</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
                {project.title}
              </h3>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {project.subtitle}
              </p>
            </StairStep>

            <StairStep shift={flip ? -20 : 20}>
              <p className="mt-4 text-pretty text-[14px] leading-relaxed text-muted">
                {project.blurb}
              </p>

              {project.bullets.length ? (
                <ul className="mt-5 space-y-2">
                  {project.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </StairStep>

            <StairStep shift={flip ? -20 : 20} className="mt-6">
              <StackList stack={project.stack} />
            </StairStep>

            <StairStep
              shift={flip ? -20 : 20}
              className="mt-6 space-y-4 border-t border-line pt-5"
            >
              <LiveMeta project={project} now={now} />

              <div className="flex flex-wrap items-center gap-3">
                {project.live ? (
                  <Magnetic strength={0.22}>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="visit"
                      className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-bg transition-shadow hover:shadow-[0_0_28px_-6px] hover:shadow-accent/60"
                    >
                      Live site
                      <span aria-hidden="true">↗</span>
                    </a>
                  </Magnetic>
                ) : null}

                {project.repo ? (
                  <Magnetic strength={0.2}>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="code"
                      className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text transition-colors hover:border-accent hover:text-accent"
                    >
                      Source
                      <span aria-hidden="true">↗</span>
                    </a>
                  </Magnetic>
                ) : null}
              </div>
            </StairStep>
          </Stair>
        </div>
      </Panel>
    </Reveal>
  );
}

function SmallCard({ project, now }: { project: EnrichedProject; now: number }) {
  return (
    <StairStep>
      <Panel
        as="article"
        tone={project.tone}
        tilt={4}
        lift={4}
        hud
        className="flex h-full flex-col p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight">
            {project.title}
          </h3>
          <span className="mono-label shrink-0 text-[9px]">{project.period}</span>
        </div>

        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
          {project.subtitle}
        </p>

        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
          {project.blurb}
        </p>

        <div className="mt-4">
          <StackList stack={project.stack} />
        </div>

        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <LiveMeta project={project} now={now} />
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="code"
              className="link-wipe inline-flex font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              View source ↗
            </a>
          ) : null}
        </div>
      </Panel>
    </StairStep>
  );
}

export default function Work({
  projects,
  now,
}: {
  projects: EnrichedProject[];
  now: number;
}) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="03"
            eyebrow="Selected work"
            title="Things I have built and shipped."
            lede="Full-stack web applications, machine learning APIs, and system platforms I have built and shipped."
          />

          {/* The featured cards alternate across the elevation scale so the stack has a
              front-to-back rhythm as the section plane turns, instead of three tiles at
              one identical distance. */}
          <div className="p3d space-y-4 sm:space-y-6">
            {featured.map((project, i) => (
              <div key={project.slug} className={i % 2 === 0 ? "d-floating" : "d-raised"}>
                <FeaturedCard project={project} index={i} now={now} />
              </div>
            ))}
          </div>

          {others.length ? (
            <>
              <Reveal className="d-raised mt-16 flex items-center gap-4">
                <span className="mono-label">Also on GitHub</span>
                <span className="hairline flex-1" aria-hidden="true" />
              </Reveal>

              <Stair step={STEP.card} className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((project) => (
                  <SmallCard key={project.slug} project={project} now={now} />
                ))}
              </Stair>
            </>
          ) : null}
        </div>
      </Scene3D>
    </section>
  );
}
