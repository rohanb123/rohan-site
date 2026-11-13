import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./content/site";

export const alt = "Rohan Bharti: Ex-IBM watsonx SDE, CS at UC Irvine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse (Satori) can't read CSS variables, so these mirror the tokens in app/globals.css.
const C = {
  bg: "#05060a", // --bg
  fg: "#e8eaf0", // --fg
  fgMuted: "#9aa0ad", // --fg-muted
  line: "rgba(232,234,240,0.11)", // --line
  accent: "#ff5b4f", // --accent
  clusters: ["#e0a05f", "#7ea4d6", "#a68bd4", "#e5685d"], // --data-2, --data-5, --data-8, --data-1 (tissue map)
};

// A small, deterministic echo of the hero tissue map.
function cells() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const centers = [
    [820, 210],
    [1010, 200],
    [830, 420],
    [1010, 420],
  ];
  const out: { x: number; y: number; c: string }[] = [];
  centers.forEach(([cx, cy], i) => {
    for (let k = 0; k < 90; k++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-6))) * 26;
      out.push({ x: cx + Math.cos(a) * r * 1.3, y: cy + Math.sin(a) * r, c: C.clusters[i] });
    }
  });
  return out;
}

export default async function Image() {
  const serif = await readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.bg,
          fontFamily: "Instrument Serif",
        }}
      >
        {cells().map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 3,
              height: 3,
              background: p.c,
              opacity: 0.75,
            }}
          />
        ))}

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 720 }}>
          <div style={{ display: "flex", width: 560, height: 1, background: C.line, marginBottom: 40 }} />
          <div style={{ fontSize: 120, lineHeight: 1, color: C.fg, letterSpacing: -1 }}>{site.name}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontSize: 34, color: C.fgMuted }}>
            <div style={{ width: 10, height: 10, background: C.accent, marginRight: 16 }} />
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: serif, style: "normal", weight: 400 }],
    },
  );
}
