"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { springTouch } from "@/lib/motion";

/**
 * Press and hover feedback for primary actions.
 *
 * A control that changes state with no motion reads as unresponsive on touch, where
 * there is no hover to confirm the target was hit. The scale stays inside the 0.95–1.05
 * band both platforms recommend — enough to register, not enough to shove the layout.
 *
 * Spring rather than a duration, so a fast tap-and-release is interruptible: the
 * release animation starts from wherever the press got to.
 */
export default function Pressable({
  children,
  className,
  hover = 1.03,
  press = 0.97,
}: {
  children: ReactNode;
  className?: string;
  hover?: number;
  press?: number;
}) {
  return (
    <m.span
      className={className}
      whileHover={{ scale: hover }}
      whileTap={{ scale: press }}
      transition={springTouch}
    >
      {children}
    </m.span>
  );
}
