import type { Transition, Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole site.
 *
 * Everything animated with Framer Motion pulls its spring and its stagger step from
 * here, so the page has a single rhythm instead of each section inventing its own
 * timing. Anything that needs to feel different should get a named entry here rather
 * than an inline number at the call site.
 *
 * Two hard rules encoded below:
 *  - transform + opacity only, never width/height/top/left (no layout work per frame)
 *  - exits are shorter than entrances, so dismissing never feels sluggish
 */

/** Arrival: overshoots a touch, settles. Used by every scroll reveal. */
export const springIn: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.5,
  restDelta: 0.001,
};

/** Snappier spring for direct manipulation — hover, press, magnetic pull. */
export const springTouch: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.5,
};

/** Long, heavily damped spring for scroll-linked values (progress rail). */
export const springScroll: Transition = {
  stiffness: 130,
  damping: 26,
  restDelta: 0.0005,
};

/**
 * Heavier still, for the 3D scene planes.
 *
 * The scene's pitch is driven by raw scroll position, which arrives in whatever
 * increments the wheel or trackpad emits. Running it through a soft spring turns those
 * steps into one continuous turn and gives the room some mass — a plane that snapped
 * instantly to scroll would read as a jitter, not as depth.
 */
export const springScene: Transition = {
  stiffness: 90,
  damping: 22,
  restDelta: 0.0005,
};

/** Deceleration curve, for the few places a spring would overshoot badly. */
export const easeOutExpo: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

/**
 * The 3D scene, in one place.
 *
 * Angles are deliberately tiny. The visual read comes from *differential* scale across
 * a plane, not from a big rotation: at 1.5° on a 1152px plane with an 1800px
 * perspective the near edge grows about 0.85%, which is plainly legible as depth while
 * costing almost no glyph resampling. Anything past ~3° starts to look like a gimmick
 * and starts overflowing the section's horizontal padding.
 */
export const SCENE = {
  /** Viewing distance in px. Larger = weaker, more architectural perspective. */
  perspective: 1800,
  /** Max yaw in deg, pointer-driven, applied ± around centre. */
  yaw: 1.5,
  /** Max pitch in deg, scroll-driven: tilts in, levels at centre, tilts out. */
  pitch: 2,
  /** The hero is the one place that gets a deeper read than the rest. */
  heroPerspective: 1400,
  heroYaw: 2.2,
  heroPitch: 2.4,
} as const;

/**
 * Four-level elevation scale, in px of translateZ inside a preserve-3d parent.
 *
 * This is what separates real depth from a decal: without it, every element sits on the
 * same plane and rotating that plane just skews a flat picture. Assigning elements to
 * distinct levels means they move at different rates as the plane turns, which is the
 * actual parallax cue the eye reads as distance.
 *
 * Keep to these four. An ad-hoc translateZ at the call site is the 3D equivalent of an
 * inline animation duration.
 *
 * These numbers are mirrored by the `.d-flush / .d-raised / .d-floating / .d-front`
 * utilities in globals.css, which is where they are actually applied — as a unitless
 * `--dzn` so the counter-scale can divide by the section's own perspective. Edit both.
 */
export const DEPTH = {
  /** On the plane — rules, dividers, background chrome. */
  flush: 0,
  /** Just off the surface — mono labels, chips, HUD readouts. */
  raised: 16,
  /** Clearly floating — headings, stat values, key figures. */
  floating: 38,
  /** Front-most focal object — portrait frame, project screenshot. */
  front: 70,
} as const;

export type DepthLevel = keyof typeof DEPTH;

/**
 * Per-item stagger, in seconds.
 *
 * Material's guidance is 30–50ms per item; long lists need the low end or the total
 * reveal time becomes sluggish, so pick by item count, not by taste.
 */
export const STEP = {
  /** ≤ 6 items — cards, panels, feature blocks. */
  card: 0.035,
  /** 7–14 items — fact rows, chip groups, feed entries. */
  row: 0.024,
  /** Words inside a heading. */
  word: 0.028,
  /** 15+ items. */
  dense: 0.015,
} as const;

/** Shared viewport trigger: fire once, a little before the element is fully in. */
export const VIEWPORT = { once: true, amount: 0.02 } as const;

/** Same, for tall blocks that would otherwise wait too long to trigger. */
export const VIEWPORT_TALL = { once: true, amount: 0.01 } as const;

/**
 * Container variant. Holds no visual state of its own — it exists purely to
 * sequence its children, which is what makes the staircase read as one gesture
 * rather than as N separate reveals.
 */
export function stairContainer(step: number, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

export type StairDirection = "up" | "down" | "left" | "right";

/**
 * Child variant — the actual "step".
 *
 * The horizontal offset is what makes this a staircase rather than a plain fade-up:
 * items arrive diagonally, each one landing a beat after the last, so the group
 * resolves like a flight of steps being climbed.
 */
export function stairStep(
  direction: StairDirection = "up",
  rise = 26,
  shift = 16,
): Variants {
  const from =
    direction === "up"
      ? { y: rise, x: -shift }
      : direction === "down"
        ? { y: -rise, x: shift }
        : direction === "left"
          ? { x: -rise, y: shift }
          : { x: rise, y: shift };

  return {
    hidden: { opacity: 0, ...from },
    show: { opacity: 1, x: 0, y: 0, transition: springIn },
  };
}
