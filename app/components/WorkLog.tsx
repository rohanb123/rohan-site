import { work } from "../content/resume";
import Section from "./Section";

/** Work as a list of rows: dates / org and role / one line. */
export default function WorkLog() {
  return (
    <Section id="work">
      <ol>
        {work.map((job) => (
          <li
            key={job.org}
            className="group grid gap-x-8 gap-y-1.5 border-t border-rule py-5 first:border-t-0 first:pt-0 min-[900px]:grid-cols-[10.5rem_minmax(0,17rem)_minmax(0,1fr)] min-[900px]:items-baseline"
          >
            <p className="text-[0.9375rem] text-fg-subtle">{job.dates}</p>
            <div>
              <h3 className="font-display text-xl leading-tight tracking-[-0.02em] transition-colors duration-150 group-hover:text-link">{job.org}</h3>
              <p className="text-[0.9375rem] text-fg-subtle">
                {job.role}
                {job.team && <>, {job.team}</>}
              </p>
            </div>
            <p className="text-fg-muted">{job.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
