"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/util";

/** Shared with RoleCycle, so every decode on the page churns the same alphabet. */
export const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%$&@";

/**
 * Decodes text character-by-character out of random glyphs.
 *
 * Renders the real string on the server (so it's readable without JS and to
 * crawlers), then scrambles and resolves it on trigger. Length never changes and
 * spaces are preserved, so it can't cause layout shift.
 */
export default function Scramble({
  text,
  trigger = "visible",
  speed = 1.6,
  className,
}: {
  text: string;
  /** "visible" fires once on scroll-in; "hover" re-fires on pointer enter. */
  trigger?: "visible" | "hover";
  /** Characters resolved per frame at 60fps. Higher = faster. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    let raf = 0;

    // Milliseconds a character stays scrambled. `speed` is still expressed in characters per
    // frame, but it is converted to wall-clock time here rather than driving a frame counter:
    // counting frames makes the decode's duration a function of the machine's frame rate, and
    // on a loaded box where a frame costs ~200ms that stretches a short label from ~80ms of
    // noise into most of a second. Same look at 60fps, no drift below it. RoleCycle carries the
    // measurement that prompted this.
    const msPerChar = 1000 / 60 / speed;

    const run = () => {
      cancelAnimationFrame(raf);
      const started = performance.now();

      const tick = () => {
        const resolved = Math.floor((performance.now() - started) / msPerChar);
        if (resolved >= text.length) {
          el.textContent = text;
          raf = 0;
          return;
        }

        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < resolved || ch === " ") {
            out += ch;
          } else {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
        }
        el.textContent = out;
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    if (trigger === "hover") {
      // The trigger is the nearest interactive ancestor, so hovering a whole
      // nav item or card decodes its label.
      const host = el.closest<HTMLElement>("a, button, [data-scramble-host]") ?? el;
      host.addEventListener("pointerenter", run);
      return () => {
        host.removeEventListener("pointerenter", run);
        cancelAnimationFrame(raf);
      };
    }

    if (typeof IntersectionObserver === "undefined") {
      el.textContent = text;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, trigger, speed]);

  return (
    <span ref={ref} className={cn(className)}>
      {text}
    </span>
  );
}
