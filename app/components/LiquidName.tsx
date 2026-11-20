"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The last name, filled with liquid paint in the manner of Rohan's Liquify edits, with the pointer as the brush.
 *
 * The paint: horizontal bands in one color family (the sunset tones, --paint-*) bent by noise that is stretched
 * along the word, so the marble runs with the word like a smeared stream, then a gloss pass (light raking across
 * the paint's own tones) for the wet sheen. The paint is clipped to the letters, so the word itself stays crisp.
 * It holds still: nothing moves unless the pointer moves it.
 *
 * The brush: a small grid of displacement vectors. Moving the pointer across the word pushes the paint along
 * (Liquify's Forward Warp) and the paint settles back over about two seconds. The grid is written to a tiny
 * PNG each frame and read by the filter through feImage. Fine pointers only; off for reduced motion.
 *
 * The HTML word stays in the page underneath (transparent once the paint is drawn), so it keeps the text,
 * the layout and the fallback: until the SVG is measured, and without JS, it shows the plain .name-gradient.
 */

// [paint token, band height as a fraction of the word's height]: wide tonal fields, thin hot lines between them
const BANDS: [string, number][] = [
  ["orange", 0.22], ["gold", 0.1], ["core", 0.025], ["glow", 0.12], ["ember", 0.16],
  ["rust", 0.08], ["core", 0.015], ["gold", 0.14], ["orange", 0.1], ["ember", 0.07],
];
const PERIOD = BANDS.reduce((s, [, h]) => s + h, 0);

const WARP_W = 64; // brush grid, along the word
const WARP_H = 16; // brush grid, across it
const RELAX = 0.965; // per frame: the paint settles back over ~2s
const BRUSH = 0.55; // brush radius, in word heights

type Box = { x: number; y: number; w: number; h: number; base: number };

export default function LiquidName({ text }: { text: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const measure = useRef<SVGTextElement>(null);
  const baseline = useRef<HTMLSpanElement>(null);
  const warpImg = useRef<SVGFEImageElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  // Size the SVG to the glyphs and sit it on the HTML word's baseline. Re-measures when fonts load or the h1 resizes.
  useLayoutEffect(() => {
    const t = measure.current;
    const parent = wrap.current?.parentElement;
    if (!t || !parent) return;
    const fit = () => {
      const b = t.getBBox();
      // An empty inline-block sits on the baseline, so its top is the baseline's offset in the wrapper
      const base = baseline.current?.offsetTop ?? 0;
      if (b.width) setBox({ x: b.x, y: b.y, w: b.width, h: b.height, base });
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  // The brush
  useEffect(() => {
    const el = wrap.current;
    const img = warpImg.current;
    if (!el || !img || !box) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.width = WARP_W;
    canvas.height = WARP_H;
    const ctx = canvas.getContext("2d")!;
    const pixels = ctx.createImageData(WARP_W, WARP_H);
    const dx = new Float32Array(WARP_W * WARP_H);
    const dy = new Float32Array(WARP_W * WARP_H);
    let frame = 0;
    let last: { x: number; y: number } | null = null;
    const hero = el.closest("section") ?? el;

    // Relax the field a step and write it out as a displacement map (128 = no shift)
    const draw = () => {
      let energy = 0;
      for (let i = 0; i < dx.length; i++) {
        dx[i] *= RELAX;
        dy[i] *= RELAX;
        energy += Math.abs(dx[i]) + Math.abs(dy[i]);
        const p = i * 4;
        pixels.data[p] = 128 + Math.max(-127, Math.min(127, dx[i] * 127));
        pixels.data[p + 1] = 128 + Math.max(-127, Math.min(127, dy[i] * 127));
        pixels.data[p + 2] = 128;
        pixels.data[p + 3] = 255;
      }
      ctx.putImageData(pixels, 0, 0);
      img.setAttribute("href", canvas.toDataURL());
      frame = energy > 0.5 ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const pos = { x: e.clientX, y: e.clientY };
      if (last) {
        // Movement in word heights, so the push feels the same at every size
        const vx = (pos.x - last.x) / r.height;
        const vy = (pos.y - last.y) / r.height;
        const gx = ((pos.x - r.left) / r.width) * WARP_W;
        const gy = ((pos.y - r.top) / r.height) * WARP_H;
        const reach = BRUSH * WARP_H;
        if (gx > -reach * 4 && gx < WARP_W + reach * 4 && gy > -reach && gy < WARP_H + reach) {
          for (let y = 0; y < WARP_H; y++)
            for (let x = 0; x < WARP_W; x++) {
              // Grid cells are not square (the word is several times wider than tall): measure in word heights
              const ddx = ((x - gx) / WARP_W) * (r.width / r.height);
              const ddy = (y - gy) / WARP_H;
              const d2 = (ddx * ddx + ddy * ddy) / (BRUSH * BRUSH);
              if (d2 >= 1) continue;
              const f = (1 - d2) * (1 - d2) * 0.9;
              const i = y * WARP_W + x;
              // The filter takes paint from (here + offset), so reaching back against the motion pushes paint forward
              dx[i] = Math.max(-1, Math.min(1, dx[i] - vx * f));
              dy[i] = Math.max(-1, Math.min(1, dy[i] - vy * f));
            }
          if (!frame) frame = requestAnimationFrame(draw);
        }
      }
      last = pos;
    };
    const onLeave = () => (last = null);
    hero.addEventListener("pointermove", onMove as EventListener, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove as EventListener);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [box]);

  const h = box?.h ?? 100;
  const rects = BANDS.map(([tone, f], i) => ({
    y: BANDS.slice(0, i).reduce((sum, [, bh]) => sum + bh, 0) * h,
    h: f * h,
    tone,
  }));
  const P = PERIOD * h;
  const glyphs = text.toUpperCase();
  // Inherit the h1's font, size, weight, width axis and tracking, so the SVG word measures exactly like the HTML one
  const inherit = { font: "inherit", letterSpacing: "inherit" } as const;

  return (
    <span ref={wrap} className="relative inline-block">
      <span className={box ? "name-gradient name-painted" : "name-gradient"}>{text}</span>
      <span ref={baseline} aria-hidden="true" className="inline-block h-0 w-0" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 overflow-visible"
        width={box?.w ?? 0}
        height={box?.h ?? 0}
        viewBox={box ? `${box.x} ${box.y} ${box.w} ${box.h}` : undefined}
        style={{ top: box ? box.base + box.y : 0, visibility: box ? "visible" : "hidden" }}
      >
        <text ref={measure} x={0} y={0} fill="none" style={inherit}>
          {glyphs}
        </text>
        {box && (
          <>
            <defs>
              <clipPath id="liquid-name-clip">
                <text x={0} y={0} style={inherit}>
                  {glyphs}
                </text>
              </clipPath>
              <pattern id="liquid-name-bands" width={P * 4} height={P} patternUnits="userSpaceOnUse" patternTransform="rotate(-3)">
                {rects.map((r) => (
                  <rect key={r.y} x={0} y={r.y} width={P * 4} height={r.h} style={{ fill: `var(--paint-${r.tone})` }} />
                ))}
              </pattern>
              <filter
                id="liquid-name-paint"
                filterUnits="userSpaceOnUse"
                x={box.x - h}
                y={box.y - h}
                width={box.w + 2 * h}
                height={box.h + 2 * h}
                colorInterpolationFilters="sRGB"
              >
                {/* The smear: noise stretched along the word, so the bands run with it and fold */}
                <feTurbulence type="fractalNoise" baseFrequency={`${0.85 / h} ${1.7 / h}`} numOctaves={2} seed={11} result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale={h * 1.6} xChannelSelector="R" yChannelSelector="G" result="smear" />
                {/* The brush: the pointer's warp field, stretched over the word (a neutral gray pixel at rest) */}
                <feImage
                  ref={warpImg}
                  href="data:image/gif;base64,R0lGODlhAQABAIAAAICAgAAAACwAAAAAAQABAAACAkQBADs="
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  preserveAspectRatio="none"
                  result="warp"
                />
                <feDisplacementMap in="smear" in2="warp" scale={h * 1.6} xChannelSelector="R" yChannelSelector="G" result="paint" />
                {/* Gloss: light raking across the paint's own tones gives the wet ridges */}
                <feColorMatrix in="paint" type="luminanceToAlpha" result="height" />
                <feGaussianBlur in="height" stdDeviation={h * 0.03} result="soft" />
                <feSpecularLighting
                  in="soft"
                  surfaceScale={h * 0.08}
                  specularConstant={0.75}
                  specularExponent={22}
                  style={{ lightingColor: "var(--paint-core)" }}
                  result="spec"
                >
                  <feDistantLight azimuth={235} elevation={48} />
                </feSpecularLighting>
                <feComposite in="paint" in2="spec" operator="arithmetic" k2={1} k3={0.5} />
              </filter>
            </defs>
            <g clipPath="url(#liquid-name-clip)">
              <rect
                x={box.x - h}
                y={box.y - h}
                width={box.w + 2 * h}
                height={box.h + 2 * h}
                fill="url(#liquid-name-bands)"
                filter="url(#liquid-name-paint)"
              />
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
