// SAVED: iteration 3, kept to compare against later versions.
import type { Metadata } from "next";
import Image from "next/image";
import { Archivo, Schibsted_Grotesk } from "next/font/google";
import { showcase } from "../../content/photography";
import { contact, education, projects, work } from "../../content/resume";
import { site } from "../../content/site";
import "./preview.css";

// Display: Archivo pushed wide on its width axis. Body: Schibsted Grotesk.
const wide = Archivo({ variable: "--tp-wide", subsets: ["latin"], axes: ["wdth"] });
const sans = Schibsted_Grotesk({ variable: "--tp-sans", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = { title: "Theme preview v3 (saved)", robots: { index: false } };

const NAV = [
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects" },
  { id: "school", title: "School" },
  { id: "photography", title: "Photography" },
  { id: "contact", title: "Contact" },
];

export default function ThemePreview() {
  const towers = showcase.find((p) => p.id === "port1-5")!;
  const others = showcase.filter((p) => p !== towers);
  const email = contact.find((c) => c.label === "Email")!;

  return (
    <div className={`tp ${wide.variable} ${sans.variable}`}>
      <header className="tp-bar">
        <a href="#top" className="tp-mark">RB</a>
        <nav aria-label="Sections">
          {NAV.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="tp-navlink">{s.title}</a>
          ))}
        </nav>
      </header>

      {/* Hero: the towers photo full-bleed; the sliver of sunset falls toward the name */}
      <section id="top" className="tp-hero">
        <Image
          src={towers.src}
          alt={towers.alt}
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="tp-hero-img"
        />
        <p className="tp-credit">Photo by Rohan</p>
        <div className="tp-wrap tp-hero-content">
          <h1 className="tp-name">
            Rohan<br />
            <span className="tp-name-2">Bharti</span>
          </h1>
          <div className="tp-hero-row">
            <div>
              <p className="tp-tagline">{site.tagline.replace(" | ", ", ")}.</p>
              <p className="tp-muted">{site.whatIBuild}</p>
            </div>
            <div>
              <p className="tp-muted">{site.openTo}</p>
              <p>
                <a href={email.href} className="tp-link">{email.value}</a>
                <span className="tp-sep" />
                <span className="tp-subtle">{site.location}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section id="work" className="tp-wrap tp-section">
          <h2 className="tp-label">Work</h2>
          <ol className="tp-work">
            {work.map((j) => (
              <li key={j.org}>
                <p className="tp-subtle tp-dates">{j.dates}</p>
                <div>
                  <h3 className="tp-h3">{j.org}</h3>
                  <p className="tp-subtle">{j.role}{j.team && <>, {j.team}</>}</p>
                </div>
                <p className="tp-muted">{j.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="tp-wrap tp-section">
          <h2 className="tp-label">Projects</h2>
          <table className="tp-table">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Project</th>
                <th scope="col">What it is</th>
                <th scope="col">Built with</th>
                <th scope="col">Year</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id}>
                  <td className="tp-subtle tp-num">{String(i + 1).padStart(2, "0")}</td>
                  <th scope="row" className="tp-h3">{p.name}</th>
                  <td className="tp-muted">{p.summary}</td>
                  <td className="tp-subtle">{p.stack.join(", ")}</td>
                  <td className="tp-year">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="school" className="tp-wrap tp-section">
          <h2 className="tp-label">School</h2>
          <div className="tp-school">
            <div>
              <h3 className="tp-h3">{education.school}</h3>
              <p className="tp-subtle">{education.degree}<span className="tp-sep" />GPA {education.gpa}</p>
            </div>
            <dl>
              <dt className="tp-subtle">Concentrations</dt>
              <dd>{education.focus.join(", ")}</dd>
              <dt className="tp-subtle">Honors</dt>
              <dd className="tp-muted">
                {education.awards.map((a) => <span key={a} className="tp-line">{a}</span>)}
              </dd>
            </dl>
          </div>
        </section>

        <section id="photography" className="tp-wrap tp-section">
          <h2 className="tp-label">Photography</h2>
          <div className="tp-photos">
            {others.map((p) => (
              <Image key={p.id} src={p.src} alt={p.alt} placeholder="blur" sizes="(min-width: 768px) 40vw, 100vw" />
            ))}
          </div>
        </section>

        <section id="contact" className="tp-wrap tp-section tp-contact">
          <h2 className="tp-label">Contact</h2>
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

      {/* Preview-only: jump between saved iterations (plain links, full reloads) */}
      <nav aria-label="Iteration" className="tp-switch">
        <a href="/theme-preview/v2">v2 (saved)</a>
        <a href="/theme-preview/v3" aria-current="page">v3 (saved)</a>
        <a href="/theme-preview">Latest &rarr;</a>
      </nav>
    </div>
  );
}
