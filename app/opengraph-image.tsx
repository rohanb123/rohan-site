import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./content/site";

export const alt = "Rohan Bharti: Ex-IBM watsonx SDE Intern, CS at UC Irvine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse (Satori) can't read CSS variables, so these mirror the tokens in app/globals.css.
const C = {
  bg: "#0e0c11", // --bg
  fg: "#ece4e3", // --fg
  paint: ["#e8743a", "#f39a52", "#ffc77e"], // --paint-orange, --paint-glow, --paint-gold (the hero's fallback gradient)
};

// Archivo at width 125, weight 300: the hero's display setting as a static instance (Satori has no variable axes).
const display = await readFile(join(process.cwd(), "assets/fonts/Archivo-Expanded-Light.ttf"));
const towers = await readFile(join(process.cwd(), "assets/photography/port1-5-melt.jpg"));
const towersSrc = `data:image/jpeg;base64,${towers.toString("base64")}`;

export default async function Image() {
  const [first, last] = site.name.toUpperCase().split(" ");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.bg, fontFamily: "Archivo" }}>
        <img
          src={towersSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", objectPosition: "40% 35%", opacity: 0.7 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(to top, ${C.bg} 12%, rgba(14,12,17,0.65) 50%, rgba(14,12,17,0) 85%)`,
          }}
        />
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 64, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 0.92, letterSpacing: -4, color: C.fg }}>{first}</div>
          <div
            style={{
              fontSize: 120,
              lineHeight: 0.92,
              letterSpacing: -4,
              backgroundImage: `linear-gradient(100deg, ${C.paint[0]} 5%, ${C.paint[1]} 45%, ${C.paint[2]} 75%, ${C.paint[0]} 100%)`,
              backgroundClip: "text",
              color: "transparent",
              alignSelf: "flex-start",
            }}
          >
            {last}
          </div>
          <div style={{ marginTop: 32, fontSize: 32, color: C.fg, fontFamily: "Archivo" }}>{site.tagline.replace(" | ", ", ")}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo", data: display, style: "normal", weight: 300 }],
    },
  );
}
