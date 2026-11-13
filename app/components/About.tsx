import { interests, work } from "../content/resume";
import { site } from "../content/site";
import SectionLabel from "./SectionLabel";

/** At a glance: where I am, what I'm doing now (current roles from Work) and what I'm into. */
export default function About() {
  const current = work.filter((j) => j.dates.endsWith("Present"));
  return (
    <section aria-labelledby="about" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="01" title="About" id="about" />
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-[13rem_1fr]">
        <dl className="font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.14em]">
          <dt className="text-fg-subtle">Based in</dt>
          <dd className="text-fg-muted">{site.location}</dd>
        </dl>

        <dl className="grid max-w-3xl gap-x-12 gap-y-10 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.14em] text-fg-subtle">Currently</dt>
            {current.map((j, i) => (
              <dd key={j.org} className={i ? "mt-5" : "mt-3"}>
                <span className="block font-display text-2xl leading-tight text-fg-heading">{j.org}</span>
                <span className="mt-1 block text-[0.9375rem] text-fg-muted">{j.role}</span>
              </dd>
            ))}
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.14em] text-fg-subtle">Interests</dt>
            <dd className="mt-3">
              <ul className="space-y-2 font-display text-2xl leading-tight text-fg-heading">
                {interests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
