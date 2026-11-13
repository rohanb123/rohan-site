import { education } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function Education() {
  return (
    <section aria-labelledby="education" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="04" title="Education" id="education" />
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-[13rem_1fr]">
        {/* Meta column: the degree's details. On phones it follows the school, not precedes it */}
        <dl className="order-last grid grid-cols-2 content-start gap-6 md:order-none font-mono text-[11px] uppercase leading-6 tracking-[0.14em] md:grid-cols-1">
          <div>
            <dt className="text-fg-subtle">Concentrations</dt>
            {education.focus.map((f) => (
              <dd key={f} className="text-fg-muted">
                {f}
              </dd>
            ))}
          </div>
          <div>
            <dt className="text-fg-subtle">GPA</dt>
            <dd className="text-fg-muted">{education.gpa}</dd>
          </div>
        </dl>

        <div>
          <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">{education.school}</h3>
          <p className="mt-2 text-lg text-fg">{education.degree}</p>

          <dl className="mt-10 grid max-w-measure gap-6 text-[15px] leading-relaxed sm:grid-cols-2">
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
