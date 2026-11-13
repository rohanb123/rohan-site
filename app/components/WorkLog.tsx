import { work } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function WorkLog() {
  return (
    <section aria-labelledby="work" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="01" title="Work" id="work" />
      <ol>
        {work.map((job) => (
          <li
            key={job.org}
            className="grid gap-x-12 gap-y-3 border-b border-line py-10 first:pt-0 md:grid-cols-[13rem_1fr]"
          >
            {/* Meta column */}
            <div className="font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
              <p>{job.dates}</p>
              <p>{job.location}</p>
            </div>

            {/* Content column */}
            <div>
              <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">
                {job.org}
                {job.team && <span className="text-fg-muted"> · {job.team}</span>}
              </h3>
              <p className="mt-1 text-fg-muted">{job.role}</p>
              <ul className="mt-5 max-w-measure space-y-2 text-[15px] leading-relaxed text-fg-muted">
                {job.points.map((p) => (
                  <li key={p} className="grid grid-cols-[1rem_1fr]">
                    <span aria-hidden="true" className="text-fg-subtle">
                      –
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
