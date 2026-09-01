"use client";

import { useEffect, useRef } from "react";
import type { ContributionDay } from "@/lib/data";
import { useCardPointer } from "@/components/fx/useCardPointer";

const CELL = 12;
const GAP = 3;

/** Level 0-4 → cell fill. Level 0 keeps a faint plate so the grid stays readable. */
const LEVEL_FILL = [
  "rgba(255,255,255,0.05)",
  "color-mix(in oklab, var(--color-accent) 26%, transparent)",
  "color-mix(in oklab, var(--color-accent) 48%, transparent)",
  "color-mix(in oklab, var(--color-accent) 72%, transparent)",
  "var(--color-accent)",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Week = (ContributionDay | null)[];

/**
 * Buckets the trailing year into calendar weeks, padding the first column so
 * rows line up with weekdays. Uses UTC accessors throughout so the server and
 * client agree — a local-time read here would cause a hydration mismatch for
 * anyone west of UTC.
 */
function toWeeks(days: ContributionDay[]): Week[] {
  if (!days.length) return [];

  const weeks: Week[] = [];
  let current: Week = [];

  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  for (let i = 0; i < firstDow; i++) current.push(null);

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  return weeks;
}

/** First week of each month gets a label; everything else gets an empty slot. */
function monthLabels(weeks: Week[]): (string | null)[] {
  let last = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean);
    if (!first) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month === last) return null;
    last = month;
    return MONTHS[month];
  });
}

function label(day: ContributionDay) {
  const d = new Date(`${day.date}T00:00:00Z`);
  const date = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  const n = day.count === 1 ? "1 contribution" : `${day.count} contributions`;
  return `${n} · ${date}`;
}

/**
 * GitHub contribution grid. The tooltip is a single node moved and rewritten
 * through a ref on a delegated `pointerover`, so hovering 365 cells never
 * triggers a React render.
 */
export default function Heatmap({
  days,
  live,
}: {
  days: ContributionDay[];
  live: boolean;
}) {
  const scanRef = useCardPointer<HTMLDivElement>();
  const tipRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weeks = toWeeks(days);
  const labels = monthLabels(weeks);

  useEffect(() => {
    const grid = gridRef.current;
    const tip = tipRef.current;
    if (!grid || !tip) return;

    const show = (e: PointerEvent) => {
      const cell = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-day]",
      );
      if (!cell) return;

      tip.textContent = cell.dataset.day ?? "";
      // Measured rather than read from offsetLeft/offsetTop: the cells sit at their own
      // depth in the relief field, and a projected cell is drawn a few pixels away from
      // its layout box — most at the outer columns. getBoundingClientRect() accounts for
      // the transform, so the tip stays glued to where the cell is actually painted. Two
      // reads per hover, not per frame.
      const box = cell.getBoundingClientRect();
      const origin = grid.getBoundingClientRect();
      const x = box.left - origin.left + box.width / 2;
      const y = box.top - origin.top;
      tip.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
      tip.dataset.show = "true";
    };

    const hide = () => {
      tip.dataset.show = "false";
    };

    grid.addEventListener("pointerover", show);
    grid.addEventListener("pointerleave", hide);
    return () => {
      grid.removeEventListener("pointerover", show);
      grid.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div
          ref={scanRef}
          data-hover="false"
          className="heat-scan heat-field relative w-max pt-5"
        >
          {/* Month ruler. Slots are fixed-width; labels are absolute so a wide
              month name can't push the columns out of alignment. */}
          <div
            className="absolute left-0 top-0 flex"
            style={{ gap: `${GAP}px` }}
            aria-hidden="true"
          >
            {labels.map((month, i) => (
              <span
                key={i}
                className="relative shrink-0"
                style={{ width: `${CELL}px` }}
              >
                {month ? (
                  <span className="absolute left-0 top-0 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                    {month}
                  </span>
                ) : null}
              </span>
            ))}
          </div>

          <div
            ref={gridRef}
            className="p3d relative flex"
            style={{ gap: `${GAP}px` }}
          >
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="heat-col flex shrink-0 flex-col"
                style={{ gap: `${GAP}px` }}
              >
                {week.map((day, di) =>
                  day ? (
                    <span
                      key={day.date}
                      data-day={label(day)}
                      className="heat-cell block rounded-[2px]"
                      style={{
                        width: `${CELL}px`,
                        height: `${CELL}px`,
                        background: LEVEL_FILL[Math.min(day.level, 4)],
                        // Drives translateZ in CSS — the busier the day, the further the
                        // cell stands off the grid.
                        ["--lv" as string]: Math.min(day.level, 4),
                      }}
                    />
                  ) : (
                    <span
                      key={`${wi}-${di}`}
                      className="block"
                      style={{ width: `${CELL}px`, height: `${CELL}px` }}
                    />
                  ),
                )}
              </div>
            ))}

            <div ref={tipRef} data-show="false" className="heat-tip" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
          {live ? "Trailing 12 months" : "Last recorded year"}
        </span>
        <span className="ml-auto flex items-center gap-1.5" aria-hidden="true">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
            Less
          </span>
          {LEVEL_FILL.map((fill, i) => (
            <span
              key={i}
              className="block h-[10px] w-[10px] rounded-[2px]"
              style={{ background: fill }}
            />
          ))}
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
            More
          </span>
        </span>
      </div>
    </div>
  );
}
