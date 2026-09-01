import { profile, socials } from "@/content/profile";
import { STEP } from "@/lib/motion";
import SectionHeading from "@/components/layout/SectionHeading";
import Panel from "@/components/fx/Panel";
import Magnetic from "@/components/fx/Magnetic";
import SpotlightText from "@/components/fx/SpotlightText";
import LiveClock from "@/components/widgets/LiveClock";
import CopyField from "@/components/widgets/CopyField";
import Pressable from "@/components/motion/Pressable";
import Scene3D from "@/components/motion/Scene3D";
import { Stair, StairStep } from "@/components/motion/Stair";

export default function Contact() {
  return (
    <section id="contact" className="defer-paint relative py-20 sm:py-28">
      <Scene3D>
        <div className="p3d mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading index="08" eyebrow="Contact" title="Let's build something." />

          {/* The two panels close in from opposite edges — the last gesture on the
              page, so it gets the wider travel. */}
          <Stair
            step={STEP.card}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]"
          >
            {/* Pitch */}
            <StairStep direction="left" rise={30}>
              <Panel
                tone="lime"
                tilt={4}
                lift={4}
                depth="floating"
                hud
                className="flex h-full flex-col p-6 sm:p-8"
              >
                {/* The closing question is the last thing anyone reads here, so it stands
                    off the card face and rises further when the panel is hovered. */}
                <SpotlightText
                  as="p"
                  className="tilt-pop font-display text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight"
                >
                  Looking for a developer who ships and asks questions early?
                </SpotlightText>

                <p className="mt-5 max-w-lg text-pretty text-[15px] leading-relaxed text-muted">
                  I&apos;m open to internships and graduate roles across full-stack,
                  frontend and backend engineering. If you have something in React,
                  Java, Node or API work, send it over — I reply to everything.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Magnetic strength={0.28}>
                    <Pressable className="inline-flex">
                      <a
                        href={`mailto:${profile.email}`}
                        data-cursor="email"
                        className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-bg transition-shadow hover:shadow-[0_0_36px_-6px] hover:shadow-accent/60"
                      >
                        Email me
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </a>
                    </Pressable>
                  </Magnetic>

                  <Magnetic strength={0.22}>
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
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-10">
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
                    </a>
                  ))}
                </div>
              </Panel>
            </StairStep>

            {/* Details */}
            <StairStep direction="right" rise={30}>
              <Panel
                tone="cyan"
                tilt={4}
                lift={4}
                depth="raised"
                hud
                readout
                className="flex h-full flex-col p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="mono-label">Direct</h3>
                  <span className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                    <span
                      aria-hidden="true"
                      className="pulse-dot h-1 w-1 rounded-full bg-accent"
                    />
                    {profile.availableLabel}
                  </span>
                </div>

                <div className="mt-5">
                  <CopyField
                    label="Email"
                    value={profile.email}
                    href={`mailto:${profile.email}`}
                  />
                  <CopyField
                    label="Phone"
                    value={profile.phone}
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  />
                </div>

                <dl className="mt-6 space-y-4">
                  <div>
                    <dt className="mono-label text-[10px]">Location</dt>
                    <dd className="mt-1.5 text-[14px] text-text">
                      {profile.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="mono-label text-[10px]">Local time</dt>
                    <dd className="mt-1.5 tnum text-[14px] text-text">
                      {/* LiveClock renders its own IST suffix — do not add another. */}
                      <LiveClock />
                    </dd>
                  </div>
                </dl>

                {/* Bottom-right is where Panel prints its `readout`, so this rule keeps a
                    little clear space above it rather than sharing the same line. */}
                <p className="mt-auto border-t border-line pt-5 pb-3 font-mono text-[10px] leading-relaxed uppercase tracking-[0.1em] text-dim">
                  Typical reply within a day. Timezone UTC+5:30.
                </p>
              </Panel>
            </StairStep>
          </Stair>
        </div>
      </Scene3D>
    </section>
  );
}
