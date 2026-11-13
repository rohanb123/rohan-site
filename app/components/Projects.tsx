import Link from "next/link";
import { LAYERS, projects, type Project } from "../content/resume";
import SectionLabel from "./SectionLabel";

// Bottom of the stack first, so the ticks read left to right as hardware -> product.
const TICKS = [...LAYERS].reverse();
const SHORT: Record<(typeof LAYERS)[number], string> = {
  Hardware: "HW",
  "Data & Infra": "Data",
  ML: "ML",
  Product: "Product",
};
// Each layer has its own data-palette color (see --layer-* tokens). Full class names so Tailwind finds them.
const DOT: Record<(typeof LAYERS)[number], string> = {
  Hardware: "border-layer-hw bg-layer-hw",
  "Data & Infra": "border-layer-data bg-layer-data",
  ML: "border-layer-ml bg-layer-ml",
  Product: "border-layer-product bg-layer-product",
};

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="03" title="Projects" id="projects" />
      <ol>
        {projects.map((p) => (
          <li
            key={p.id}
            className="grid gap-x-12 gap-y-3 border-b border-line py-10 first:pt-0 md:grid-cols-[13rem_1fr]"
          >
            {/* Meta column */}
            <p className="font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
              {p.context}
            </p>

            {/* Content column */}
            <div>
              <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">{p.name}</h3>
              <StackTicks project={p} />
              <p className="mt-5 max-w-measure leading-relaxed text-fg-muted">{p.summary}</p>
              <p className="mt-5 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-fg-subtle">
                {p.stack.join(" · ")}
              </p>
              {(p.caseStudy || p.url) && (
                <p className="mt-4 flex gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                  {p.caseStudy && (
                    <Link
                      href={`/case-studies/${p.caseStudy}`}
                      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                    >
                      Case study →
                    </Link>
                  )}
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                    >
                      Link ↗
                    </a>
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Which layers of the stack the project touched: filled = yes, hollow = no. Hover shows the evidence. */
function StackTicks({ project }: { project: Project }) {
  const touched = TICKS.filter((l) => project.layers[l]);
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em]">
      <span className="sr-only">Stack layers: {touched.join(", ")}.</span>
      {TICKS.map((l) => {
        const evidence = project.layers[l];
        return (
          <span
            key={l}
            aria-hidden="true"
            title={evidence}
            className={`inline-flex items-center gap-1.5 ${evidence ? "text-fg-muted" : "text-fg-subtle"}`}
          >
            {SHORT[l]}
            <span
              className={`size-[7px] rounded-full border ${
                evidence ? DOT[l] : "border-fg-subtle"
              }`}
            />
          </span>
        );
      })}
    </p>
  );
}
