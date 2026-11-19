import Image from "next/image";
import { showcase } from "../content/photography";
import Section from "./Section";

/** The two frames not used in the hero, at unequal sizes. Square corners: media keeps a 0 radius. */
export default function Photography() {
  const frames = showcase.filter((p) => p.id !== "port1-5");
  return (
    <Section id="photography">
      <ul className="grid items-start gap-6 md:grid-cols-[1fr_1.3fr]">
        {frames.map((p) => (
          <li key={p.id}>
            <Image src={p.src} alt={p.alt} placeholder="blur" sizes="(min-width: 768px) 40vw, 100vw" className="block h-auto w-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
