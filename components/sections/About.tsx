import Image from "next/image";
import { profile, socials } from "@/content/profile";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import Panel from "@/components/fx/Panel";
import Parallax from "@/components/motion/Parallax";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

const FACTS = [
  { label: "Role", value: "Full stack — frontend, backend, APIs" },
  { label: "Studying", value: "B.Tech CSE (AI & ML), 2023 — 2027" },
  { label: "Based in", value: "Modinagar, Uttar Pradesh, India" },
  { label: "Focus", value: "React · TypeScript · Java · Node · REST APIs · MySQL" },
  { label: "Looking for", value: "Full stack / frontend / backend / Java roles" },
] as const;

export default function About() {
  return (
    <section id="about" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            index="02"
            eyebrow="Profile"
            title="Both ends of the stack."
          />

          <div className="p3d grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
            {/* Portrait — the deepest single element on the page. It tilts and catches a
                specular sweep under the cursor, drifts against the scroll, and sits a full
                step forward of the copy beside it, so the two columns visibly separate as
                the section plane turns. */}
            <Reveal variant="left" className="d-front">
              <Parallax distance={26}>
                <Panel
                  tone="lime"
                  tilt={9}
                  lift={6}
                  glare
                  hud
                  className="overflow-hidden p-0"
                >
                  {/* Perspective source for the name plate below: the Panel clips, which
                      forces flattening, so the plate needs a 3D context of its own. */}
                  <div className="pop-stage relative aspect-[853/1080] w-full">
                    <Image
                      src={profile.photo}
                      alt={`${profile.name}, ${profile.role}`}
                      fill
                      priority={false}
                      sizes="(max-width: 1024px) 100vw, 340px"
                      className="object-cover object-top"
                    />
                    {/* Grade the photo into the palette instead of letting it sit
                        as a bright rectangle on a near-black page. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-accent/[0.06] mix-blend-color"
                    />

                    <div className="tilt-pop absolute inset-x-0 bottom-0 p-5">
                      <p className="font-display text-lg font-semibold leading-tight">
                        {profile.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                        {profile.role}
                      </p>
                    </div>
                  </div>
                </Panel>
              </Parallax>
            </Reveal>

            <div className="p3d">
              <Reveal
                as="p"
                className="text-pretty text-[17px] leading-relaxed text-muted sm:text-lg"
              >
                {profile.summary}
              </Reveal>

              <Reveal
                delay={90}
                as="p"
                className="mt-5 text-pretty text-[15px] leading-relaxed text-muted"
              >
                Outside coursework I run my college&apos;s technical society, grind
                data-structures problems most days, and build things end to end —
                usually an API first, then whatever interface it needs. I care about
                code that is readable six months later.
              </Reveal>

              {/* Quick facts — rows step in from the left, one after another, on a plate
                  raised off the prose above them. */}
              <Stair
                as="dl"
                step={STEP.row}
                delay={0.08}
                className="d-raised mt-9 border-t border-line"
              >
                {FACTS.map((fact) => (
                  <StairStep
                    key={fact.label}
                    rise={14}
                    shift={26}
                    className="flex flex-col gap-1 border-b border-line py-3.5 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <dt className="mono-label w-28 shrink-0 text-[10px]">
                      {fact.label}
                    </dt>
                    <dd className="text-[14px] text-text">{fact.value}</dd>
                  </StairStep>
                ))}
              </Stair>

              <Reveal delay={420} className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="open"
                    className="link-wipe font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                  >
                    {social.label}
                    <span className="ml-1.5 text-dim">↗</span>
                  </a>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </Scene3D>
    </section>
  );
}
