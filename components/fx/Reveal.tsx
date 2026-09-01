import type { CSSProperties, ReactNode } from "react";

type Variant = "up" | "scale" | "left" | "right" | "mask";

/**
 * Server component — emits only markup. The animation is CSS (see `[data-reveal]` in
 * globals.css) and the trigger is a single page-wide IntersectionObserver in
 * RevealRoot, so wrapping content in this costs zero extra client JS.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  /** Stagger in ms. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span" | "p" | "article" | "h2" | "h3";
  style?: CSSProperties;
}) {
  return (
    <Tag
      data-reveal={variant}
      className={className}
      style={{ ["--d" as string]: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
