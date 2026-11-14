import Image from "next/image";
import { showcase } from "../content/photography";
import SectionLabel from "./SectionLabel";

/** Three selected frames. Media gets a square (0) radius. */
export default function Photography() {
  return (
    <section aria-labelledby="photography" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel id="photography" />
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-[13rem_1fr]">
        <p className="font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
          A few favorites
          <span className="block text-fg-muted">Full gallery soon</span>
        </p>
        <ul className="grid grid-cols-3 gap-2 sm:gap-3">
          {showcase.map((p) => (
            <li key={p.id} className="overflow-hidden bg-bg-raised">
              <Image
                src={p.src}
                alt={p.alt}
                placeholder="blur"
                sizes="(max-width: 768px) 33vw, 260px"
                className="aspect-[4/5] w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
