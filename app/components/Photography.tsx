import Image from "next/image";
import Link from "next/link";
import { allPhotos, series, showcase } from "../content/photography";
import SectionLabel from "./SectionLabel";

/** Home-page teaser: three selected frames and the way into the full gallery. */
export default function Photography() {
  return (
    <section aria-labelledby="photography" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="05" title="Photography" id="photography" />
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-[13rem_1fr]">
        <div className="flex flex-col gap-4 font-mono text-[11px] uppercase leading-6 tracking-[0.14em]">
          <p className="text-fg-subtle">
            {allPhotos.length} frames · {series.length} series
          </p>
          <Link
            href="/photography"
            className="self-start text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
          >
            All photography →
          </Link>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:gap-3">
          {showcase.map((p) => (
            <li key={p.id}>
              <Link href={`/photography#${p.id}`} className="group block overflow-hidden bg-bg-raised">
                <Image
                  src={p.src}
                  alt={p.alt}
                  placeholder="blur"
                  sizes="(max-width: 768px) 33vw, 260px"
                  className="aspect-[4/5] w-full object-cover opacity-90 transition-[opacity,scale] duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
