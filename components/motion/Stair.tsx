"use client";

import { m } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  STEP,
  VIEWPORT,
  VIEWPORT_TALL,
  stairContainer,
  stairStep,
  type StairDirection,
} from "@/lib/motion";
import { cn } from "@/lib/util";

/** `m` is a proxy, but TypeScript needs the element set spelled out. */
const TAGS = {
  div: m.div,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  dl: m.dl,
  span: m.span,
  p: m.p,
  section: m.section,
  article: m.article,
} as const;

type Tag = keyof typeof TAGS;

/**
 * Staircase scroll reveal — container half.
 *
 * The container carries no visual state. Its only job is to hold the stagger, which
 * is the whole point: N children revealing on their own IntersectionObservers look
 * like N unrelated fades, whereas one sequenced parent reads as a single gesture —
 * a flight of steps resolving as you arrive at it.
 *
 * Fires once (`viewport.once`), so scrolling back up never replays it.
 *
 * Both halves carry `p3d` (`transform-style: preserve-3d`) unconditionally. Every grid on
 * this page now sits inside a rotating section plane, and `preserve-3d` has to be present
 * on *every* element between that plane and a depth offset or the offset is flattened away.
 * Setting it here rather than at each call site means the depth cannot be silently lost by
 * forgetting a class on one grid out of nine; on a page with no perspective ancestor it
 * costs nothing, since `translateZ` has no effect without one.
 */
export function Stair({
  children,
  step = STEP.card,
  delay = 0,
  tall = false,
  className,
  as = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  /** Seconds between children. Use STEP.* rather than a literal. */
  step?: number;
  /** Seconds before the first child moves. */
  delay?: number;
  /** Trigger earlier — for blocks taller than the viewport. */
  tall?: boolean;
  className?: string;
  as?: Tag;
  style?: CSSProperties;
}) {
  const C = TAGS[as];
  return (
    <C
      data-stair="group"
      className={cn("p3d", className)}
      style={style}
      variants={stairContainer(step, delay)}
      initial="hidden"
      whileInView="show"
      viewport={tall ? VIEWPORT_TALL : VIEWPORT}
      {...rest}
    >
      {children}
    </C>
  );
}

/**
 * Staircase scroll reveal — step half. Must be a descendant of `Stair`; it takes its
 * timing from the parent's stagger and has no observer of its own.
 *
 * Drop-in shaped like `Reveal` (same `as` / `className` / `style` surface) so a grid
 * that used the CSS reveal can move onto the sequenced version without adding a
 * wrapper element.
 */
export function StairStep({
  children,
  direction = "up",
  rise = 26,
  shift = 16,
  className,
  as = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  direction?: StairDirection;
  /** Travel along the primary axis, px. */
  rise?: number;
  /** Diagonal offset — this is what makes it a stair and not a fade-up. */
  shift?: number;
  className?: string;
  as?: Tag;
  style?: CSSProperties;
}) {
  const C = TAGS[as];
  return (
    <C
      data-stair="step"
      className={cn("p3d", className)}
      style={style}
      variants={stairStep(direction, rise, shift)}
      {...rest}
    >
      {children}
    </C>
  );
}
