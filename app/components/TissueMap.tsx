"use client";

import { useEffect, useRef } from "react";
import { SECTION_INDEX_ID, sections } from "../content/site";

/**
 * Hero signature visual: a synthetic "tissue map" in the style of spatial transcriptomics.
 * Each colored cluster is a site section; hover highlights it and its connections, click scrolls to it.
 * The hero's section index is the map's legend: hovering or focusing a link there lights its cluster,
 * and hovering a cluster lights its link (via a `data-lit` attribute). No labels are drawn on the canvas.
 * Synthetic data only. aria-hidden: the section index nav is the accessible navigation.
 */

type ClusterDef = {
  id: string;
  label: string;
  /** Center in normalized [0, 1] coordinates. */
  cx: number;
  cy: number;
  count: number;
  /** Dominant cell type color (data palette token). */
  color: string;
};

type Cell = {
  x: number; // final position, normalized
  y: number;
  sx: number; // intro start position, normalized
  sy: number;
  cluster: number; // index into clusters, -1 = background tissue
  color: number; // index into palette
  r: number;
  delay: number; // intro stagger, 0..1
};

const MAP_SECTIONS = ["work", "projects", "education", "contact"];
function color(id: string) {
  return sections.find((s) => s.id === id)!.color;
}
const LAYOUT: Record<string, Omit<ClusterDef, "id" | "label">> = {
  work: { cx: 0.32, cy: 0.33, count: 760, color: color("work") },
  projects: { cx: 0.7, cy: 0.31, count: 720, color: color("projects") },
  education: { cx: 0.33, cy: 0.71, count: 460, color: color("education") },
  contact: { cx: 0.71, cy: 0.7, count: 380, color: color("contact") },
};
// Minor cell types mixed into every cluster, as in real tissue. Not section colors, so they don't compete.
const MINOR = ["--data-3", "--data-6", "--data-7"];
const BACKGROUND = 680;
const INTRO_MS = 2400;
const HOVER_MS = 220;
const HIT_RADIUS = 16; // px
const KNN_PER_CELL = 2;

// Deterministic RNG so the map looks the same on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

function buildTissue(clusters: ClusterDef[], paletteSize: number, minorStart: number) {
  const rand = mulberry32(17);
  const cells: Cell[] = [];

  const push = (x: number, y: number, cluster: number, color: number) => {
    // Intro: cells condense from a loose scatter toward their cluster, like an embedding converging.
    const a = rand() * Math.PI * 2;
    const d = 0.18 + rand() * 0.25;
    cells.push({
      x,
      y,
      sx: x + Math.cos(a) * d,
      sy: y + Math.sin(a) * d,
      cluster,
      color,
      r: 0.9 + rand() * 0.8,
      delay: rand() * 0.35,
    });
  };

  clusters.forEach((c, ci) => {
    // Organic shape: a few overlapping, rotated, anisotropic sub-blobs.
    const blobs = Array.from({ length: 3 + Math.floor(rand() * 3) }, () => ({
      ox: gaussian(rand) * 0.05,
      oy: gaussian(rand) * 0.05,
      sx: 0.035 + rand() * 0.04,
      sy: 0.02 + rand() * 0.03,
      rot: rand() * Math.PI,
    }));
    for (let i = 0; i < c.count; i++) {
      const b = blobs[Math.floor(rand() * blobs.length)];
      const gx = gaussian(rand) * b.sx;
      const gy = gaussian(rand) * b.sy;
      const x = c.cx + b.ox + gx * Math.cos(b.rot) - gy * Math.sin(b.rot);
      const y = c.cy + b.oy + gx * Math.sin(b.rot) + gy * Math.cos(b.rot);
      const minor = rand() < 0.14;
      const color = minor ? minorStart + Math.floor(rand() * (paletteSize - minorStart)) : ci;
      push(x, y, ci, color);
    }
  });

  // Unassigned background tissue inside a rounded, slightly irregular section outline.
  let placed = 0;
  while (placed < BACKGROUND) {
    const x = rand();
    const y = rand();
    const a = Math.atan2(y - 0.5, x - 0.5);
    const edge = 0.46 + 0.03 * Math.sin(a * 3 + 1.3) + 0.02 * Math.sin(a * 7);
    if (Math.hypot(x - 0.5, y - 0.5) > edge) continue;
    push(x, y, -1, -1);
    placed++;
  }

  return cells;
}

