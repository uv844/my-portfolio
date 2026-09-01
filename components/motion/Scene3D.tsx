"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useSpring } from "framer-motion";
import { SCENE, springScene } from "@/lib/motion";
import { useFinePointer, useIsDesktop, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/util";

/**
 * One section's 3D scene.
 *
 * Two axes, from two different sources, deliberately kept in separate CSS variables so
 * neither system ever owns the whole `transform` string:
 *
 *   yaw   — pure CSS: `rotateY(calc(var(--snx) * var(--scene-yaw)))`, where --snx is the
 *           smoothed pointer offset published by the shared loop in lib/pointer.ts. No
 *           JavaScript runs per frame for this at all.
 *   pitch — written here, from scroll position. The section tilts as it rises into view,
 *           levels to exactly 0° at the viewport centre, and tilts away as it leaves.
 *
 * That levelling is the point: text is read at 0°, where it is composited flat and keeps
 * its normal antialiasing. The tilt is only ever present while the content is travelling.
 *
 * Why a scene per section instead of one plane around <main>: the document is ~15,000px
 * tall, so transforming it would promote the whole thing to a single composited layer
 * Chrome has to re-tile on every scroll — and a transformed ancestor becomes the
 * containing block for `position: fixed`, which would silently un-fix the nav, the cursor
 * and the backdrop. Per-section keeps each layer viewport-sized. Since every plane shares
 * one pointer-driven yaw, they still read as one continuous space.
 */
export default function Scene3D({
  children,
  className,
  planeClassName,
  perspective = SCENE.perspective,
  yaw = SCENE.yaw,
  pitch = SCENE.pitch,
}: {
  children: ReactNode;
  className?: string;
  planeClassName?: string;
  /** Viewing distance in px. Smaller = stronger, more dramatic perspective. */
  perspective?: number;
  /** Max pointer-driven yaw in deg, applied ± around centre. */
  yaw?: number;
  /** Max scroll-driven pitch in deg. */
  pitch?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // The CSS guards flatten every scene plane on a touch device, where there is no pointer
  // to drive the yaw and a lone pitch axis just softens text for nothing. Matching that in
  // JS means a phone also skips the scroll subscription and the observer, not merely the
  // visible result.
  //
  // Both hooks are called unconditionally and combined afterwards. Writing this as
  // `useFinePointer() && useIsDesktop()` is a crash: `&&` short-circuits, and both hooks
  // start at `false` for SSR safety and flip in an effect, so `useIsDesktop` was absent on
  // the hydration render and present on the next one — "rendered more hooks than during
  // the previous render", which unmounts the entire tree.
  const finePointer = useFinePointer();
  const desktop = useIsDesktop();
  const [sceneActive, setSceneActive] = useState(true);

  useEffect(() => {
    const check = () => {
      setSceneActive(document.documentElement.dataset.scene !== "off");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scene"],
    });
    return () => observer.disconnect();
  }, []);

  const active = sceneActive;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Raw scroll arrives in whatever steps the wheel emits; the spring turns those into one
  // continuous rotation and gives the plane some mass.
  const smooth = useSpring(scrollYProgress, springScene);

  useEffect(() => {
    const plane = planeRef.current;
    const scene = ref.current;
    if (!plane || !scene) return;

    if (!active) {
      plane.style.removeProperty("--pitch");
      delete plane.dataset.sceneLive;
      return;
    }

    // Compositor promotion is granted only while the section is anywhere near the
    // viewport, so a long page never holds nine promoted layers at once. `live` also
    // gates the write itself — an off-screen plane has nothing to say.
    let live = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting;
        plane.dataset.sceneLive = live ? "true" : "false";
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(scene);

    const write = (p: number) => {
      if (!live) return;
      // p = 0 entering from below, 0.5 dead centre, 1 gone past the top. Linear, so the
      // plane is exactly square at the moment the content sits in the middle of the
      // screen. Positive rotateX tips the top edge away and brings the bottom forward,
      // which is the correct read for content rising into view.
      plane.style.setProperty("--pitch", `${(pitch * (1 - 2 * p)).toFixed(3)}deg`);
    };

    write(smooth.get());
    // .on("change") fires outside React's render cycle, so scrolling costs zero renders.
    const stop = smooth.on("change", write);

    return () => {
      stop();
      io.disconnect();
      plane.style.removeProperty("--pitch");
      delete plane.dataset.sceneLive;
    };
  }, [smooth, pitch, active]);

  return (
    <div
      ref={ref}
      className={cn("scene", className)}
      style={{
        ["--scene-persp" as string]: `${perspective}px`,
        // The same viewing distance again, unitless, because the depth utilities need to
        // divide by it to work out their counter-scale — and CSS calc() cannot divide a
        // length by a length. It inherits, so any `.d-*` descendant picks up its own
        // section's perspective rather than a hardcoded average.
        ["--scene-pn" as string]: perspective,
        ["--scene-yaw" as string]: `${yaw}deg`,
      }}
    >
      <div ref={planeRef} className={cn("scene-plane", planeClassName)}>
        {children}
      </div>
    </div>
  );
}
