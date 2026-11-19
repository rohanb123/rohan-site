import logo from "../../assets/logo.png";
import { contact } from "../content/resume";
import { sections } from "../content/site";
import MobileMenu from "./MobileMenu";
import SocialIcon from "./SocialIcon";

/**
 * Fixed top bar: the site mark, the section links and the profile icons, so GitHub and LinkedIn are one click
 * away from the first screen. It floats over the hero photo and fills in as you scroll (.site-bar, pure CSS).
 * On phones the section links fold into a "Menu" button (MobileMenu) beside the icons.
 */
export default function Header() {
  const profiles = contact.filter((c) => c.icon);
  return (
    <header className="site-bar fixed inset-x-0 top-0 z-40 flex h-bar items-center justify-between px-gutter">
      {/* Same mark as the favicon */}
      <a href="#top" aria-label="Back to top" title="Back to top" className="-my-2 py-2 opacity-90 transition-opacity duration-150 hover:opacity-100">
        <span
          aria-hidden="true"
          className="site-mark-glyph block size-7"
          style={{ maskImage: `url(${logo.src})`, WebkitMaskImage: `url(${logo.src})` }}
        />
      </a>

      <div className="flex items-center gap-4">
        <nav aria-label="Sections" className="max-sm:hidden">
          <ul className="flex gap-[clamp(1rem,2.5vw,2rem)] text-[0.9375rem]">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="border-b border-transparent text-fg-muted transition-colors duration-150 hover:border-accent hover:text-fg"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MobileMenu />
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-fg/25" />
        <ul aria-label="Profiles" className="-mr-1.5 flex items-center gap-1">
          {profiles.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.label} (opens in a new tab)`}
                title={c.label}
                className="flex size-9 items-center justify-center text-fg-muted transition-colors duration-150 hover:text-fg"
              >
                <SocialIcon name={c.icon!} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
