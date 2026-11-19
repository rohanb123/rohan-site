// THROWAWAY: theme exploration, iteration 4 (latest). Earlier iterations are saved at /theme-preview/v2 and /v3.
import type { Metadata } from "next";
import Image from "next/image";
import { Archivo, Schibsted_Grotesk } from "next/font/google";
import logo from "../../assets/logo.png";
import SocialIcon from "../components/SocialIcon";
import { showcase } from "../content/photography";
import { contact, education, projects, work } from "../content/resume";
import { site } from "../content/site";
import "./preview.css";

const wide = Archivo({ variable: "--tp-wide", subsets: ["latin"], axes: ["wdth"] });
const sans = Schibsted_Grotesk({ variable: "--tp-sans", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = { title: "Theme preview v4", robots: { index: false } };

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
  const socials = contact.filter((c) => c.icon);
  // Newest first, like Work. The sort is stable, so same-year projects keep their resume order.
  const byYear = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className={`tp ${wide.variable} ${sans.variable}`}>
      <header className="tp-bar">
        {/* Same mark as the favicon; the PNG is a mask so it takes the text color */}
        <a href="#top" aria-label="Back to top" className="tp-mark">
          <span aria-hidden className="tp-mark-glyph" style={{ maskImage: `url(${logo.src})`, WebkitMaskImage: `url(${logo.src})` }} />
        </a>
        <div className="tp-bar-right">
          <nav aria-label="Sections">
            {NAV.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="tp-navlink">{s.title}</a>
            ))}
          </nav>
          <span aria-hidden className="tp-bar-div" />
          {socials.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.label} (opens in a new tab)`} title={c.label} className="tp-icon">
              <SocialIcon name={c.icon!} />
            </a>
          ))}
        </div>
      </header>

      {/* Hero runs to the very top: the bar floats over the photo instead of cutting it off */}
      <section id="top" className="tp-hero">
        <Image src={towers.src} alt={towers.alt} fill priority placeholder="blur" sizes="100vw" className="tp-hero-img" />
        <p className="tp-credit">Photo by Rohan</p>
        <div className="tp-wrap tp-hero-content">
          <h1 className="tp-name">
            Rohan<br />
            {/* Colors picked from the towers photo: the glow at the edge of the light, the rose windows, lavender */}
            <span className="tp-name-2">Bharti</span>
          </h1>
          <div className="tp-hero-row">
            <div>
              <p className="tp-tagline">{site.tagline.replace(" | ", ", ")}.</p>
              <p className="tp-muted">{site.whatIBuild}</p>
            </div>
            <div>
              <p className="tp-muted">{site.openTo}</p>
              <p className="tp-hero-links">
                <a href={email.href} className="tp-link">{email.value}</a>
                {socials.map((c) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="tp-link tp-link-icon">
                    <SocialIcon name={c.icon!} />
                    {c.label}
                  </a>
                ))}
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
          {/* 2x2: a table split into quadrants by thin rules, not cards */}
          <ol className="tp-grid">
            {byYear.map((p) => (
              <li key={p.id}>
                <div className="tp-grid-head">
                  <h3 className="tp-h3">{p.name}</h3>
                  <span className="tp-subtle tp-num">{p.year}</span>
                </div>
                <p className="tp-muted">{p.summary}</p>
                <p className="tp-subtle tp-stack">{p.stack.join(", ")}</p>
              </li>
            ))}
          </ol>
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
              {socials.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="tp-link tp-link-icon">
                  <SocialIcon name={c.icon!} />
                  {c.label}
                </a>
              ))}
            </p>
          </div>
        </section>
      </main>

      <nav aria-label="Iteration" className="tp-switch">
        <a href="/theme-preview/v2">v2</a>
        <a href="/theme-preview/v3">v3</a>
        <a href="/theme-preview" aria-current="page">v4</a>
      </nav>
    </div>
  );
}
