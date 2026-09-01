"use client";

import { useEffect, useState } from "react";
import { acquirePointer } from "@/lib/pointer";
import { useFinePointer } from "@/lib/hooks";
import { playClickSound, playHoverSound } from "@/lib/sound";

/**
 * Mounts the single shared pointer loop and renders the custom cursor.
 */
export default function PointerProvider() {
  const fine = useFinePointer();
  const enabled = fine;

  const [label, setLabel] = useState("");

  useEffect(() => acquirePointer(), []);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      delete root.dataset.customCursor;
      root.dataset.cursorActive = "false";
      return;
    }

    root.dataset.customCursor = "true";
    let current = "";

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      const next = target?.dataset.cursor ?? (target ? "hover" : "");
      if (next === current) return;
      current = next;
      if (next) playHoverSound();
      const displayLabel = target?.dataset.cursor ?? "";
      setLabel(displayLabel);
      root.dataset.cursorActive = displayLabel ? "true" : "false";
    };

    const onDown = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      if (target) playClickSound();
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      delete root.dataset.customCursor;
      root.dataset.cursorActive = "false";
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-layer cursor-ring" aria-hidden="true" />
      <div className="cursor-layer cursor-dot" aria-hidden="true" />
      <div className="cursor-label" aria-hidden="true">
        {label}
      </div>
    </>
  );
}
