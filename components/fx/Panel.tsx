"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/util";
import type { DepthLevel } from "@/lib/motion";
import { useCardPointer } from "./useCardPointer";

const TONE = {
  lime: "var(--color-accent)",
  cyan: "var(--color-accent-2)",
  violet: "var(--color-violet)",
} as const;

const DEPTH_CLASS: Record<DepthLevel, string> = {
  flush: "d-flush",
  raised: "d-raised",
  floating: "d-floating",
  front: "d-front",
};

export type Tone = keyof typeof TONE;

/**
 * The site's card primitive: a pointer-tracking border glow with optional 3D tilt,
 * specular glare, HUD corner brackets and a live rotation readout. All motion runs
 * through CSS variables written by useCardPointer, so hovering a card costs no React
 * renders.
 */
export default function Panel({
  children,
  className,
  tone = "lime",
  tilt = 0,
  lift = 0,
  pop,
  depth,
  hud = false,
  readout = false,
  glare = false,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  /** Max rotation in degrees. 0 disables tilt. */
  tilt?: number;
  /** Hover lift in px. */
  lift?: number;
  /** Hover push toward the viewer in px. Defaults to a value scaled off `tilt`. */
  pop?: number;
  /** Where this card sits on the site's elevation scale, inside its section's plane. */
  depth?: DepthLevel;
  /** Corner brackets. */
  hud?: boolean;
  /** Live `RX… RY… Z…` readout, bottom-right. Implies `hud`. */
  readout?: boolean;
  glare?: boolean;
  as?: "div" | "article" | "li" | "section";
  style?: CSSProperties;
} & Record<string, unknown>) {
  // A tilting card should also come toward you, or the rotation reads as a flat skew.
  const zPop = pop ?? (tilt > 0 ? Math.round(tilt * 3.5) : 0);
  const ref = useCardPointer<HTMLDivElement>({ tilt, lift, pop: zPop });
  const depthClass = depth ? DEPTH_CLASS[depth] : undefined;

  const content = (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as never}
      data-hover="false"
      className={cn(
        "panel",
        tilt > 0 && "tilt",
        // With no tilt the panel owns no transform, so the depth class can live directly
        // on it. That keeps this component from ever introducing a wrapper element that
        // would break an `h-full` handed in by the call site.
        tilt === 0 && depthClass,
        className,
      )}
      style={{ ["--panel-glow" as string]: TONE[tone], ...style }}
      {...rest}
    >
      {glare ? <span className="glare" aria-hidden="true" /> : null}
      {hud || readout ? <span className="hud-corners" aria-hidden="true" /> : null}
      {children}
      {readout ? (
        <span
          data-readout
          aria-hidden="true"
          className="hud-readout pointer-events-none absolute bottom-2 right-3 z-[4]"
        >
          RX+00.0 RY+00.0 Z{String(zPop).padStart(2, "0")}
        </span>
      ) : null}
    </Tag>
  );

  // Perspective has to live on an ancestor of the rotating element — and when the panel
  // is tilting it already owns its transform, so the depth offset rides that same
  // pre-existing wrapper rather than a new one.
  return tilt > 0 ? (
    <div
      className={cn(
        "tilt-scene",
        // The wrapper has to pass a stretched height through, or a card told to fill its
        // grid cell would instead measure against an auto-height wrapper and collapse.
        className?.includes("h-full") && "h-full",
        depthClass,
      )}
    >
      {content}
    </div>
  ) : (
    content
  );
}
