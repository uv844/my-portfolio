"use client";

import { Fragment } from "react";
import { m } from "framer-motion";
import { STEP, VIEWPORT, springIn, stairContainer } from "@/lib/motion";
import type { Variants } from "framer-motion";

const TAGS = {
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  p: m.p,
  span: m.span,
  div: m.div,
} as const;

type Tag = keyof typeof TAGS;

/**
 * Each word rises out of its own clipping mask and rotates level, one beat after the
 * one before it — the staircase applied to type.
 *
 * Word-level, never character-level: a character split creates one DOM node per glyph
 * and reads as decoration rather than as the heading arriving. Guidance is to keep any
 * split to short headline copy, so long strings fall back to a single mask below.
 */
const word: Variants = {
  hidden: { y: "115%", rotateX: -55, opacity: 0 },
  show: { y: "0%", rotateX: 0, opacity: 1, transition: springIn },
};

export default function StairText({
  text,
  as = "h2",
  className,
  step = STEP.word,
  delay = 0,
}: {
  text: string;
  as?: Tag;
  className?: string;
  step?: number;
  delay?: number;
}) {
  const C = TAGS[as];
  const words = text.split(" ");

  // Past roughly a headline's length the per-word cascade outlasts its welcome, so
  // the whole string travels as one mask instead.
  const perWord = words.length <= 12;

  return (
    <C
      className={className}
      // The animated spans are inline-block, which some screen readers announce as
      // separate items. The label restates the heading as one string; the words stay
      // in the DOM, so crawlers and text selection are unaffected.
      aria-label={text}
      variants={perWord ? stairContainer(step, delay) : undefined}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {perWord ? (
        words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span className="stair-word" aria-hidden="true">
              <m.span className="stair-word-in" variants={word}>
                {w}
              </m.span>
            </span>
            {/* Real space between masks so the line wraps and copies normally. */}
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))
      ) : (
        <span className="stair-word" aria-hidden="true">
          <m.span className="stair-word-in" variants={word}>
            {text}
          </m.span>
        </span>
      )}
    </C>
  );
}
