"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/util";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Element-local listeners only, rAF-batched, written to CSS variables.
 */
export default function Magnetic({
  children,
  strength = 0.34,
  className,
}: {
  children: ReactNode;
  /** 0-1. How far the element follows the pointer, relative to its own size. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let raf = 0;
    let rect: DOMRect | null = null;
    let dx = 0;
    let dy = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--tx", `${dx.toFixed(2)}px`);
      el.style.setProperty("--ty", `${dy.toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onEnter = (e: PointerEvent) => {
      rect = el.getBoundingClientRect();
      el.dataset.hover = "true";
      onMove(e);
      el.addEventListener("pointermove", onMove, { passive: true });
    };

    const onLeave = () => {
      el.dataset.hover = "false";
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <span ref={ref} data-hover="false" className={cn("magnetic inline-flex", className)}>
      {children}
    </span>
  );
}
