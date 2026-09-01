"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/lib/pointer";

/**
 * The depth field behind the page: a perspective-projected point cloud drifting toward
 * the camera over a receding wireframe floor.
 *
 * This is a real 3D projection, not a 2D constellation with a fake parallax. Points live
 * in world space and are projected with `k = FOCAL / (FOCAL + z)`, so their screen
 * position, size, brightness and apparent speed all fall out of one depth value. The
 * floor grid uses the same projection, which is what makes the two read as the same
 * space rather than two stacked decorations.
 *
 * Camera rotation uses the small-angle form of a yaw/pitch: `x' = x + z·θ`. A perspective
 * projection maps straight lines to straight lines and this shear is linear, so the grid
 * lines stay straight and only need their two endpoints projected — which is why the
 * whole floor costs about fifty line segments a frame.
 *
 * Cost controls that matter here:
 *  - `fillRect`, not `arc`. Square points suit the aesthetic and skip path construction
 *    entirely, which is what makes several hundred of them affordable.
 *  - Alpha is quantised into bands and drawn band by band, so `globalAlpha` is assigned
 *    a handful of times per frame instead of building and parsing several hundred
 *    `rgba(...)` strings.
 *  - The grid's depth fade is one canvas gradient built at resize, so the entire floor is
 *    two `strokeStyle` assignments regardless of line count.
 *  - Linking is restricted to the near depth band. The old O(n²) pass was fine at 88
 *    points but would be millions of checks at this count.
 *  - Reads the shared pointer state directly — no listener of its own, no React state.
 *
 * Under reduced motion it draws exactly one static frame: the space stays dimensional,
 * but nothing moves and no rAF is ever scheduled. It is still skipped entirely on touch
 * and small screens, where the canvas backing store is a real memory cost for decoration.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = !window.matchMedia("(min-width: 768px)").matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /** Viewing distance. Smaller = more dramatic convergence. */
    const FOCAL = 900;
    /** Point cloud depth range. */
    const NEAR = 60;
    const FAR = 1600;
    /** The floor runs much deeper than the cloud so it converges near a true horizon. */
    const GRID_FAR = 6000;
    const GRID_HALF = 1900;
    const GRID_STEP = 200;
    /** World units per frame. Deliberately slow — a calm drift, not a starfield. */
    const SPEED = 0.55;
    /** Max camera shear, in world units of x per unit of z. */
    const YAW = 0.12;
    const PITCH = 0.07;
    /** Only the nearest slice links to its neighbours and to the cursor. */
    const LINK_Z = 650;
    const LINK_DIST = 140;
    const CURSOR_DIST = 260;
    const BANDS = 6;

    type P = {
      x: number;
      y: number;
      z: number;
      /** Projected each frame, then reused by the draw and link passes. */
      sx: number;
      sy: number;
      ss: number;
      band: number;
      near: boolean;
    };

    let pts: P[] = [];
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let gridFade: CanvasGradient | null = null;
    let horizonFade: CanvasGradient | null = null;
    /** Reused across frames so the link pass allocates nothing. */
    let nearIdx = new Int32Array(0);

    const kOf = (z: number) => FOCAL / (FOCAL + z);
    const K_NEAR = kOf(NEAR);
    const K_FAR = kOf(FAR);

    function spawn(z: number): P {
      // x/y are generous relative to the viewport: a point at the far plane is scaled
      // down hard, so the spread has to overshoot or the field looks like a narrow column.
      return {
        x: (Math.random() - 0.5) * w * 2.4,
        y: (Math.random() - 0.5) * h * 2.2,
        z,
        sx: 0,
        sy: 0,
        ss: 1,
        band: 0,
        near: false,
      };
    }

    function resize() {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The floor fans downward from the horizon at the vertical centre, so a single
      // vertical gradient fades every grid line correctly — both the lines of constant z
      // and the lines converging in x — for two strokeStyle assignments a frame.
      gridFade = ctx!.createLinearGradient(0, cy - 4, 0, h);
      gridFade.addColorStop(0, "rgba(255,255,255,0)");
      gridFade.addColorStop(0.18, "rgba(255,255,255,0.035)");
      gridFade.addColorStop(1, "rgba(255,255,255,0.085)");

      horizonFade = ctx!.createLinearGradient(0, 0, w, 0);
      horizonFade.addColorStop(0, "rgba(34,211,238,0)");
      horizonFade.addColorStop(0.5, "rgba(34,211,238,0.16)");
      horizonFade.addColorStop(1, "rgba(34,211,238,0)");

      // ~1 point per 4k css px², clamped for smooth 60FPS performance.
      const minPts = isMobile ? 80 : 120;
      const maxPts = isMobile ? 140 : 280;
      const target = Math.round(Math.min(Math.max((w * h) / 3400, minPts), maxPts));
      if (pts.length > target) {
        pts.length = target;
      } else {
        while (pts.length < target) {
          pts.push(spawn(NEAR + Math.random() * (FAR - NEAR)));
        }
      }
      if (nearIdx.length < pts.length) nearIdx = new Int32Array(pts.length);
    }

    /** Floor grid. Two endpoints per line, because projection preserves straightness. */
    function drawGrid(ax: number, ay: number) {
      // World height of the floor below the camera. Tied to viewport height so the
      // horizon lands at the vertical centre on any screen.
      const gy = Math.max(h * 0.46, 300);

      ctx!.strokeStyle = gridFade!;
      ctx!.lineWidth = 1;
      ctx!.beginPath();

      // Lines of constant z — uniform in world space, so they bunch toward the horizon.
      for (let z = NEAR; z <= GRID_FAR; z += GRID_STEP) {
        const k = kOf(z);
        const y = cy + (gy + z * ay) * k;
        if (y < cy - 2) continue;
        ctx!.moveTo(cx + (-GRID_HALF + z * ax) * k, y);
        ctx!.lineTo(cx + (GRID_HALF + z * ax) * k, y);
      }

      // Lines of constant x, converging toward the vanishing point.
      const kA = kOf(NEAR);
      const kB = kOf(GRID_FAR);
      const yA = cy + (gy + NEAR * ay) * kA;
      const yB = cy + (gy + GRID_FAR * ay) * kB;
      for (let x = -GRID_HALF; x <= GRID_HALF; x += GRID_STEP) {
        ctx!.moveTo(cx + (x + NEAR * ax) * kA, yA);
        ctx!.lineTo(cx + (x + GRID_FAR * ax) * kB, yB);
      }
      ctx!.stroke();

      // Horizon.
      ctx!.strokeStyle = horizonFade!;
      ctx!.beginPath();
      ctx!.moveTo(0, yB);
      ctx!.lineTo(w, yB);
      ctx!.stroke();
    }

    function draw(advance: boolean) {
      ctx!.clearRect(0, 0, w, h);

      // The camera rides the heavily smoothed pointer — the same value the section planes
      // yaw off — so the background and the content turn as one space.
      const ax = pointer.active ? pointer.snx * YAW : 0;
      const ay = pointer.active ? pointer.sny * PITCH : 0;

      drawGrid(ax, ay);

      // Pass 1: advance and project. Nothing is drawn here, so the draw pass can be
      // ordered by alpha band instead of by particle.
      let nearCount = 0;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (advance) {
          p.z -= SPEED;
          // Recycle to the far plane with a fresh x/y, so the field never repeats.
          if (p.z <= NEAR) {
            const fresh = spawn(FAR);
            p.x = fresh.x;
            p.y = fresh.y;
            p.z = FAR;
          }
        }
        const k = kOf(p.z);
        p.sx = cx + (p.x + p.z * ax) * k;
        p.sy = cy + (p.y + p.z * ay) * k;
        p.ss = k > 0.66 ? 3 : k > 0.42 ? 2 : 1;
        const t = (k - K_FAR) / (K_NEAR - K_FAR);
        p.band = Math.min(BANDS - 1, Math.max(0, Math.floor(t * BANDS)));
        p.near = p.z < LINK_Z && p.sx > -40 && p.sx < w + 40 && p.sy > -40 && p.sy < h + 40;
        if (p.near) nearIdx[nearCount++] = i;
      }

      // Pass 2: one globalAlpha assignment per band rather than one colour string per
      // point. BANDS × n is a few thousand trivial comparisons, far cheaper than the
      // string allocation and colour parsing it replaces.
      ctx!.fillStyle = "rgb(160,167,182)";
      for (let b = 0; b < BANDS; b++) {
        ctx!.globalAlpha = 0.07 + 0.46 * ((b + 0.5) / BANDS);
        for (const p of pts) {
          if (p.band !== b) continue;
          ctx!.fillRect(p.sx | 0, p.sy | 0, p.ss, p.ss);
        }
      }
      ctx!.globalAlpha = 1;

      // Pass 3: links, near band only.
      ctx!.lineWidth = 1;
      for (let i = 0; i < nearCount; i++) {
        const a = pts[nearIdx[i]];
        for (let j = i + 1; j < nearCount; j++) {
          const b = pts[nearIdx[j]];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          if (dx > LINK_DIST || dx < -LINK_DIST || dy > LINK_DIST || dy < -LINK_DIST) {
            continue;
          }
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          ctx!.strokeStyle = `rgba(255,255,255,${((1 - dist / LINK_DIST) * 0.075).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(a.sx, a.sy);
          ctx!.lineTo(b.sx, b.sy);
          ctx!.stroke();
        }
      }

      // Pass 4: cursor links & glow aura — interactive point connections
      if (pointer.active) {
        const px = pointer.x;
        const py = pointer.y;

        // Radial glow aura around active cursor location
        const aura = ctx!.createRadialGradient(px, py, 0, px, py, CURSOR_DIST * 0.85);
        aura.addColorStop(0, "rgba(74, 222, 128, 0.16)");
        aura.addColorStop(0.4, "rgba(34, 211, 238, 0.06)");
        aura.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx!.fillStyle = aura;
        ctx!.beginPath();
        ctx!.arc(px, py, CURSOR_DIST * 0.85, 0, Math.PI * 2);
        ctx!.fill();

        for (let i = 0; i < nearCount; i++) {
          const p = pts[nearIdx[i]];
          const dx = p.sx - px;
          const dy = p.sy - py;
          if (dx > CURSOR_DIST || dx < -CURSOR_DIST || dy > CURSOR_DIST || dy < -CURSOR_DIST) {
            continue;
          }
          const dist = Math.hypot(dx, dy);
          if (dist > CURSOR_DIST) continue;
          const t = 1 - dist / CURSOR_DIST;

          // Glowing laser connection line
          ctx!.strokeStyle = `rgba(74,222,128,${(t * 0.65).toFixed(3)})`;
          ctx!.lineWidth = t * 1.6;
          ctx!.beginPath();
          ctx!.moveTo(px, py);
          ctx!.lineTo(p.sx, p.sy);
          ctx!.stroke();

          // Highlighted green square node point at connection target
          ctx!.fillStyle = `rgba(74,222,128,${(t * 0.85).toFixed(3)})`;
          const s = p.ss + 3;
          ctx!.fillRect((p.sx | 0) - 1, (p.sy | 0) - 1, s, s);
        }
      }
    }

    function frame() {
      draw(true);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onResize() {
      resize();
      if (still) draw(false);
    }

    resize();

    if (still) {
      // One frame, then nothing. The space keeps its depth; the motion is gone.
      draw(false);
      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }

    start();
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
