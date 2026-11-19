import { education } from "../content/resume";
import Section from "./Section";

export default function Education() {
  return (
    <Section id="education">
      <div className="grid gap-x-12 gap-y-6 min-[900px]:grid-cols-2">
        <div>
          <h3 className="font-display text-xl leading-tight tracking-[-0.02em]">{education.school}</h3>
          <p className="text-[0.9375rem] text-fg-subtle">
            {education.degree}
            <span aria-hidden="true" className="mx-2.5">/</span>
            GPA {education.gpa}
          </p>
        </div>
        <dl className="grid grid-cols-[9.5rem_1fr] gap-x-4 gap-y-3 max-sm:grid-cols-1 max-sm:gap-y-1">
          <dt className="text-[0.9375rem] text-fg-subtle">Concentrations</dt>
          <dd className="max-sm:mb-3">{education.focus.join(", ")}</dd>
          <dt className="text-[0.9375rem] text-fg-subtle">Honors</dt>
          <dd className="text-fg-muted">
            <ul>
              {education.awards.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>
    </Section>
  );
}
