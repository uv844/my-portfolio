"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/util";

/**
 * Click-to-copy contact row. Falls back to a plain mailto/tel link when the
 * clipboard API is unavailable (non-secure origins, older browsers), so the
 * value is always reachable.
 */
export default function CopyField({
  label,
  value,
  href,
  className,
}: {
  label: string;
  value: string;
  href: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1700);
    } catch {
      // Clipboard blocked — the adjacent link still works.
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 border-b border-line py-4 transition-colors hover:border-line-strong",
        className,
      )}
    >
      <span className="mono-label w-16 shrink-0 text-[10px]">{label}</span>

      <a
        href={href}
        data-cursor="open"
        className="min-w-0 flex-1 truncate font-mono text-[13px] text-text transition-colors group-hover:text-accent sm:text-[15px]"
      >
        {value}
      </a>

      <button
        type="button"
        onClick={copy}
        data-cursor="copy"
        aria-label={`Copy ${label.toLowerCase()}`}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
          copied
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-line text-dim hover:border-line-strong hover:text-text",
        )}
      >
        <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
        {copied ? "Copied" : "Copy"}
      </button>

      {/* Announced without shifting layout. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </div>
  );
}
