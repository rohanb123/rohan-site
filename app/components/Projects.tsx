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

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="02" title="Projects" id="projects" />
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
              {p.points.length > 0 && (
                <ul className="mt-4 max-w-measure space-y-2 text-[15px] leading-relaxed text-fg-muted">
                  {p.points.map((pt) => (
                    <li key={pt} className="grid grid-cols-[1rem_1fr]">
                      <span aria-hidden="true" className="text-fg-subtle">
                        –
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-fg-subtle">
                {p.stack.join(" · ")}
              </p>
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
              className={`size-[6px] rounded-full border ${
                evidence ? "border-fg-muted bg-fg-muted" : "border-fg-subtle"
              }`}
            />
          </span>
        );
      })}
    </p>
  );
}
