"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/lib/pointer";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
}

/**
 * Generates vertices and edges for a 3D Icosahedron.
 */
function createIcosahedron(radius: number): { vertices: Point3D[]; edges: Edge[] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw: Point3D[] = [
    { x: -1, y: t, z: 0 },
    { x: 1, y: t, z: 0 },
    { x: -1, y: -t, z: 0 },
    { x: 1, y: -t, z: 0 },

    { x: 0, y: -1, z: t },
    { x: 0, y: 1, z: t },
    { x: 0, y: -1, z: -t },
    { x: 0, y: 1, z: -t },

    { x: t, y: 0, z: -1 },
    { x: t, y: 0, z: 1 },
    { x: -t, y: 0, z: -1 },
    { x: -t, y: 0, z: 1 },
  ];

  // Scale to radius
  const vertices = raw.map((v) => {
    const len = Math.hypot(v.x, v.y, v.z);
    return {
      x: (v.x / len) * radius,
      y: (v.y / len) * radius,
      z: (v.z / len) * radius,
    };
  });

  const edges: Edge[] = [];
  // Connect vertices within distance threshold
  const thresh = (radius * 2.1) / t;
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i].x - vertices[j].x;
      const dy = vertices[i].y - vertices[j].y;
      const dz = vertices[i].z - vertices[j].z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist < thresh + 0.1) {
        edges.push({ a: i, b: j });
      }
    }
  }

  return { vertices, edges };
}

/**
 * Generates an inner 3D Octahedron core.
 */
