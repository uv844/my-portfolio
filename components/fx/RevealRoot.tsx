"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page.
 *
 * Doing it centrally means `Reveal` itself can stay a server component and the whole
 * scroll-reveal system costs a single observer plus one callback per element, ever
 * (each element is unobserved the moment it fires).
 */
export default function RevealRoot() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => (n.dataset.visible = "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    nodes.forEach((n) => {
      // Anything already on screen at load reveals immediately, no scroll needed.
      const rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        n.dataset.visible = "true";
      } else {
        io.observe(n);
      }
    });

    return () => io.disconnect();
  }, []);

  return null;
}
