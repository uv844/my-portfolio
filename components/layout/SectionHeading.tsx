import Reveal from "@/components/fx/Reveal";
import StairText from "@/components/motion/StairText";
import { cn } from "@/lib/util";

/**
 * Shared section header: an instrument frame carrying the index and eyebrow, then the
 * title climbing in word by word.
 *
 * The title is the one element in each section that gets the word-level staircase — it
 * is the section's entry point, so the motion marks arrival. Everything below it moves
 * as a group instead, which keeps to the one-or-two-focal-animations-per-view budget.
 *
 * The whole block sits one step off its section's plane (`d-raised`), so it parallaxes
 * against the body content as the plane turns. That works even though the title's word
 * masks use `overflow: hidden` — which forces flattening — because the depth offset is on
 * an ancestor of the masks rather than inside them.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  className?: string;
}) {
  return (
    <div className={cn("d-raised mb-10 sm:mb-14", className)}>
      <StairText
        as="h2"
        text={title}
        delay={0.06}
        className="mt-4 max-w-3xl text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-[2.75rem]"
      />

      {lede ? (
        <Reveal
          delay={160}
          as="p"
          className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted"
        >
          {lede}
        </Reveal>
      ) : null}

      <Reveal delay={220} className="mt-6 flex items-center gap-3">
        <span className="hud-ticks block w-28 opacity-70" aria-hidden="true" />
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </Reveal>
    </div>
  );
}
