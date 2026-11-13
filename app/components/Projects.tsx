import { LAYERS, projects, type Layer } from "../content/resume";
import SectionLabel from "./SectionLabel";

const SHORT: Record<Layer, string> = {
  Hardware: "Hardware",
  "Data & Infra": "Data",
  ML: "ML",
  Product: "Product",
};
// Each stack layer has its own data-palette color (see --layer-* tokens). Full class names so Tailwind finds them.
const DOT: Record<Layer, string> = {
  Hardware: "bg-layer-hw",
  "Data & Infra": "bg-layer-data",
  ML: "bg-layer-ml",
  Product: "bg-layer-product",
};

function Dot({ layer }: { layer: Layer }) {
  return <span aria-hidden="true" className={`size-[6px] shrink-0 rounded-full ${DOT[layer]}`} />;
}

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="03" title="Projects" id="projects" />

      {/* One legend for the whole section, so each tool's dot can carry its layer without repeating labels */}
      <p className="-mt-6 mb-10 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle md:pl-[calc(13rem+3rem)]">
        {LAYERS.map((l) => (
          <span key={l} className="inline-flex items-center gap-1.5">
            <Dot layer={l} />
            {SHORT[l]}
          </span>
        ))}
      </p>

      <ol>
        {projects.map((p) => (
          <li
            key={p.id}
            className="grid gap-x-12 gap-y-3 border-b border-line py-10 first:pt-0 md:grid-cols-[13rem_1fr]"
          >
            {/* Meta column */}
            <p className="flex gap-3 font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle md:flex-col md:gap-0">
              <span>{p.year}</span>
              <span>{p.context}</span>
            </p>

            {/* Content column */}
            <div>
              <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">{p.name}</h3>
              <p className="mt-3 max-w-measure leading-relaxed text-fg-muted">{p.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-fg-subtle">
                {p.stack.map((t) => (
                  <li key={t.name} className="inline-flex items-center gap-2" title={t.layer}>
                    <Dot layer={t.layer} />
                    {t.name}
                    <span className="sr-only">({t.layer})</span>
                  </li>
                ))}
              </ul>
              {p.url && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                  >
                    Link ↗
                  </a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
