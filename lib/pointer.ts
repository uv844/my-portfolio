/**
 * The performance core of the site.
 *
 * Every cursor-reactive effect reads from this ONE module. There is exactly one
 * `pointermove` listener and exactly one `requestAnimationFrame` loop for the whole
 * page, and the loop writes CSS custom properties on <html> rather than calling
 * React state setters. That means moving the mouse triggers zero React re-renders —
 * the spotlight, cursor ring and glow all animate purely in CSS off these variables.
 *
 * Published variables:
 *   --mx / --my    pointer position, lightly smoothed  (cursor ring — snappy)
 *   --sx / --sy    pointer position, heavily smoothed  (spotlight — laggy, adds depth)
 *   --mxp / --myp  pointer position as 0-100 viewport percentages
 *   --pnx / --pny  signed -1..1 offset from viewport centre, unitless    (snappy)
 *   --snx / --sny  the same, from the heavily smoothed position          (weighty)
 *   --pdown        1 while the pointer is pressed, else 0
 *
 * The -1..1 pairs exist because a percentage cannot be multiplied by an angle in
 * calc(). Being unitless, they can: `rotateY(calc(var(--snx) * 1.5deg))`. That is what
 * lets the 3D scene planes yaw in pure CSS with no per-frame JavaScript at all. They
 * are registered with @property in globals.css so they interpolate as numbers.
 *
 * The cost this design does pay, and where it is documented: writing an inherited custom
 * property on <html> invalidates the computed style of the entire document. See the note on
 * `put()` below for the measured element counts and why the writes are deliberately coarse.
 */

export type PointerState = {
  /** Raw target position in viewport px. */
  tx: number;
  ty: number;
  /** Lightly smoothed. */
  x: number;
  y: number;
  /** Heavily smoothed. */
  sx: number;
  sy: number;
  /** Signed -1..1 offset from viewport centre, lightly smoothed. */
  nx: number;
  ny: number;
  /** The same, heavily smoothed — what the 3D scene planes yaw off. */
  snx: number;
  sny: number;
  down: boolean;
  /** False until the user actually moves a fine pointer — effects stay hidden. */
  active: boolean;
};

const initial = () => ({
  tx: -1000,
  ty: -1000,
  x: -1000,
  y: -1000,
  sx: -1000,
  sy: -1000,
  nx: 0,
  ny: 0,
  snx: 0,
  sny: 0,
  down: false,
  active: false,
});

const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);

/** Shared mutable state. Read it directly from canvas loops; never put it in React state. */
export const pointer: PointerState = initial();

let refCount = 0;
let raf = 0;
let idleFrames = 0;
let listenersBound = false;

/**
 * Extra work to run inside the one shared frame.
 *
 * Anything that needs per-frame pointer values but cannot express itself in CSS — the
 * HUD telemetry strip writes text, which no CSS variable can do — subscribes here
 * instead of starting a second rAF loop. Subscribers must not read layout (no
 * getBoundingClientRect) or touch React state.
 */
type FrameFn = () => void;
const frameSubs = new Set<FrameFn>();

export function onFrame(fn: FrameFn): () => void {
  frameSubs.add(fn);
  ensureLoop();
  return () => {
    frameSubs.delete(fn);
  };
}

function onMove(e: PointerEvent) {
  pointer.tx = e.clientX;
  pointer.ty = e.clientY;
  if (!pointer.active) {
    // Jump rather than glide in from the corner on the very first move.
    pointer.x = pointer.sx = e.clientX;
    pointer.y = pointer.sy = e.clientY;
    pointer.active = true;
    document.documentElement.dataset.pointer = "active";
  }
  idleFrames = 0;
  ensureLoop();
}

function onDown() {
  pointer.down = true;
  document.documentElement.style.setProperty("--pdown", "1");
}

function onUp() {
  pointer.down = false;
  document.documentElement.style.setProperty("--pdown", "0");
}

function onLeave() {
  pointer.active = false;
  document.documentElement.dataset.pointer = "idle";
  // Keep the loop alive so the normalized pairs can ease back to zero — otherwise the
  // scene planes would stay frozen at whatever angle the cursor exited on.
  idleFrames = 0;
  ensureLoop();
}

function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
  } else {
    ensureLoop();
  }
}

