// Photography shown on the home page. Images live in assets/photography: centered 4:5 crops of the originals,
// zoomed just enough to drop the watermark, at 1920×2400 and are statically imported, so Next knows their size and makes blur placeholders.
// A full gallery comes back once higher-resolution exports are ready.

import type { StaticImageData } from "next/image";
import lifeguard from "../../assets/photography/port1-3.jpg";
import towers from "../../assets/photography/port1-5.jpg";
import lotus from "../../assets/photography/port1.jpg";
import mist from "../../assets/photography/p18.jpg";

export type Photo = { id: string; src: StaticImageData; alt: string };

export const showcase: Photo[] = [
  { id: "port1-3", src: lifeguard, alt: "A lifeguard tower on a misty, pink-lit beach" },
  { id: "port1-5", src: towers, alt: "A sliver of sunset light between two glass towers" },
  { id: "port1", src: lotus, alt: "A light blue Lotus sports car speeding across the Golden Gate Bridge" },
];

/**
 * Hero scenes. Each photo brings its own palette (`html[data-scene]` in globals.css); SceneSwitch flips between them.
 * The first is the default and the one the static page, the OG image and no-JS visitors get.
 */
export const scenes = [
  {
    id: "towers",
    label: "Towers",
    photo: showcase.find((p) => p.id === "port1-5")!,
    // Keeps the strip of light in frame
    position: "object-[42%_20%]",
    brightness: "brightness-[0.74]",
  },
  {
    id: "mist",
    label: "Mist",
    photo: { id: "p18", src: mist, alt: "A mountain wrapped in low cloud above a green valley of mossy boulders" },
    // The rock face and the valley; the white fog above would wash out the bar
    position: "object-[50%_68%]",
    brightness: "brightness-[0.6]",
  },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
