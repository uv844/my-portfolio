"use client";

import { useEffect, useRef } from "react";

/**
 * Element-local pointer tracking for cards.
 *
 * Deliberately attaches its `pointermove` listener only between `pointerenter` and
 * `pointerleave` — at most one card is hovered at a time, so the page never has more
 * than one of these listeners live. Writes are rAF-batched straight to CSS custom
 * properties on the element, so there is no React state and no re-render while
 * tracking.
 *
 *   --px / --py   pointer position in element-local px (border glow + bloom)
 *   --gx / --gy   the same as percentages (glare sweep)
 *   --rx / --ry   tilt rotation in degrees
 *   --lift        hover lift in px
 *   --cz          hover push toward the viewer in px, so a hovered card reads as nearer
 *
 * It also fills the card's HUD readout, if it has one, by writing `textContent` on the
 * `[data-readout]` child. That is a DOM text write rather than a React render, and since
 * only one card is hovered at a time it is one write per frame for one element.
 */
export function useCardPointer<T extends HTMLElement>({
  tilt = 0,
  lift = 0,
  pop = 0,
}: { tilt?: number; lift?: number; pop?: number } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Touch devices and reduced-motion users get the static card.
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let raf = 0;
    let rect: DOMRect | null = null;
    let lx = 0;
    let ly = 0;
    let readout: HTMLElement | null = null;

    /** Fixed-width signed number, so the readout never reflows as digits change. */
    const sig = (n: number) =>
      (n < 0 ? "-" : "+") + Math.abs(n).toFixed(1).padStart(4, "0");

    const apply = () => {
      raf = 0;
      if (!rect || !rect.width || !rect.height) return;
      const fx = lx / rect.width;
      const fy = ly / rect.height;

      el.style.setProperty("--px", `${lx.toFixed(1)}px`);
      el.style.setProperty("--py", `${ly.toFixed(1)}px`);
      el.style.setProperty("--gx", `${(fx * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(fy * 100).toFixed(1)}%`);

      const rx = (0.5 - fy) * tilt;
      const ry = (fx - 0.5) * tilt;

      if (tilt) {
        el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      }

      if (readout) {
        readout.textContent = `RX${sig(rx)} RY${sig(ry)} Z${pop.toFixed(0).padStart(2, "0")}`;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      lx = e.clientX - rect.left;
      ly = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onEnter = (e: PointerEvent) => {
      rect = el.getBoundingClientRect();
      readout = el.querySelector<HTMLElement>("[data-readout]");
      el.dataset.hover = "true";
      if (lift) el.style.setProperty("--lift", `-${lift}px`);
      if (pop) el.style.setProperty("--cz", `${pop}px`);
      onMove(e);
      el.addEventListener("pointermove", onMove, { passive: true });
    };

    const onLeave = () => {
      el.dataset.hover = "false";
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      if (tilt) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
      if (lift) el.style.setProperty("--lift", "0px");
      if (pop) el.style.setProperty("--cz", "0px");
      readout = null;
    };

    // Recompute geometry on scroll only while hovered, so a stale rect can't
    // make the glow drift away from the cursor.
    const onScroll = () => {
      if (el.dataset.hover === "true") rect = el.getBoundingClientRect();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [tilt, lift, pop]);

  return ref;
}
