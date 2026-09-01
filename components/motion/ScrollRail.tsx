"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { springScroll } from "@/lib/motion";

/**
 * Reading-progress hairline under the nav.
 *
 * `scrollYProgress` is a MotionValue, and `scaleX` reads it directly — so the rail
 * updates on the compositor without the nav re-rendering on scroll. The spring is what
 * makes it feel attached rather than glued: it lags a beat behind a flick and settles,
 * instead of snapping to the exact scroll offset every frame.
 */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, springScroll);

  return (
    <m.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-violet"
      style={{ scaleX }}
    />
  );
}
