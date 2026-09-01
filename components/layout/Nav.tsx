"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { navLinks, profile } from "@/content/profile";
import { useActiveSection } from "@/lib/hooks";
import { cn } from "@/lib/util";
import Magnetic from "@/components/fx/Magnetic";
import Scramble from "@/components/fx/Scramble";
import SceneToggle from "@/components/fx/SceneToggle";
import SoundToggle from "@/components/fx/SoundToggle";
import ScrollRail from "@/components/motion/ScrollRail";
import LiveClock from "@/components/widgets/LiveClock";

const SECTION_IDS = navLinks.map((l) => l.id);

export default function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The progress rail reads scrollYProgress as a MotionValue (see ScrollRail), so the
  // only thing React needs from scrolling is this one boolean. Setting it to the value
  // it already holds bails out, so the nav re-renders twice per page — not per frame.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[9000] transition-colors duration-500",
        scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      {/* Reading-progress hairline */}
      <ScrollRail />

      <nav className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a
          href="#top"
          data-cursor="top"
          className="group flex items-center gap-2.5"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-line-strong bg-surface font-mono text-[11px] font-semibold tracking-tight text-text transition-colors group-hover:border-accent group-hover:text-accent">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="go"
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                    isActive ? "text-accent" : "text-muted hover:text-text",
                  )}
                >
                  <Scramble text={link.label} trigger="hover" speed={2.2} />
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <SceneToggle />

          <div className="hidden items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted lg:flex">
            <LiveClock />
          </div>

          <Magnetic strength={0.28} className="hidden sm:inline-flex">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="flex items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Resume
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-text transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-full bg-text transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-text transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-bg/95 px-5 pb-5 pt-2 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-line py-3.5 font-mono text-xs uppercase tracking-[0.16em]",
                  active === link.id ? "text-accent" : "text-muted",
                )}
              >
                {link.label}
                <span aria-hidden="true" className="text-dim">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-md border border-accent/40 bg-accent/10 py-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-accent"
        >
          Download Resume
        </a>
      </div>
    </header>
  );
}
