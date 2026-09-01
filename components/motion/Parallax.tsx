"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll-linked vertical drift.
 *
 * This is the one effect here that CSS genuinely cannot do yet — scroll-driven
 * animations are still Chromium-only, so a scroll-position-to-transform mapping needs
 * a library. Framer Motion writes it as a MotionValue straight to the element's
 * transform, bypassing React entirely, so it costs no re-render per scroll frame.
 *
 * `offset` maps the element's whole pass through the viewport to 0→1, so the drift is
 * symmetric: it enters low and leaves high, and sits neutral when centred.
 */
export default function Parallax({
  children,
  distance = 36,
  className,
  style,
}: {
  children: ReactNode;
  /** Peak offset in px, applied ± around centre. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Collapsing the range rather than dropping `y` keeps the style object the same
  // shape across renders, so nothing thrashes when the media query resolves.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [distance, -distance],
  );

  return (
    <m.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </m.div>
  );
}
