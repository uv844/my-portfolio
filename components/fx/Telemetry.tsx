"use client";

import { useEffect, useRef } from "react";
import { onFrame, pointer } from "@/lib/pointer";

/**
 * Fixed instrument strip, bottom-left: pointer coordinates, viewport, scroll depth.
 *
 * It must be mounted OUTSIDE every `Scene3D`, because a 3D-transformed ancestor becomes
 * the containing block for `position: fixed` descendants and this would quietly stop
 * being fixed to the viewport.
 *
 * Two update paths, on purpose:
 *  - Coordinates ride `onFrame` from the shared pointer loop, so this opens no second
 *    rAF. Writes are skipped unless the rounded value actually changed, which is most
 *    frames once the cursor is barely moving.
 *  - Scroll depth needs its own passive listener, because the pointer loop deliberately
 *    parks after a few idle frames and scrolling with a still cursor would otherwise
 *    never update. `scrollHeight` is cached at resize rather than read per event, so the
 *    handler triggers no layout.
 */
export default function Telemetry() {
  const xyRef = useRef<HTMLSpanElement>(null);
  const vpRef = useRef<HTMLSpanElement>(null);
  const scRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // The CSS guards hide this on touch and under reduced motion; bail here too so it
    // costs nothing rather than merely being invisible.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const xy = xyRef.current;
    const vp = vpRef.current;
    const sc = scRef.current;
    if (!xy || !vp || !sc) return;

    const pad = (n: number) => String(Math.max(0, n)).padStart(4, "0");

    let lastX = -1;
    let lastY = -1;
    let lastPct = -1;
    let scrollable = 1;
    let raf = 0;

    const stopFrame = onFrame(() => {
      const px = pointer.x | 0;
      const py = pointer.y | 0;
      if (px === lastX && py === lastY) return;
      lastX = px;
      lastY = py;
      xy.textContent = `X:${pad(px)} Y:${pad(py)}`;
    });

    const measure = () => {
      vp.textContent = `VP:${window.innerWidth}×${window.innerHeight}`;
      scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      writeScroll();
    };

    const writeScroll = () => {
      raf = 0;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      const clamped = pct < 0 ? 0 : pct > 100 ? 100 : pct;
      if (clamped === lastPct) return;
      lastPct = clamped;
      sc.textContent = `SCR:${String(clamped).padStart(3, "0")}%`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(writeScroll);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      stopFrame();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      // pr-16 is load-bearing: `.telemetry`'s occluding wash fades across exactly that
      // 4rem, so the readout never sits in the transparent part of the gradient.
      className="telemetry hidden items-end gap-3 pb-3 pl-4 pr-16 pt-2 md:flex"
      aria-hidden="true"
    >
      <span className="hud-ticks block w-16 opacity-60" />
      <span className="flex gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
        <span ref={xyRef}>X:0000 Y:0000</span>
        <span className="text-line-strong">/</span>
        <span ref={vpRef}>VP:0×0</span>
        <span className="text-line-strong">/</span>
        <span ref={scRef}>SCR:000%</span>
      </span>
    </div>
  );
}
