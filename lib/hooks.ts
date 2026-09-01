"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Matches a media query with an SSR-safe initial value of `false`.
 * Everything gated on these hooks degrades to "off" for the first paint, which is
 * exactly what we want — no hydration mismatch, no effects firing before we know
 * the user's preferences.
 */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the user has asked for reduced motion. Gates every non-essential effect. */
export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** True only for mouse/trackpad/stylus — never touch. Gates the custom cursor. */
export const useFinePointer = () =>
  useMediaQuery("(pointer: fine) and (hover: hover)");

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");

/**
 * Reveal-on-scroll. Adds `data-visible="true"` to the element once it enters the
 * viewport, then stops observing it — the animation itself is pure CSS, so this
 * costs one observer callback per element for the whole page lifetime.
 */
export function useReveal<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IO is unavailable, show content rather than hiding it forever.
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            io.unobserve(entry.target);
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? "0px 0px 50px 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}

/**
 * Tracks which section is currently in view, for the nav's active indicator.
 * Driven by IntersectionObserver rather than scroll math, so there's no
 * scroll-handler cost.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0, 0.2, 0.5, 0.8], rootMargin: "-20% 0px -35% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
