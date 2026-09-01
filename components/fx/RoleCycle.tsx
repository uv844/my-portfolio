"use client";

import { useEffect, useRef } from "react";
import { GLYPHS } from "./Scramble";

/**
 * Cycles a word in place, decoding each one out of random glyphs — Scramble's
 * treatment on a loop, so the headline can state more than one thing.
 *
 * **One text node, mutated.** Stacking the words as siblings and cross-fading
 * them is the obvious alternative and does not work here: the h1 paints its
 * gradient with `background-clip: text`, whose clip region is the union of the
 * glyphs of every in-flow descendant. That region is geometric, so `opacity: 0`
 * on an inactive word hides its own painting but still contributes its glyphs —
 * every role would show at once. A single node sidesteps it entirely, and costs
 * no library and no extra DOM.
 *
 * The span is `aria-hidden` and the first role is repeated in an `sr-only`
 * sibling at the call site, so the heading's accessible name stays fixed while
 * the visual text churns.
 */
export default function RoleCycle({
  roles,
  hold = 2400,
  className,
}: {
  roles: readonly string[];
  /** How long a resolved word holds, in ms, before the next one decodes in. */
  hold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || roles.length < 2) return;

    // A headline that rewrites itself is precisely the kind of unasked-for
    // movement this setting exists to stop, so it stays on the first role.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    let index = 0;

    /**
     * How long one character stays scrambled. 1.8 frames per character at 60fps — the exact
     * rhythm this used to have when it counted frames instead of milliseconds.
     */
    const MS_PER_CHAR = 1000 / 60 * 1.8;

    /**
     * Locks the target in left to right; everything past the cursor is noise.
     *
     * The cursor advances on WALL-CLOCK time, deliberately, not on a frame counter. It used
     * to be `Math.floor(frame / 1.8)`, which ties the decode's *duration* to the frame rate:
     * sampling this headline every 50ms for 12s on a loaded machine found it showing glyph
     * noise 52% of the time, with unbroken scrambled runs of 800ms, because a frame there
     * costs ~200ms rather than 16ms and a 12-character role took ~2.5s to resolve instead of
     * 360ms. The most prominent element on the page being unreadable half the time is worse
     * than having no effect at all. Reading the cursor off elapsed time leaves the 60fps look
     * untouched and makes a slow frame rate cost frames *of the effect* rather than seconds
     * *of legibility* — the effect degrades, the message does not.
     */
    const decode = (text: string) => {
      const started = performance.now();

      const tick = () => {
        const locked = Math.floor((performance.now() - started) / MS_PER_CHAR);

        if (locked >= text.length) {
          el.textContent = text;
          timer = window.setTimeout(advance, hold);
          return;
        }

        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          // Separators are never scrambled — the churn keeps the silhouette of a
          // hyphenated word instead of dissolving into an unbroken block.
          out +=
            i < locked || ch === " " || ch === "-"
              ? ch
              : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }

        el.textContent = out;
        raf = requestAnimationFrame(tick);
      };

      tick();
    };

    const advance = () => {
      index = (index + 1) % roles.length;
      decode(roles[index]);
    };

    timer = window.setTimeout(advance, hold);

    // Background tabs throttle rAF but not setTimeout, so without this the
    // pending decodes would queue up and burst on return.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(advance, hold);
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [roles, hold]);

  return (
    <span ref={ref} aria-hidden="true" className={className}>
      {roles[0]}
    </span>
  );
}
