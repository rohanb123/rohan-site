// SAVED: iteration 2 (Archivo Expanded default), kept to compare against later versions. Not linked from the site; delete once a direction is chosen.
import type { Metadata } from "next";
import Image from "next/image";
import { Archivo, Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { showcase } from "../../content/photography";
import { contact, education, projects, work } from "../../content/resume";
import { site } from "../../content/site";
import "./preview.css";

// Two display options to compare; the body face is shared.
const serif = Bodoni_Moda({ variable: "--tp-serif", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const wide = Archivo({ variable: "--tp-wide", subsets: ["latin"], axes: ["wdth"] });
const sans = Schibsted_Grotesk({ variable: "--tp-sans", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = { title: "Theme preview v2", robots: { index: false } };
// Reads ?t= at request time; a blocking render is fine for a throwaway preview.
export const instant = false;

const TYPE = { serif: "Bodoni", wide: "Archivo Expanded" } as const;
type TypeKey = keyof typeof TYPE;

const NAV = [
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects" },
  { id: "photography", title: "Photography" },
  { id: "contact", title: "Contact" },
];

export default async function ThemePreview({ searchParams }: PageProps<"/theme-preview/v2">) {
  const { t } = await searchParams;
  const type: TypeKey = t === "serif" ? "serif" : "wide";
  const [cover, ...rest] = showcase;
  const email = contact.find((c) => c.label === "Email")!;

  return (
    <div className={`tp ${serif.variable} ${wide.variable} ${sans.variable}`} data-type={type}>
      <header className="tp-bar">
        <a href="#top" className="tp-mark">RB</a>
        <nav aria-label="Sections">
          {NAV.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="tp-navlink">{s.title}</a>
          ))}
        </nav>
      </header>

      {/* Hero: the sunset is a real photo of Rohan's, set like a record sleeve beside the name */}
      <section id="top" className="tp-hero">
        <div className="tp-hero-text">
          <p className="tp-small">{site.location}</p>
          <h1 className="tp-name">
            Rohan<br />
            <span className="tp-name-2">Bharti</span>
          </h1>
          <div className="tp-hero-foot">
            <p className="tp-tagline">{site.tagline.replace(" | ", ", ")}.</p>
            <p className="tp-muted">{site.whatIBuild}</p>
            <p className="tp-status">
              {site.openTo} <a href={email.href} className="tp-link">{email.value}</a>
            </p>
          </div>
        </div>
        <figure className="tp-cover">
          <Image src={cover.src} alt={cover.alt} priority placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" />
          <figcaption className="tp-small">Photo by Rohan</figcaption>
        </figure>
      </section>

      <main>
        <section id="work" className="tp-section">
          <h2 className="tp-h2">Work</h2>
          <ol className="tp-work">
            {work.map((j) => (
              <li key={j.org}>
                <h3 className="tp-h3">{j.org}</h3>
                <p className="tp-meta">{j.role}<span className="tp-sep" />{j.dates}</p>
                <p className="tp-muted">{j.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="tp-section">
          <h2 className="tp-h2">Projects</h2>
          <ol className="tp-projects">
            {projects.map((p, i) => (
              <li key={p.id}>
                <span className="tp-idx">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="tp-h3">{p.name} <span className="tp-year">{p.year}</span></h3>
                  <p className="tp-muted">{p.summary}</p>
                  <p className="tp-meta">{p.stack.join(", ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="tp-section tp-edu">
          <h2 className="tp-h2">School</h2>
          <div>
            <h3 className="tp-h3">{education.school}</h3>
            <p className="tp-meta">{education.degree}<span className="tp-sep" />GPA {education.gpa}</p>
            <p className="tp-muted">{education.awards.join(". ")}.</p>
          </div>
        </section>

        <section id="photography" className="tp-section">
          <h2 className="tp-h2">Photography</h2>
          <div className="tp-photos">
            {rest.map((p) => (
              <Image key={p.id} src={p.src} alt={p.alt} placeholder="blur" sizes="(min-width: 768px) 40vw, 100vw" />
            ))}
          </div>
        </section>

        <section id="contact" className="tp-section tp-contact">
          <h2 className="tp-h2">Contact</h2>
          <div>
            <a href={email.href} className="tp-big-link">{email.value}</a>
            <p className="tp-others">
              {contact.filter((c) => c !== email).map((c) => (
                <a key={c.label} href={c.href} className="tp-link">{c.label}</a>
              ))}
            </p>
          </div>
        </section>
      </main>

      {/* Preview-only: compare display faces */}
      <nav aria-label="Display typeface" className="tp-switch">
        {(Object.keys(TYPE) as TypeKey[]).map((k) => (
          <a key={k} href={`?t=${k}`} aria-current={k === type ? "page" : undefined}>{TYPE[k]}</a>
        ))}
        <a href="/theme-preview">Latest &rarr;</a>
      </nav>
    </div>
  );
}
