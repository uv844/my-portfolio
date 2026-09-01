"use client";

import { useEffect, useRef, useState } from "react";
import type { LeetCodeStats } from "@/lib/data";
import { cn, formatNumber } from "@/lib/util";

const SIZE = 208;
const C = SIZE / 2;
const STROKE = 9;

const RINGS = [
  { key: "easy", label: "Easy", radius: 90, color: "var(--color-accent)" },
  { key: "medium", label: "Medium", radius: 71, color: "var(--color-accent-2)" },
  { key: "hard", label: "Hard", radius: 52, color: "var(--color-violet)" },
] as const;

type RingKey = (typeof RINGS)[number]["key"];

/**
 * Concentric rings showing how the solved problems split across difficulties.
 * Each ring is that difficulty's share of the total — so the figures are the real
 * counts, not a made-up percentage of some unknown problem set.
 *
 * The draw-in is a CSS transition on stroke-dashoffset triggered by one
 * IntersectionObserver; hover focus is a single state change per pointer enter,
 * not per frame.
 */
export default function DifficultyRings({ stats }: { stats: LeetCodeStats }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [focus, setFocus] = useState<RingKey | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        setDrawn(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const counts: Record<RingKey, number> = {
    easy: stats.easy,
    medium: stats.medium,
    hard: stats.hard,
  };
  const total = stats.total || 1;

  return (
    <div ref={hostRef} className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`LeetCode difficulty split: ${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard`}
          className="-rotate-90"
        >
          {RINGS.map((ring, i) => {
            const circumference = 2 * Math.PI * ring.radius;
            const fraction = counts[ring.key] / total;
            const offset = drawn ? circumference * (1 - fraction) : circumference;
            const dimmed = focus !== null && focus !== ring.key;

            return (
              <g key={ring.key}>
                {/* Track */}
                <circle
                  cx={C}
                  cy={C}
                  r={ring.radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth={STROKE}
                />
                {/* Value arc */}
                <circle
                  cx={C}
                  cy={C}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  onPointerEnter={() => setFocus(ring.key)}
                  onPointerLeave={() => setFocus(null)}
                  style={{
                    opacity: dimmed ? 0.22 : 1,
                    pointerEvents: "stroke",
                    cursor: "pointer",
                    filter:
                      focus === ring.key
                        ? `drop-shadow(0 0 8px ${ring.color})`
                        : undefined,
                    transition: `stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 130}ms, opacity 0.3s ease, filter 0.3s ease`,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Centre readout — swaps to the focused difficulty on hover */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum text-[2.1rem] font-semibold leading-none tracking-tight">
            {focus ? counts[focus] : stats.total}
          </span>
          <span className="mono-label mt-2 text-[9px]">
            {focus ? `${focus} solved` : "solved"}
          </span>
        </div>
      </div>

      <ul className="mt-6 w-full space-y-1.5">
        {RINGS.map((ring) => {
          const count = counts[ring.key];
          const pct = Math.round((count / total) * 100);
          const active = focus === ring.key;

          return (
            <li key={ring.key}>
              <button
                type="button"
                onPointerEnter={() => setFocus(ring.key)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(ring.key)}
                onBlur={() => setFocus(null)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
                  active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full transition-transform"
                  style={{
                    background: ring.color,
                    transform: active ? "scale(1.5)" : "scale(1)",
                  }}
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {ring.label}
                </span>
                <span className="ml-auto tnum text-[13px] font-medium">{count}</span>
                <span className="tnum w-9 text-right text-[11px] text-dim">{pct}%</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 w-full border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
        {stats.live ? (
          <>Global rank {formatNumber(stats.ranking)}</>
        ) : (
          <>Latest recorded snapshot</>
        )}
      </p>
    </div>
  );
}
