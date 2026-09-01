"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/util";
import { useCardPointer } from "./useCardPointer";

/**
 * Text filled with a gradient that follows the pointer across the element.
 *
 * Uses element-local --px/--py from useCardPointer so the gradient's coordinate
 * space matches the text's own box exactly — no offset compensation needed. Falls
 * back to a fixed top-centre light source before first hover and on touch.
 */
export default function SpotlightText({
  children,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "div" | "p";
  className?: string;
}) {
  const ref = useCardPointer<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      data-hover="false"
      className={cn("text-spotlight", className)}
    >
      {children}
    </Tag>
  );
}
