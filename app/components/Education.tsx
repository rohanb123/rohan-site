import { education } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function Education() {
  return (
    <section aria-labelledby="education" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="04" title="Education" id="education" />
      <div className="grid gap-x-12 gap-y-3 md:grid-cols-[13rem_1fr]">
        <div className="font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
          <p>{education.degree}</p>
          <p>{education.dates}</p>
          <p>GPA {education.gpa}</p>
        </div>
        <div>
          <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">{education.school}</h3>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
            {education.focus.join(" · ")}
          </p>

          <dl className="mt-8 grid max-w-measure gap-6 text-[15px] leading-relaxed sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Awards</dt>
              {education.awards.map((a) => (
                <dd key={a} className="mt-2 text-fg-muted">
                  {a}
                </dd>
              ))}
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Involvement</dt>
              {education.involvement.map((a) => (
                <dd key={a} className="mt-2 text-fg-muted">
                  {a}
                </dd>
              ))}
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
