import { interests } from "../content/resume";
import { site } from "../content/site";
import Copy from "./Copy";
import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section aria-labelledby="about" className="mx-auto w-full max-w-6xl px-gutter pt-section">
      <SectionLabel index="01" title="About" id="about" />
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-[13rem_1fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Interests</p>
          <ul className="mt-3 space-y-1 text-[15px] text-fg-muted">
            {interests.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <p className="max-w-measure text-xl leading-relaxed text-fg">
          <Copy text={site.about.note} />
        </p>
      </div>
    </section>
  );
}
