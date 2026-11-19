import Image from "next/image";
import { scenes } from "../content/photography";
import { contact } from "../content/resume";
import { site } from "../content/site";
import Copy from "./Copy";
import CopyEmail from "./CopyEmail";
import HeroLight from "./HeroLight";
import LocalTime from "./LocalTime";
import SceneSwitch from "./SceneSwitch";
import SocialIcon from "./SocialIcon";

/**
 * Full-bleed hero on Rohan's towers photo: the sliver of sunset light falls toward the name. The photo runs
 * to the top edge under the see-through bar and fades into the page at the bottom (.hero-shade).
 * SceneSwitch swaps the photo and its palette: every scene photo is stacked here and CSS shows the chosen one
 * (opening once on load, crossfading on a switch).
 * On load the photo opens out from the strip of light (.hero-open) and the name settles in (.hero-settle).
 */
export default function Hero() {
  const email = contact.find((c) => c.label === "Email")!;
  const profiles = contact.filter((c) => c.icon);

  return (
    <section id="top" className="relative isolate flex min-h-svh items-end pt-bar pb-[clamp(2.5rem,6vh,4rem)]">
      {scenes.map((s, i) => (
        <Image
          key={s.id}
          data-scene-photo={s.id}
          src={s.photo.src}
          alt={s.photo.alt}
          fill
          priority={i === 0}
          placeholder="blur"
          sizes="100vw"
          className={`hero-open -z-20 object-cover ${s.position} ${s.brightness}`}
        />
      ))}
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
      <HeroLight targetId="top" />
      {/* Top right, under the bar's profile icons, like a caption on the photo */}
      <div className="absolute inset-x-0 top-[calc(var(--bar-h)+0.75rem)]">
        <div className="mx-auto flex max-w-wide justify-end px-gutter">
          <SceneSwitch />
        </div>
      </div>

      <div className="mx-auto w-full max-w-wide px-gutter">
        {/* Where Rohan is and what time it is there: small, in the same voice as the section labels */}
        <p className="mb-5 font-display text-[0.8125rem] tracking-[0.08em] text-fg/85 uppercase">
          Based in <span className="whitespace-nowrap">{site.location}</span>
          <LocalTime />
        </p>
        <h1 className="hero-settle font-display text-[clamp(2.25rem,6.5vw,5.5rem)] leading-[0.92] font-light tracking-[-0.03em] uppercase">
          Rohan
          <br />
          <span className="name-gradient">Bharti</span>
        </h1>

        {/* The tagline gets its own full-width line, sized to be read right after the name.
            Each half stays whole, so a narrow screen breaks the line at the comma */}
        <p className="mt-7 max-w-[62rem] text-[clamp(1.375rem,2.8vw,2.375rem)] leading-[1.2] tracking-[-0.01em]">
          {site.tagline.split(" | ").map((part, i) => (
            <span key={part}>
              {i > 0 && ", "}
              <span className="whitespace-nowrap">{part}</span>
            </span>
          ))}
          .
        </p>

        <div className="mt-6 grid max-w-[62rem] gap-x-12 gap-y-5 md:grid-cols-[1.2fr_1fr]">
          <div className="grid content-start gap-1.5">
            <p className="text-fg-muted">{site.whatIBuild}</p>
            {site.currentlyBuilding && (
              <p className="text-fg-muted">
                Currently building: <Copy text={site.currentlyBuilding} />
              </p>
            )}
          </div>
          <div className="grid content-start gap-1.5">
            {site.openTo && <p className="text-fg-muted">{site.openTo}</p>}
            <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <CopyEmail email={email.value} />
              {profiles.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2">
                  <SocialIcon name={c.icon!} />
                  {c.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
