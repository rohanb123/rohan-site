import Image from "next/image";
import { showcase } from "../content/photography";
import { contact } from "../content/resume";
import { site } from "../content/site";
import Copy from "./Copy";
import SocialIcon from "./SocialIcon";

/**
 * Full-bleed hero on Rohan's towers photo: the sliver of sunset light falls toward the name. The photo runs
 * to the top edge under the see-through bar and fades into the page at the bottom (.hero-shade).
 */
export default function Hero() {
  const towers = showcase.find((p) => p.id === "port1-5")!;
  const email = contact.find((c) => c.label === "Email")!;
  const profiles = contact.filter((c) => c.icon);

  return (
    <section id="top" className="relative isolate flex min-h-svh items-end pt-bar pb-[clamp(2.5rem,6vh,4rem)]">
      <Image
        src={towers.src}
        alt={towers.alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[42%_20%] brightness-[0.74]"
      />
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-wide px-gutter">
        <h1 className="font-display text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.9] font-light tracking-[-0.035em] uppercase">
          Rohan
          <br />
          <span className="name-gradient">Bharti</span>
        </h1>

        <div className="mt-10 grid max-w-[62rem] gap-x-12 gap-y-5 md:grid-cols-[1.2fr_1fr]">
          <div className="grid content-start gap-1.5">
            {/* Each half stays whole, so a narrow screen breaks the line at the comma */}
            <p className="text-[1.1875rem]">
              {site.tagline.split(" | ").map((part, i) => (
                <span key={part}>
                  {i > 0 && ", "}
                  <span className="whitespace-nowrap">{part}</span>
                </span>
              ))}
              .
            </p>
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
              <a href={email.href} className="text-link">{email.value}</a>
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
