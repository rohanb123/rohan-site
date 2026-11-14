import { work } from "../content/resume";
import SectionLabel from "./SectionLabel";

/** Compact timeline: one line per role. */
export default function WorkLog() {
  return (
    <section aria-labelledby="work" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel id="work" />
      <ol>
        {work.map((job) => (
          <li
            key={job.org}
            className="grid gap-x-12 gap-y-1 border-b border-line py-6 first:pt-0 md:grid-cols-[13rem_1fr_auto] md:items-baseline"
          >
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">{job.dates}</p>

            <div>
              <h3 className="font-display text-2xl leading-tight text-fg-heading">
                {job.org}
                <span className="font-sans text-base text-fg-muted"> · {job.role}</span>
              </h3>
              <p className="mt-1 max-w-measure text-[0.9375rem] leading-relaxed text-fg-muted">{job.summary}</p>
            </div>

            <p className="pt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle md:pt-0 md:text-right">
              {job.location}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
