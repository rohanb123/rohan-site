import { education } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function Education() {
  return (
    <section aria-labelledby="education" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="04" title="Education" id="education" />
      {/* No meta column here: the date and GPA are headline facts, so they sit in the content column */}
      <div className="md:pl-[calc(13rem+3rem)]">
        <div>
          <h3 className="font-display text-3xl leading-tight text-fg-heading sm:text-4xl">{education.school}</h3>
          <p className="mt-2 text-lg text-fg">{education.degree}</p>
          <p className="mt-2 font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-fg-subtle">
            {education.focus.join(" · ")}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-6">
            <div>
              <dt className="mb-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">GPA</dt>
              <dd className="block font-display text-5xl leading-none text-fg-heading">{education.gpa}</dd>
            </div>
            <div>
              <dt className="mb-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Expected graduation</dt>
              <dd className="block font-display text-5xl leading-none text-fg-heading">{education.graduation}</dd>
            </div>
          </dl>

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
