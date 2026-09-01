"use client";

import { useEffect, useState } from "react";

const KEY = "scene3d";

/**
 * The 3D scene on/off control.
 *
 * Whole-plane rotation is the strongest depth cue on this page and also its one real
 * cost: any 3D-transformed text is rasterised with grayscale rather than subpixel
 * antialiasing, so it reads very slightly softer. Someone who finds that distracting
 * should be able to say so in one click rather than leave.
 *
 * Setting `data-scene="off"` on <html>` flattens every plane, tilt and depth offset from
 * a single rule block in globals.css, and leaves the flat HUD chrome in place — so the
 * page stays instrumented and technical, just without the rotation. The choice persists
 * in localStorage and is applied by a blocking inline script in app/layout.tsx, so an
 * opted-out visitor never sees a frame of rotation on the next load.
 */
export default function SceneToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    // The inline script has already applied the attribute; read it back rather than
    // localStorage so the two can never disagree.
    setOn(document.documentElement.dataset.scene !== "off");
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) {
      delete document.documentElement.dataset.scene;
    } else {
      document.documentElement.dataset.scene = "off";
    }
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // Private mode or a blocked store — the toggle still works for this session.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      data-cursor="toggle"
      className="group flex items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
    >
      Scene 3D: <span className={on ? "text-accent" : "text-dim"}>{on ? "ON" : "OFF"}</span>
    </button>
  );
}
