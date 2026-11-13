import { contact } from "../content/resume";
import SocialIcon from "./SocialIcon";

/** Top bar: profile links as icons. Sits over the hero's top padding, so it doesn't shift the layout. */
export default function Header() {
  const links = contact.filter((c) => c.icon);
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <nav aria-label="Profiles" className="mx-auto flex w-full max-w-6xl justify-end px-gutter pt-6">
        <ul className="-mr-2 flex items-center gap-1">
          {links.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.label} (opens in a new tab)`}
                title={c.label}
                className="flex size-10 items-center justify-center text-fg-muted transition-colors duration-200 hover:text-accent"
              >
                <SocialIcon name={c.icon!} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
