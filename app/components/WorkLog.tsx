import Link from "next/link";
import { work } from "../content/resume";
import SectionLabel from "./SectionLabel";

/** Compact timeline: one line per role. Depth lives in the case studies. */
export default function WorkLog() {
  return (
    <section aria-labelledby="work" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="02" title="Work" id="work" />
      <ol>
        {work.map((job) => (
          <li
            key={job.org}
            className="grid gap-x-12 gap-y-1 border-b border-line py-6 first:pt-0 md:grid-cols-[13rem_1fr_auto] md:items-baseline"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{job.dates}</p>

            <div>
              <h3 className="font-display text-2xl leading-tight text-fg-heading">
                {job.org}
                <span className="font-sans text-base text-fg-muted"> · {job.role}</span>
              </h3>
              <p className="mt-1 max-w-measure text-[15px] leading-relaxed text-fg-muted">{job.summary}</p>
            </div>

            <div className="flex items-baseline gap-6 pt-2 font-mono text-[11px] uppercase tracking-[0.14em] md:justify-end md:pt-0">
              <span className="text-fg-subtle">{job.location}</span>
              {job.caseStudy && (
                <Link
                  href={`/case-studies/${job.caseStudy}`}
                  className="whitespace-nowrap text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                >
                  Case study →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