function createOctahedron(radius: number): { vertices: Point3D[]; edges: Edge[] } {
  const vertices: Point3D[] = [
    { x: radius, y: 0, z: 0 },
    { x: -radius, y: 0, z: 0 },
    { x: 0, y: radius, z: 0 },
    { x: 0, y: -radius, z: 0 },
    { x: 0, y: 0, z: radius },
    { x: 0, y: 0, z: -radius },
  ];

  const edges: Edge[] = [
    { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
    { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 },
    { a: 2, b: 4 }, { a: 4, b: 3 }, { a: 3, b: 5 }, { a: 5, b: 2 },
  ];

  return { vertices, edges };
}

export default function CyberCore3D({
  className = "",
  size = 520,
}: {
  className?: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // DPR setup
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const focal = 450;

    // Geometries
    const outer = createIcosahedron(size * 0.38);
    const inner = createOctahedron(size * 0.22);

    // Orbit particles
    const orbitCount = 24;
    const orbitRadius = size * 0.44;
    const orbitPts: { angle: number; speed: number; tilt: number; size: number }[] = [];
    for (let i = 0; i < orbitCount; i++) {
      orbitPts.push({
        angle: (i / orbitCount) * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
        tilt: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 1.5,
      });
    }

    let rotX = 0.2;
    let rotY = 0.4;
    let rotZ = 0;
    let pulse = 0;
    let animId = 0;

    // Touch interaction state
    let isDragging = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let velX = 0;
    let velY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      pulse = 1.0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - touchStartX;
      const dy = e.clientY - touchStartY;
      velY = dx * 0.008;
      velX = dy * 0.008;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    function rotatePoint(p: Point3D, rx: number, ry: number, rz: number): Point3D {
      // Rotate Y
      let x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
      let z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
      let y1 = p.y;

      // Rotate X
      let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
      let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
      let x2 = x1;

      // Rotate Z
      let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      let z3 = z2;

      return { x: x3, y: y3, z: z3 };
    }

    function project(p: Point3D): { sx: number; sy: number; scale: number } {
      const k = focal / (focal + p.z + 120);
      return {
        sx: cx + p.x * k,
        sy: cy + p.y * k,
        scale: k,
      };
    }

    function render() {
      ctx!.clearRect(0, 0, size, size);

      if (isDragging) {
        rotY += velY;
        rotX += velX;
      } else {
        // Inertia damping
        velY *= 0.95;
        velX *= 0.95;
        rotY += velY + 0.006;
        rotX += velX + 0.003;
        rotZ += 0.002;
      }

      // Pointer steering influence
      if (pointer.active) {
        rotY += pointer.snx * 0.002;
        rotX += pointer.sny * 0.002;
      }

      if (pulse > 0.01) {
        pulse *= 0.94;
      } else {
        pulse = 0;
      }

      // Outer glow circle
      const pulseScale = 1 + pulse * 0.15;
      const grad = ctx!.createRadialGradient(cx, cy, size * 0.1, cx, cy, size * 0.48);
      grad.addColorStop(0, "rgba(74, 222, 128, 0.12)");
      grad.addColorStop(0.5, "rgba(34, 211, 238, 0.06)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      ctx!.fill();

      // Transform outer vertices
      const outerTrans = outer.vertices.map((v) => {
        const scaled = {
          x: v.x * pulseScale,
          y: v.y * pulseScale,
          z: v.z * pulseScale,
        };
        const r = rotatePoint(scaled, rotX, rotY, rotZ);
        return { point: r, ...project(r) };
      });

      // Draw outer edges
      ctx!.lineWidth = 1.2;
      outer.edges.forEach(({ a, b }) => {
        const pA = outerTrans[a];
        const pB = outerTrans[b];
        const avgZ = (pA.point.z + pB.point.z) / 2;
        const alpha = Math.max(0.1, Math.min(0.85, (avgZ + 150) / 300));

        ctx!.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(pA.sx, pA.sy);
        ctx!.lineTo(pB.sx, pB.sy);
        ctx!.stroke();
      });

      // Draw outer nodes
      outerTrans.forEach(({ sx, sy, scale, point }) => {
        const alpha = Math.max(0.2, Math.min(1, (point.z + 150) / 300));
        const r = 2.5 * scale * (1 + pulse * 0.5);

        ctx!.fillStyle = `rgba(74, 222, 128, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(sx, sy, r, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Transform inner core (counter-rotating)
      const innerTrans = inner.vertices.map((v) => {
        const r = rotatePoint(v, -rotX * 1.5, -rotY * 1.5, rotZ * 1.2);
        return { point: r, ...project(r) };
      });

      // Draw inner edges
      ctx!.lineWidth = 1;
      inner.edges.forEach(({ a, b }) => {
        const pA = innerTrans[a];
        const pB = innerTrans[b];
        const avgZ = (pA.point.z + pB.point.z) / 2;
        const alpha = Math.max(0.2, Math.min(0.95, (avgZ + 100) / 200));

        ctx!.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(pA.sx, pA.sy);
        ctx!.lineTo(pB.sx, pB.sy);
        ctx!.stroke();
      });

      // Draw orbit particles
      ctx!.fillStyle = "rgba(74, 222, 128, 0.8)";
      orbitPts.forEach((pt) => {
        pt.angle += pt.speed;
        const ox = Math.cos(pt.angle) * orbitRadius;
        const oz = Math.sin(pt.angle) * orbitRadius;
        const oy = Math.sin(pt.angle * 2) * (orbitRadius * 0.25) + oz * pt.tilt;

        const rotated = rotatePoint({ x: ox, y: oy, z: oz }, rotX * 0.5, rotY * 0.5, 0);
        const { sx, sy, scale } = project(rotated);
        const alpha = Math.max(0.15, Math.min(0.9, (rotated.z + 180) / 360));

        ctx!.fillStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(sx, sy, pt.size * scale, 0, Math.PI * 2);
        ctx!.fill();
      });

      if (document.documentElement.dataset.scene !== "off") {
        animId = requestAnimationFrame(render);
      }
    }

    const checkScene = () => {
      if (document.documentElement.dataset.scene === "off") {
        cancelAnimationFrame(animId);
        animId = 0;
      } else {
        if (!animId) render();
      }
    };

    const observer = new MutationObserver(checkScene);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scene"],
    });

    if (document.documentElement.dataset.scene !== "off") {
      render();
    }

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title="Interactive 3D Cyber Core — Drag or touch to rotate"
    >
      <canvas
        ref={canvasRef}
        className="cursor-grab touch-none active:cursor-grabbing"
      />
    </div>
  );
}
