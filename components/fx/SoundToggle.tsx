"use client";

import { useState, useEffect } from "react";
import { isSoundEnabled, toggleSound } from "@/lib/sound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const handleClick = () => {
    const nextState = toggleSound();
    setEnabled(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={enabled ? "Mute audio effects" : "Enable 3D audio effects"}
      title={enabled ? "Audio FX: Active" : "Audio FX: Muted"}
      data-cursor="toggle"
      className="group flex items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
    >
      3D Audio: <span className={enabled ? "text-accent" : "text-dim"}>{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}
