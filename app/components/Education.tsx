import { education } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function Education() {
  return (
    <section aria-labelledby="education" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel id="education" />
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-[13rem_1fr]">
        {/* Left column: awards. On phones it follows the school. */}
        <div className="order-last md:order-none">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">Awards</p>
          <ul className="mt-3 space-y-2 text-[0.9375rem] leading-snug text-fg-muted">
            {education.awards.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        {/* Content column: the title lines up with the org and project names above */}
        <div>
          <h3 className="font-display text-2xl leading-tight text-fg-heading sm:text-3xl">{education.school}</h3>
          {/* Same style as a role under an org name (Work) */}
          <p className="mt-1 text-[0.9375rem] text-fg-muted">{education.degree}</p>
          <p className="mt-3 font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
            {education.focus.join(" · ")}
            {/* GPA joins the line on wider screens; on phones it gets its own line instead of a dangling "·" */}
            <span className="block sm:inline">
              <span className="hidden sm:inline"> · </span>GPA {education.gpa}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
