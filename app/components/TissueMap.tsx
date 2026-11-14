"use client";

import { useEffect, useRef } from "react";
import { SECTION_INDEX_ID, sections } from "../content/site";

/**
 * Hero signature visual: a synthetic "tissue map" in the style of spatial transcriptomics.
 * Each colored cluster is a site section; hover highlights it and its connections, click scrolls to it.
 * The hero's section index is the map's legend: hovering or focusing a link there lights its cluster,
 * and hovering a cluster lights its link (via a `data-lit` attribute). No labels are drawn on the canvas.
 * After the intro the map drifts slowly, like live tissue under a microscope: each cell wobbles a pixel
 * or two and each cluster sways and breathes. With a mouse, clusters lean toward the pointer at
 * different depths and cells part around it. It is the page's one ambient motion; it runs at 30fps, pauses
 * off-screen, and is off for reduced motion and on phones.
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
  ph: number; // drift phase, radians
  fq: number; // drift speed multiplier
};

const MAP_SECTIONS = ["work", "projects", "education", "photography", "contact"];
function color(id: string) {
  return sections.find((s) => s.id === id)!.color;
}
const LAYOUT: Record<string, Omit<ClusterDef, "id" | "label">> = {
  work: { cx: 0.3, cy: 0.3, count: 720, color: color("work") },
  projects: { cx: 0.71, cy: 0.28, count: 680, color: color("projects") },
  photography: { cx: 0.28, cy: 0.74, count: 420, color: color("photography") },
  education: { cx: 0.52, cy: 0.54, count: 420, color: color("education") },
  contact: { cx: 0.73, cy: 0.74, count: 340, color: color("contact") },
};
// Minor cell types mixed into every cluster, as in real tissue. Not section colors, so they don't compete.
const MINOR = ["--data-6", "--data-7"];
const BACKGROUND = 680;
const INTRO_MS = 2400;
const HOVER_MS = 220;
const HIT_RADIUS = 16; // px
const KNN_PER_CELL = 2;
// Drift (see the header comment). Cell wobble in px; cluster breathing as a fraction of its size.
const DRIFT_PX = 2;
const BREATHE = 0.04;
const CLUSTER_SWAY_PX = 6;
const DRIFT_FPS = 30;
// Cursor: clusters lean toward the pointer with parallax (each at its own depth), and cells right
// under the pointer part around it. Mouse only.
const LEAN_PX = 12;
const DEPTHS = [1, 0.55, 1.35, 0.8, 1.15]; // per cluster, so the lean reads as depth; background uses 0.35
const PART_RADIUS = 70; // px
const PART_PX = 9;
const CURSOR_EASE_MS = 260;

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
  // Separate stream for drift, so adding it didn't move any cell in the layout.
  const driftRand = mulberry32(91);
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
      ph: driftRand() * Math.PI * 2,
      fq: 0.6 + driftRand() * 0.8,
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
    // Cells grouped by palette index (+1, so background is group 0): one fillStyle per group.
    const byColor: Cell[][] = Array.from({ length: palette.length + 1 }, () => []);
    for (const c of cells) byColor[c.color + 1].push(c);
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
    let lastDraw = 0;
    let onScreen = true;
    const drifting = () => !staticMode() && onScreen && !document.hidden;

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

    // Cursor state, in canvas px. `lean` and `part` ease toward their targets each frame.
    const pointer = { x: 0, y: 0, lx: 0, ly: 0, active: false, moved: 0 }; // x/y: client; lx/ly: canvas
    const lean = { x: 0, y: 0 };
    let part = 0; // 0..1: how strongly cells part around the pointer

    // Drift offsets at time t (seconds): each cluster sways and breathes around its centroid.
    const sway = clusters.map(() => ({ x: 0, y: 0, s: 1 }));
    function setDrift(t: number) {
      clusters.forEach((_, ci) => {
        const k = ci * 1.7;
        const d = DEPTHS[ci % DEPTHS.length];
        sway[ci].x = CLUSTER_SWAY_PX * Math.sin(t * 0.3 + k) + lean.x * d;
        sway[ci].y = CLUSTER_SWAY_PX * Math.cos(t * 0.24 + k * 1.3) + lean.y * d;
        sway[ci].s = 1 + BREATHE * Math.sin(t * 0.6 + k);
      });
    }
    let time = 0;

    /** Screen position of a cell at intro progress t (0..1), including drift. Writes into `pos` (no allocation per cell). */
    const pos = { x: 0, y: 0 };
    function cellPos(c: Cell, t: number, ox: number, oy: number, size: number) {
      let nx = c.sx + (c.x - c.sx) * t;
      let ny = c.sy + (c.y - c.sy) * t;
      let dx = DRIFT_PX * Math.sin(time * c.fq * 1.4 + c.ph);
      let dy = DRIFT_PX * Math.cos(time * c.fq * 1.1 + c.ph * 1.3);
      if (c.cluster >= 0) {
        const m = centroids[c.cluster];
        const sw = sway[c.cluster];
        nx = m.x + (nx - m.x) * sw.s;
        ny = m.y + (ny - m.y) * sw.s;
        dx += sw.x;
        dy += sw.y;
      } else {
        dx = dx * 0.6 + lean.x * 0.35;
        dy = dy * 0.6 + lean.y * 0.35;
      }
      pos.x = ox + nx * size + dx;
      pos.y = oy + ny * size + dy;
      if (part > 0.01) {
        const vx = pos.x - pointer.lx;
        const vy = pos.y - pointer.ly;
        const d2 = vx * vx + vy * vy;
        if (d2 < PART_RADIUS * PART_RADIUS && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = PART_PX * part * (1 - d / PART_RADIUS) ** 2;
          pos.x += (vx / d) * push;
          pos.y += (vy / d) * push;
        }
      }
      return pos;
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
          cellPos(cells[i], 1, ox, oy, size);
          ctx!.moveTo(pos.x, pos.y);
          cellPos(cells[j], 1, ox, oy, size);
          ctx!.lineTo(pos.x, pos.y);
        }
        ctx!.stroke();

        ctx!.globalAlpha = 0.45 * f;
        ctx!.lineWidth = 1;
        ctx!.setLineDash([2, 4]);
        // Centroids in px, following each cluster's sway.
        const at = (k: number) => ({ x: ox + centroids[k].x * size + sway[k].x, y: oy + centroids[k].y * size + sway[k].y });
        const a = at(ci);
        centroids.forEach((_, cj) => {
          if (cj === ci) return;
          const b = at(cj);
          const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18;
          const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.18;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.quadraticCurveTo(mx, my, b.x, b.y);
          ctx!.stroke();
        });
        ctx!.setLineDash([]);
      });

      // Cells, grouped by color to limit fillStyle switches.
      for (let p = -1; p < palette.length; p++) {
        ctx!.fillStyle = p === -1 ? background : palette[p];
        for (const c of byColor[p + 1]) {
          const t = progress >= 1 ? 1 : easeOut(Math.min(1, Math.max(0, (progress - c.delay) / (1 - c.delay))));
          const { x, y } = cellPos(c, t, ox, oy, size);
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

      // Cursor: lean toward the pointer (relative to the map's center), part cells under it.
      const k = 1 - Math.exp(-dt / CURSOR_EASE_MS);
      const live = !staticMode();
      let leanX = 0;
      let leanY = 0;
      let partTarget = 0;
      if (live && pointer.active) {
        const rect = canvas!.getBoundingClientRect();
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        pointer.lx = px;
        pointer.ly = py;
        leanX = Math.max(-1, Math.min(1, (px - w / 2) / (w * 0.75))) * LEAN_PX;
        leanY = Math.max(-1, Math.min(1, (py - h / 2) / (h * 0.75))) * LEAN_PX;
        partTarget = px >= 0 && py >= 0 && px <= w && py <= h ? 1 : 0;
      }
      lean.x += (leanX - lean.x) * k;
      lean.y += (leanY - lean.y) * k;
      part += (partTarget - part) * k;
      const cursorBusy = now - pointer.moved < 800 || Math.abs(leanX - lean.x) + Math.abs(leanY - lean.y) > 0.2 || Math.abs(partTarget - part) > 0.02;

      // Drift alone only needs 30fps; intro, hover easing and cursor response draw every frame.
      const driftOnly = introDone && !settling && !cursorBusy;
      if (!driftOnly || now - lastDraw >= 1000 / DRIFT_FPS - 2) {
        if (drifting()) time = now / 1000;
        setDrift(time);
        draw(progress);
        lastDraw = now;
      }
      if (!introDone || settling || drifting() || (live && cursorBusy)) raf = requestAnimationFrame(frame);
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
    // Pause the drift while the map is off-screen or the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      kick();
    });
    io.observe(wrap);
    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    if (!introDone) kick();

    const onWindowMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      pointer.moved = performance.now();
      if (onScreen) kick();
    };
    const onWindowLeave = () => {
      pointer.active = false;
      pointer.moved = performance.now();
      kick();
    };
    window.addEventListener("pointermove", onWindowMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onWindowLeave);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick as EventListener);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onWindowMove);
      document.documentElement.removeEventListener("pointerleave", onWindowLeave);
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
