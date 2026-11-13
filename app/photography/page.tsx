import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "../components/Gallery";
import { allPhotos, series } from "../content/photography";

export const metadata: Metadata = {
  title: "Photography | Rohan Bharti",
  description: "Photography by Rohan Bharti: landscape, wildlife, city and street, portraits and experiments.",
};

export default function PhotographyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-gutter pb-24">
      <nav aria-label="Back" className="pt-6 font-mono text-[11px] uppercase leading-10 tracking-[0.16em]">
        <Link href="/#photography" className="text-fg-muted transition-colors duration-200 hover:text-accent">
          ← Rohan Bharti
        </Link>
      </nav>

      <header className="pt-16 pb-14">
        <div className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
          <span>{allPhotos.length} frames</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <h1 className="font-display text-6xl leading-[0.95] text-fg sm:text-8xl">Photography</h1>
        {/* Series index, same pattern as the home hero's section index */}
        <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em]">
          {series.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group inline-flex gap-3 py-1 text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                <span className="text-fg-subtle transition-colors duration-200 group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </header>

      <Gallery series={series} />
    </main>
  );
}
