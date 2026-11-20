import { projects } from "../content/resume";
import Section from "./Section";

/** 2x2 catalog: quadrants split by a thin cross of rules, not cards. Newest first, like Work. */
export default function Projects() {
  // Stable sort, so same-year projects keep their order in resume.ts
  const byYear = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Section id="projects">
      <ol className="md:grid md:grid-cols-2">
        {byYear.map((p) => (
          <li
            key={p.id}
            className="group relative border-t border-rule py-7 first:border-t-0 first:pt-0 md:odd:border-r md:odd:pr-8 md:even:pl-8 md:nth-[-n+2]:border-t-0 md:nth-[-n+2]:pt-0"
          >
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl leading-tight tracking-[-0.02em] transition-colors duration-150 group-hover:text-link group-focus-within:text-link">
                {p.url ? (
                  // Stretched link: its ::after covers the whole quadrant, so the box is the click target
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {p.name}
                    <span className="sr-only"> on GitHub (opens in a new tab)</span>
                  </a>
                ) : (
                  p.name
                )}
              </h3>
              <span className="text-[0.9375rem] text-fg-subtle tabular-nums">{p.year}</span>
            </div>
            <p className="text-fg-muted">{p.summary}</p>
            <p className="mt-3 text-[0.9375rem] text-fg-subtle">{p.stack.join(", ")}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
