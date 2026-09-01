import { profile, fallbackStats } from "@/content/profile";
import type { Contributions, LeetCodeStats } from "@/lib/data";
import { formatNumber, cn } from "@/lib/util";
import { SCENE, STEP, type DepthLevel } from "@/lib/motion";
import Reveal from "@/components/fx/Reveal";
import Panel, { type Tone } from "@/components/fx/Panel";
import Magnetic from "@/components/fx/Magnetic";
import Counter from "@/components/fx/Counter";
import RoleCycle from "@/components/fx/RoleCycle";
import SpotlightText from "@/components/fx/SpotlightText";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";
import Pressable from "@/components/motion/Pressable";
import LiveClock from "@/components/widgets/LiveClock";

import CyberCore3D from "@/components/motion/CyberCore3D";

/** Front of the stack first, then the services and data behind it. */
const MARQUEE = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Java",
  "Spring-ready OOP",
  "Node.js",
  "Express",
  "REST APIs",
  "MySQL",
  "MongoDB",
  "SQL Server",
  "Data Structures",
  "Algorithms",
  "Python",
  "Git",
];

function LiveBadge() {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
      <span aria-hidden="true" className="pulse-dot h-1 w-1 rounded-full bg-accent" />
      Live
    </span>
  );
}

function Stat({
  label,
  value,
  detail,
  tone,
  live,
  decimals = 0,
  suffix,
  staticValue,
  depth,
}: {
  label: string;
  value?: number;
  detail: string;
  tone: Tone;
  live?: boolean;
  decimals?: number;
  suffix?: string;
  staticValue?: string;
  depth: DepthLevel;
}) {
  return (
    <StairStep>
      <Panel
        tone={tone}
        lift={5}
        depth={depth}
        hud
        className="h-full p-4 sm:p-5"
      >
        {/* Wraps rather than collides: in the 2-up mobile grid a long single-word
            label ("Contributions") is wider than the column, and with the badge
            held at shrink-0 the label would otherwise slide underneath it.

            The reserved heights keep all four numbers on one baseline. 1.25rem is
            the badge's own height, so a card without a badge still lines up with
            one that has it — that is what fixes the 4-up desktop row. The taller
            mobile figure is the wrapped case: two label lines, the row gap, then
            the badge on its own line. Both assume a label of at most two lines. */}
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5",
            live ? "min-h-[3.35rem] sm:min-h-5" : "min-h-5",
          )}
        >
          <span className="mono-label min-w-0 break-words leading-tight">
            {label}
          </span>
          {live ? <LiveBadge /> : null}
        </div>
        <p className="mt-4 font-display text-[2rem] font-semibold leading-none tracking-tight sm:text-[2.5rem]">
          {staticValue ? (
            <span className="tnum">{staticValue}</span>
          ) : (
            <Counter value={value ?? 0} decimals={decimals} suffix={suffix} />
          )}
        </p>
        <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-dim">
          {detail}
        </p>
      </Panel>
    </StairStep>
  );
}

export default function Hero({
  leetcode,
  contributions,
}: {
  leetcode: LeetCodeStats;
  contributions: Contributions;
}) {
  return (
    <section id="top" className="relative">
      {/* The hero gets the page's strongest perspective — it is the one screen a visitor
          judges the whole site on, and there is nothing above it to compete with. */}
      <Scene3D
        perspective={SCENE.heroPerspective}
        yaw={SCENE.heroYaw}
        pitch={SCENE.heroPitch}
      >
        <div className="p3d mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              {/* Status line */}
              <Reveal className="d-raised flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  {profile.location}
                </span>
                <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  <LiveClock showSeconds={false} />
                </span>
              </Reveal>

              {/* Headline — gradient light follows the pointer across the glyphs, and the
                  middle line rewrites itself through profile.roles. */}
              <div className="d-floating">
                <SpotlightText
                  as="h1"
                  className="mt-7 font-display text-[clamp(2.6rem,9vw,6rem)] font-bold leading-[0.9] tracking-[-0.035em]"
                >
                  <Reveal as="span" variant="mask" className="block">
                    {profile.headline.before}
                  </Reveal>

                  <Reveal as="span" variant="mask" delay={110} className="block">
                    <span className="sr-only">{profile.roles[0]}</span>
                    <RoleCycle roles={profile.roles} className="text-accent-gradient" />
                  </Reveal>

                  <Reveal as="span" variant="mask" delay={220} className="block">
                    {profile.headline.after}
                  </Reveal>
                </SpotlightText>
              </div>
            </div>

            {/* Interactive 3D Cyber Core */}
            <Reveal delay={180} className="d-floating flex justify-center lg:justify-end lg:translate-x-12">
              <CyberCore3D size={520} />
            </Reveal>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            {/* Body copy stays flush with the plane. Any 3D-transformed text drops from
                subpixel to grayscale antialiasing, and that is most visible at paragraph
                sizes — the depth budget is better spent on headings and chrome. */}
            <Reveal delay={380} as="p" className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
              {profile.tagline}{" "}
              <span className="text-text">{profile.seeking}</span>
            </Reveal>

            <Reveal delay={460} className="d-raised flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <Pressable className="inline-flex">
                  <a
                    href="#work"
                    data-cursor="view"
                    className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-bg transition-shadow hover:shadow-[0_0_36px_-6px] hover:shadow-accent/60"
                  >
                    See my work
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </Pressable>
              </Magnetic>

              <Magnetic strength={0.24}>
                <Pressable className="inline-flex">
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="open"
                    className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    Resume ↓
                  </a>
                </Pressable>
              </Magnetic>
            </Reveal>
          </div>

          {/* Stat rail — four cards climbing in, one beat apart, and stepped across the
              elevation scale so the row itself has a front-to-back read rather than
              sitting as one flat strip. */}
          <Stair
            step={STEP.card}
            delay={0.1}
            className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4"
          >
            <Stat
              label="LeetCode solved"
              value={leetcode.total}
              detail={
                leetcode.live
                  ? `Global rank ${formatNumber(leetcode.ranking)}`
                  : "Latest recorded count"
              }
              tone="lime"
              live={leetcode.live}
              depth="front"
            />
            <Stat
              label="Contributions / yr"
              value={contributions.total}
              detail={contributions.live ? "GitHub · @uv844" : "Latest recorded count"}
              tone="cyan"
              live={contributions.live}
              depth="floating"
            />
            <Stat
              label="CGPA"
              value={Number(fallbackStats.cgpa)}
              decimals={2}
              suffix=" / 10"
              detail="B.Tech CSE · AI & ML"
              tone="violet"
              depth="raised"
            />
            <Stat
              label="Total solved"
              staticValue={fallbackStats.totalSolved}
              detail="LeetCode · GeeksforGeeks · CodeChef"
              tone="lime"
              depth="flush"
            />
          </Stair>

          <Reveal delay={280} className="d-raised mt-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="relative hidden h-10 w-px overflow-hidden bg-line sm:block"
            >
              <span className="scroll-cue-bar absolute inset-x-0 top-0 h-1/2 bg-accent" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Scroll to explore
            </span>
          </Reveal>
        </div>
      </Scene3D>

      {/* Tech marquee band. Outside the scene on purpose: it is a full-bleed strip, so a
          yawing plane would pull its edges away from the viewport sides and expose the
          page background behind them. */}
      <div
        className="marquee relative overflow-hidden border-y border-line bg-surface/40 py-3.5"
        aria-hidden="true"
      >
        <div className="marquee-track" style={{ ["--marquee-duration" as string]: "38s" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {item}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* Feather the edges into the page background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
      </div>
    </section>
  );
}