/**
 * Publish a custom property only when its rendered string actually changes.
 *
 * Measured with a Chrome timeline trace (`UpdateLayoutTree.elementCount`, which is a count
 * and therefore immune to the machine contention that made every millisecond figure on this
 * box useless): one pointer frame recalculates the computed style of **1520-2048 of the
 * document's ~1700 elements**, while an idle frame touches a median of 23. Changing any
 * inherited custom property on <html> invalidates the whole tree — that is inherent to the
 * one-loop-writes-CSS-variables technique, and it is identical with `data-scene="off"`, so it
 * is not caused by the 3D transforms.
 *
 * Chrome coalesces a frame's writes into ONE recalc, so skipping nine of ten writes saves
 * only the CSSOM parse. The saving that matters is skipping *all ten*, which is what the
 * deliberately coarse precision below buys: as each spring asymptotes, successive frames
 * round to the same string, no property changes, and the document-wide recalc never fires.
 * The precisions are chosen to sit under perceptibility — 0.1px for positions, and 0.001 on
 * the -1..1 pairs, which at the hero's 2.2deg yaw is a 0.0022deg step.
 */
const published = new Map<string, string>();

function put(root: CSSStyleDeclaration, name: string, value: string) {
  if (published.get(name) === value) return;
  published.set(name, value);
  root.setProperty(name, value);
}

function frame() {
  raf = 0;

  const dx = pointer.tx - pointer.x;
  const dy = pointer.ty - pointer.y;
  const sdx = pointer.tx - pointer.sx;
  const sdy = pointer.ty - pointer.sy;

  pointer.x = pointer.tx;
  pointer.y = pointer.ty;
  pointer.sx += sdx * 0.25;
  pointer.sy += sdy * 0.25;

  // Signed offset from viewport centre, -1..1. The target collapses to 0 whenever the
  // pointer is not live, so scene planes ease back to square when the cursor leaves the
  // window instead of staying stuck at whatever angle it left on.
  const tnx = pointer.active ? clamp((pointer.tx / window.innerWidth) * 2 - 1) : 0;
  const tny = pointer.active ? clamp((pointer.ty / window.innerHeight) * 2 - 1) : 0;

  const ndx = tnx - pointer.nx;
  const ndy = tny - pointer.ny;
  const sndx = tnx - pointer.snx;
  const sndy = tny - pointer.sny;

  pointer.nx += ndx * 0.14;
  pointer.ny += ndy * 0.14;
  pointer.snx += sndx * 0.05;
  pointer.sny += sndy * 0.05;

  const root = document.documentElement.style;
  put(root, "--mx", `${pointer.x.toFixed(1)}px`);
  put(root, "--my", `${pointer.y.toFixed(1)}px`);
  put(root, "--sx", `${pointer.sx.toFixed(1)}px`);
  put(root, "--sy", `${pointer.sy.toFixed(1)}px`);
  // Percentages keep two decimals: they position gradients that span the whole viewport, so
  // a step here is worth ~14px of travel at 1440 rather than a fraction of one.
  put(root, "--mxp", `${((pointer.x / window.innerWidth) * 100).toFixed(2)}%`);
  put(root, "--myp", `${((pointer.y / window.innerHeight) * 100).toFixed(2)}%`);
  put(root, "--pnx", pointer.nx.toFixed(3));
  put(root, "--pny", pointer.ny.toFixed(3));
  put(root, "--snx", pointer.snx.toFixed(3));
  put(root, "--sny", pointer.sny.toFixed(3));

  // Text-writing consumers (the HUD strip) ride this loop rather than opening a second.
  for (const fn of frameSubs) fn();

  // Park the loop once everything has settled, so an idle tab costs nothing.
  const settled =
    Math.abs(dx) < 0.05 &&
    Math.abs(dy) < 0.05 &&
    Math.abs(sdx) < 0.05 &&
    Math.abs(sdy) < 0.05 &&
    Math.abs(ndx) < 0.0005 &&
    Math.abs(ndy) < 0.0005 &&
    Math.abs(sndx) < 0.0005 &&
    Math.abs(sndy) < 0.0005;
  if (settled) {
    idleFrames += 1;
  } else {
    idleFrames = 0;
  }

  if (idleFrames < 4 && (refCount > 0 || frameSubs.size > 0)) ensureLoop();
}

function ensureLoop() {
  if (!raf && (refCount > 0 || frameSubs.size > 0) && !document.hidden) {
    raf = requestAnimationFrame(frame);
  }
}

/**
 * Starts the shared loop. Safe to call from multiple components — it reference-counts,
 * so the listeners and rAF exist exactly once. Returns a disposer.
 */
export function acquirePointer(): () => void {
  refCount += 1;

  if (!listenersBound) {
    listenersBound = true;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
  }

  return () => {
    refCount -= 1;
    if (refCount <= 0) {
      refCount = 0;
      listenersBound = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      // onFrame subscribers are independent of pointer tracking, so only stop the
      // loop if nothing at all is left to drive.
      if (frameSubs.size === 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
  };
}
