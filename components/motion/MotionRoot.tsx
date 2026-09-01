"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion root.
 *
 * Two deliberate choices here:
 *
 * `LazyMotion features={domAnimation}` loads only the DOM animation + gesture
 * features (variants, whileInView, whileHover/Tap/Focus). It leaves out layout
 * projection and drag, which this site never uses — that is most of the library's
 * weight. `strict` makes the choice enforceable: it throws if any component imports
 * `motion.*` instead of `m.*`, because `motion.*` self-bundles every feature and
 * would silently undo the saving.
 *
 * `reducedMotion="user"` means every transform animation in the app is skipped for
 * anyone with prefers-reduced-motion set, while opacity still crossfades — one
 * setting instead of a guard in each component. The CSS-driven effects have their
 * own `@media (prefers-reduced-motion)` block in globals.css.
 *
 * It is a client component wrapping server children, so the sections it contains
 * stay server-rendered; only the context provider ships.
 */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </LazyMotion>
  );
}
