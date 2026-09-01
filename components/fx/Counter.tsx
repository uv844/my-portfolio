"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/util";

/**
 * Counts a number up when it scrolls into view.
 *
 * The final value is what renders on the server, so crawlers and no-JS visitors see
 * the real figure. The animation writes `textContent` directly through a ref, so a
 * three-second count-up costs zero React renders.
 */
export default function Counter({
  value,
  duration = 1400,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      `${prefix}${n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      el.textContent = format(value);
      return;
    }

    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast out of the gate, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = format(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        el.textContent = format(0);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, decimals, suffix, prefix]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
