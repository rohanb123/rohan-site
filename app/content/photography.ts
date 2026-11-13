// Photography shown on the home page. Images live in assets/photography (resized from the originals to
// 2400px on the long edge) and are statically imported, so Next knows their size and makes blur placeholders.
// A full gallery comes back once higher-resolution exports are ready.

import type { StaticImageData } from "next/image";
import lifeguard from "../../assets/photography/port1-3.jpg";
import towers from "../../assets/photography/port1-5.jpg";
import lotus from "../../assets/photography/port1.jpg";

export type Photo = { id: string; src: StaticImageData; alt: string };

export const showcase: Photo[] = [
  { id: "port1-3", src: lifeguard, alt: "A lifeguard tower on a misty, pink-lit beach" },
  { id: "port1-5", src: towers, alt: "A sliver of sunset light between two glass towers" },
  { id: "port1", src: lotus, alt: "A light blue Lotus sports car speeding across the Golden Gate Bridge" },
];
