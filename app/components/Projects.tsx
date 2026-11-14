import { projects } from "../content/resume";
import SectionLabel from "./SectionLabel";

/**
 * Compact two-column catalog, sized like the Work timeline so the whole section fits one laptop screen.
 * Work is a date-led list of rows; Projects is a name-led grid, so the two never read as the same thing.
 */
export default function Projects() {
  return (
    <section aria-labelledby="projects" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel id="projects" />

      <ol className="grid gap-x-12 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.id} className="flex flex-col border-b border-line py-6 first:pt-0 md:nth-2:pt-0">
            {/* Year in the Projects section color, then where it was built */}
            <p className="font-mono text-meta uppercase tracking-[0.14em] text-fg-subtle">
              <span className="text-data-5">{p.year}</span>
              <span aria-hidden="true"> · </span>
              <span>{p.context}</span>
            </p>

            <h3 className="mt-2 font-display text-2xl leading-tight text-fg-heading">{p.name}</h3>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-fg-muted">{p.summary}</p>

            <p className="mt-3 font-mono text-meta uppercase leading-6 tracking-[0.12em] text-fg-subtle">
              {/* Each stack item stays on one line; wraps only fall between items */}
              {p.stack.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <span className="whitespace-nowrap">{s}</span>
                </span>
              ))}
              {p.url && (
                <>
                  <span aria-hidden="true"> · </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                  >
                    Link ↗<span className="sr-only"> to {p.name} (opens in a new tab)</span>
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
