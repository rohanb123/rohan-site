import { projects } from "../content/resume";
import SectionLabel from "./SectionLabel";

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
            <p className="flex gap-3 font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle md:flex-col md:gap-0">
              {/* Year in the Projects section color */}
              <span className="text-data-5">{p.year}</span>
              <span>{p.context}</span>
            </p>

            {/* Content column */}
            <div>
              <h3 className="font-display text-2xl leading-tight text-fg-heading sm:text-3xl">{p.name}</h3>
              <p className="mt-3 max-w-measure leading-relaxed text-fg-muted">{p.summary}</p>
              <p className="mt-5 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-fg-subtle">
                {p.stack.join(" · ")}
              </p>
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