/** k-nearest-neighbor links within each cluster, for the hover "connections". */
function buildLinks(cells: Cell[], clusterCount: number) {
  const links: [number, number][][] = Array.from({ length: clusterCount }, () => []);
  for (let ci = 0; ci < clusterCount; ci++) {
    const idx = cells.flatMap((c, i) => (c.cluster === ci ? [i] : []));
    // Sample a subset so the web stays legible.
    const sample = idx.filter((_, k) => k % 3 === 0);
    for (const i of sample) {
      const near = sample
        .filter((j) => j !== i)
        .map((j) => [j, (cells[i].x - cells[j].x) ** 2 + (cells[i].y - cells[j].y) ** 2] as const)
        .sort((a, b) => a[1] - b[1])
        .slice(0, KNN_PER_CELL);
      for (const [j] of near) if (i < j) links[ci].push([i, j]);
    }
  }
  return links;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export default function TissueMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => css.getPropertyValue(name).trim();

    const clusters: ClusterDef[] = MAP_SECTIONS.map((id) => {
      const s = sections.find((x) => x.id === id)!;
      return { id, label: s.title, ...LAYOUT[id] };
    });
    // Palette: dominant colors first (same order as clusters), then minor cell types.
    const palette = [...clusters.map((c) => token(c.color)), ...MINOR.map(token)];
    const background = token("--fg-subtle");

    const cells = buildTissue(clusters, palette.length, clusters.length);
    const links = buildLinks(cells, clusters.length);
    const centroids = clusters.map((_, ci) => {
      const mine = cells.filter((c) => c.cluster === ci);
      return {
        x: mine.reduce((s, c) => s + c.x, 0) / mine.length,
        y: mine.reduce((s, c) => s + c.y, 0) / mine.length,
      };
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const staticMode = () => reduceMotion.matches || window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let introStart = 0;
    let introDone = staticMode();
    let mapHover = -1; // cluster under the pointer on the canvas
    let barHover = -1; // cluster whose link is hovered or focused in the section index
    let hovered = -1; // what's actually lit: the canvas wins, then the index
    // Per-cluster highlight amount, eased toward its target on hover changes.
    const focus = clusters.map(() => 0);
    let anyFocus = 0;
    let lastFrame = 0;

    // Square plot area centered in the canvas, with a little room so enlarged cells never clip.
    const plot = () => {
      const size = Math.min(w, h) * 0.9;
      return { ox: (w - size) / 2, oy: (h - size) / 2, size };
    };

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(introDone ? 1 : 0);
    }

    function draw(progress: number) {
      const { ox, oy, size } = plot();
      ctx!.clearRect(0, 0, w, h);

      // Connections for the hovered cluster: within-cluster kNN web + arcs to the other clusters.
      clusters.forEach((_, ci) => {
        const f = focus[ci];
        if (f < 0.01) return;
        ctx!.strokeStyle = palette[ci];
        ctx!.lineWidth = 0.6;
        ctx!.globalAlpha = 0.28 * f;
        ctx!.beginPath();
        for (const [i, j] of links[ci]) {
          ctx!.moveTo(ox + cells[i].x * size, oy + cells[i].y * size);
          ctx!.lineTo(ox + cells[j].x * size, oy + cells[j].y * size);
        }
        ctx!.stroke();

        ctx!.globalAlpha = 0.45 * f;
        ctx!.lineWidth = 1;
        ctx!.setLineDash([2, 4]);
        const a = centroids[ci];
        centroids.forEach((b, cj) => {
          if (cj === ci) return;
          const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18;
          const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.18;
          ctx!.beginPath();
          ctx!.moveTo(ox + a.x * size, oy + a.y * size);
          ctx!.quadraticCurveTo(ox + mx * size, oy + my * size, ox + b.x * size, oy + b.y * size);
          ctx!.stroke();
        });
        ctx!.setLineDash([]);
      });

      // Cells, grouped by color to limit fillStyle switches.
      for (let p = -1; p < palette.length; p++) {
        ctx!.fillStyle = p === -1 ? background : palette[p];
        for (const c of cells) {
          if (c.color !== p) continue;
          const t = easeOut(Math.min(1, Math.max(0, (progress - c.delay) / (1 - c.delay))));
          const x = ox + (c.sx + (c.x - c.sx) * t) * size;
          const y = oy + (c.sy + (c.y - c.sy) * t) * size;
          const f = c.cluster >= 0 ? focus[c.cluster] : 0;
          const base = c.cluster === -1 ? 0.22 : 0.72;
          const alpha = (base + (0.95 - base) * f) * (1 - 0.7 * anyFocus * (1 - f)) * t;
          if (alpha < 0.01) continue;
          ctx!.globalAlpha = alpha;
          const r = c.r * (1 + 0.35 * f);
          ctx!.fillRect(x - r / 2, y - r / 2, r, r);
        }
      }

      ctx!.globalAlpha = 1;
    }

    function frame(now: number) {
      if (!introStart) introStart = now;
      const dt = lastFrame ? now - lastFrame : 16;
      lastFrame = now;

      const progress = introDone ? 1 : Math.min(1, (now - introStart) / INTRO_MS);
      if (progress >= 1) introDone = true;

      // Ease hover focus; stop animating once everything has settled (calm idle state).
      let settling = false;
      const step = staticMode() ? 1 : dt / HOVER_MS;
      clusters.forEach((_, ci) => {
        const target = hovered === ci ? 1 : 0;
        const d = target - focus[ci];
        if (Math.abs(d) > 0.001) {
          focus[ci] += Math.sign(d) * Math.min(Math.abs(d), step);
          settling = true;
        } else focus[ci] = target;
      });
      anyFocus = Math.max(...focus);

      draw(progress);
      if (!introDone || settling) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        lastFrame = 0;
      }
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    function hitTest(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const { ox, oy, size } = plot();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      let best = -1;
      let bestD = HIT_RADIUS * HIT_RADIUS;
      for (const c of cells) {
        if (c.cluster < 0) continue;
        const d = (ox + c.x * size - px) ** 2 + (oy + c.y * size - py) ** 2;
        if (d < bestD) {
          bestD = d;
          best = c.cluster;
        }
      }
      return best;
    }

    // Legend links in the hero's section index, keyed by section id.
    const legend = new Map<string, HTMLElement>();
    document
      .getElementById(SECTION_INDEX_ID)
      ?.querySelectorAll<HTMLElement>("[data-section]")
      .forEach((el) => legend.set(el.dataset.section!, el));

    function update() {
      const next = mapHover >= 0 ? mapHover : barHover;
      if (next === hovered) return;
      hovered = next;
      // Only light the legend from the canvas side; when the pointer is on a link, it has its own hover style.
      legend.forEach((el, id) => el.toggleAttribute("data-lit", mapHover >= 0 && clusters[mapHover].id === id));
      kick();
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const hit = hitTest(e);
      if (hit !== mapHover) {
        mapHover = hit;
        canvas!.style.cursor = hit >= 0 ? "pointer" : "default";
        update();
      }
    }

    function onLeave() {
      mapHover = -1;
      canvas!.style.cursor = "default";
      update();
    }

    const legendOn = (e: Event) => {
      const id = (e.currentTarget as HTMLElement).dataset.section;
      barHover = clusters.findIndex((c) => c.id === id);
      update();
    };
    const legendOff = () => {
      barHover = -1;
      update();
    };
    const legendEvents = ["pointerenter", "focus"] as const;
    const legendOffEvents = ["pointerleave", "blur"] as const;
    legend.forEach((el) => {
      legendEvents.forEach((t) => el.addEventListener(t, legendOn));
      legendOffEvents.forEach((t) => el.addEventListener(t, legendOff));
    });

    function onClick(e: PointerEvent) {
      const hit = hitTest(e);
      if (hit < 0) return;
      document.getElementById(clusters[hit].id)?.scrollIntoView({ block: "start" });
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    if (!introDone) kick();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick as EventListener);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick as EventListener);
      legend.forEach((el) => {
        legendEvents.forEach((t) => el.removeEventListener(t, legendOn));
        legendOffEvents.forEach((t) => el.removeEventListener(t, legendOff));
        el.removeAttribute("data-lit");
      });
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="tissue-map relative h-full w-full">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
