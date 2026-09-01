"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/**
 * Yuvraj's local time, ticking. Renders a stable placeholder on the server and only
 * starts once mounted — a server-rendered clock would guarantee a hydration mismatch.
 */
export default function LiveClock({ showSeconds = true }: { showSeconds?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: profile.timezone,
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, [showSeconds]);

  return (
    <span className="tnum tabular-nums">
      {time ?? (showSeconds ? "--:--:--" : "--:--")}
      <span className="ml-1 text-dim">IST</span>
    </span>
  );
}
