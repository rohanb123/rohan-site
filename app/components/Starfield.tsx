"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number; // depth 0 (far) .. 1 (near)
  r: number;
  a: number;
  c: number; // index into the spectral palette
};

const DENSITY = 1 / 450; // stars per px² → ~4,600 on a 1440×1440 area
const MAX_STARS = 5000;
const DRIFT = 0.6; // px/sec for the nearest layer
const PARALLAX = 14; // max px offset for the nearest layer
const EASE = 0.04; // pointer smoothing
const PEAK_SHARE = 0.01; // share of stars allowed to reach --atmosphere-peak

// Spectral classes, hot to cool, weighted roughly like the naked-eye sky.
const SPECTRAL = [
  { token: "--star-b", fallback: "#aabfff", weight: 0.1 },
  { token: "--star-a", fallback: "#cad8ff", weight: 0.22 },
  { token: "--star-f", fallback: "#f4f5ff", weight: 0.18 },
  { token: "--star-g", fallback: "#fff2e0", weight: 0.15 },
  { token: "--star-k", fallback: "#ffd6a8", weight: 0.25 },
  { token: "--star-m", fallback: "#ffbe85", weight: 0.1 },
];

function pickClass() {
  let r = Math.random();
  for (let i = 0; i < SPECTRAL.length; i++) {
    r -= SPECTRAL[i].weight;
    if (r <= 0) return i;
  }
  return SPECTRAL.length - 1;
}

function readToken(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse), (max-width: 767px)");

    const palette = SPECTRAL.map((k) => readToken(k.token, k.fallback));
    const maxAlpha = parseFloat(readToken("--atmosphere-max", "0.15")) || 0.15;
    const peakAlpha = parseFloat(readToken("--atmosphere-peak", "0.35")) || 0.35;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const isStatic = () => reduceMotion.matches || coarse.matches;

    function seed() {
      const count = Math.min(MAX_STARS, Math.round(w * h * DENSITY));
      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < PEAK_SHARE;
        // most stars far away; bright ones are always near
        const z = bright ? 0.7 + Math.random() * 0.3 : Math.random() ** 2.2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.35 + z * 0.9,
          a: bright
            ? peakAlpha * (0.6 + 0.4 * Math.random())
            : maxAlpha * (0.2 + 0.8 * Math.random() * (0.35 + 0.65 * z)),
          c: pickClass(),
        };
      });
      // Group by color so draw() only switches fillStyle once per class.
      stars.sort((a, b) => a.c - b.c);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      let current = -1;
      for (const s of stars) {
        if (s.c !== current) {
          current = s.c;
          ctx!.fillStyle = palette[current];
        }
        const px = s.x + pointer.x * PARALLAX * s.z;
        const py = s.y + pointer.y * PARALLAX * s.z;
        ctx!.globalAlpha = s.a;
        if (s.r < 0.9) {
          ctx!.fillRect(px, py, s.r * 1.6, s.r * 1.6);
        } else {
          ctx!.beginPath();
          ctx!.arc(px, py, s.r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;
    }

    function tick(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;

      pointer.x += (pointer.tx - pointer.x) * EASE;
      pointer.y += (pointer.ty - pointer.y) * EASE;

      for (const s of stars) {
        s.x -= DRIFT * (0.15 + s.z) * dt;
        s.y -= DRIFT * 0.25 * (0.15 + s.z) * dt;
        if (s.x < -PARALLAX) s.x += w + PARALLAX * 2;
        if (s.y < -PARALLAX) s.y += h + PARALLAX * 2;
      }

      draw();
      raf = requestAnimationFrame(tick);
    }

    function onPointer(e: PointerEvent) {
      pointer.tx = (e.clientX / w) * 2 - 1;
      pointer.ty = (e.clientY / h) * 2 - 1;
    }

    function start() {
      cancelAnimationFrame(raf);
      last = 0;
      if (isStatic()) {
        pointer.x = pointer.y = pointer.tx = pointer.ty = 0;
        draw();
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    resize();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduceMotion.addEventListener("change", start);
    coarse.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      reduceMotion.removeEventListener("change", start);
      coarse.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
