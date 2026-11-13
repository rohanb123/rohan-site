// Photography. Images live in assets/photography and are statically imported, so Next knows their
// size and generates blur placeholders. Grouping and order are a first pass; captions only when supplied.

import type { StaticImageData } from "next/image";
import p1 from "../../assets/photography/p1.jpg";
import p2 from "../../assets/photography/p2.jpg";
import p3 from "../../assets/photography/p3.jpg";
import p4 from "../../assets/photography/p4.jpg";
import p5 from "../../assets/photography/p5.jpg";
import p6 from "../../assets/photography/p6.png";
import p7 from "../../assets/photography/p7.jpg";
import p8 from "../../assets/photography/p8.png";
import p9 from "../../assets/photography/p9.jpg";
import p10 from "../../assets/photography/p10.jpg";
import p11 from "../../assets/photography/p11.jpg";
import p12 from "../../assets/photography/p12.jpg";
import p13 from "../../assets/photography/p13.jpg";
import p14 from "../../assets/photography/p14.jpg";
import p15 from "../../assets/photography/p15.jpg";
import p16 from "../../assets/photography/p16.jpg";
import p17 from "../../assets/photography/p17.jpg";
import p18 from "../../assets/photography/p18.jpg";
import p19 from "../../assets/photography/p19.jpg";
import p20 from "../../assets/photography/p20.jpg";
import p21 from "../../assets/photography/p21.jpg";
import p22 from "../../assets/photography/p22.png";
import p23 from "../../assets/photography/p23.png";
import p24 from "../../assets/photography/p24.jpg";

export type Photo = { id: string; src: StaticImageData; alt: string };
export type Series = { id: string; title: string; photos: Photo[] };

const photo = (id: string, src: StaticImageData, alt: string): Photo => ({ id, src, alt });

export const series: Series[] = [
  {
    id: "landscape",
    title: "Landscape",
    photos: [
      photo("p1", p1, "A lone hiker on a golden, grassy ridge above hazy hills"),
      photo("p2", p2, "A figure standing on top of a rock outcrop on a golden hillside"),
      photo("p3", p3, "A figure crouched on top of a rock outcrop on a golden hillside"),
      photo("p11", p11, "Two lifeguard towers on a hazy, pink-lit beach"),
      photo("p12", p12, "A lifeguard tower on a misty beach, close"),
      photo("p18", p18, "A mountain wrapped in low cloud above green scrub"),
      photo("p13", p13, "Surf washing over a pink-toned beach with a small shorebird"),
      photo("p14", p14, "Clouds lit pink over a dark mountain ridge"),
      photo("p19", p19, "Pink blossoms against a bright blue sky"),
    ],
  },
  {
    id: "wildlife",
    title: "Wildlife",
    photos: [
      photo("p5", p5, "A pigeon with green and purple plumage and a red beak, close up"),
      photo("p4", p4, "A koala asleep in the fork of a tree"),
      photo("p20", p20, "A red-tailed hawk perched with its prey"),
      photo("p21", p21, "A hawk perched on a fence in late-afternoon light"),
    ],
  },
  {
    id: "city",
    title: "City & street",
    photos: [
      photo("p16", p16, "A tower of the Golden Gate Bridge against a pale sky"),
      photo("p17", p17, "A sliver of sunlight between two glass towers"),
      photo("p15", p15, "A light blue sports car speeding past, the background blurred"),
      photo("p9", p9, "A marching band in red and white uniforms lined up on a street"),
      photo("p10", p10, "A drummer in a sailor uniform playing outdoors to a small crowd"),
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    photos: [
      photo("p8", p8, "A man lowering his sunglasses beside the water"),
      photo("p7", p7, "A man with curly hair holding a phone to his ear, wearing earbuds"),
      photo("p6", p6, "Two people in warm orange light, their faces motion-blurred"),
    ],
  },
  {
    id: "experiments",
    title: "Experiments",
    photos: [
      photo("p23", p23, "An extreme close-up of an eye, in saturated false color"),
      photo("p22", p22, "Two friends on a bench in tinted glasses, in front of a glitched green background"),
      photo("p24", p24, "A repeated pattern of birds on branches against blue"),
    ],
  },
];

/** Every photo in page order, for the lightbox. */
export const allPhotos = series.flatMap((s) => s.photos);

/** Shown on the home page. */
export const showcase = ["p1", "p12", "p17"].map((id) => allPhotos.find((p) => p.id === id)!);
