// Photography shown on the home page. Images live in assets/photography: centered 4:5 crops of the originals,
// zoomed just enough to drop the watermark, at 1920×2400 and are statically imported, so Next knows their size and makes blur placeholders.
// A full gallery comes back once higher-resolution exports are ready.

import type { StaticImageData } from "next/image";
import lifeguard from "../../assets/photography/port1-3.jpg";
import towers from "../../assets/photography/port1-5.jpg";
import lotus from "../../assets/photography/port1.jpg";
import bridge from "../../assets/photography/p16.jpg";
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
 * `print` scenes are clean digital shots too small to stretch across a wide screen: from lg up they sit as an
 * uncropped print on the dark base instead of full-bleed. On phones they stay full-bleed (`position`, `brightness`),
 * where a portrait photo on a portrait screen is barely enlarged.
 */
export const scenes = [
  {
    id: "towers",
    label: "City",
    photo: showcase.find((p) => p.id === "port1-5")!,
    // Keeps the strip of light in frame
    position: "object-[42%_20%]",
    brightness: "brightness-[0.74]",
    print: false,
  },
  {
    id: "mist",
    label: "Mist",
    photo: { id: "p18", src: mist, alt: "A mountain wrapped in low cloud above a green valley of mossy boulders" },
    // The valley floor: lichen-orange boulders, moss and the dark tree line under the mountain's foot
    position: "object-[50%_100%]",
    brightness: "brightness-[0.62]",
    print: true,
  },
  {
    id: "bridge",
    label: "Bridge",
    // Trimmed from the left edge to drop the watermark
    photo: { id: "p16", src: bridge, alt: "A Golden Gate Bridge tower in fog, the deck crossing a green hill" },
    // On a portrait phone screen, keep the tower in frame
    position: "object-[56%_50%]",
    brightness: "brightness-[0.62]",
    print: true,
  },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
