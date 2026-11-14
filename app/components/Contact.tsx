import { contact } from "../content/resume";
import SectionLabel from "./SectionLabel";

export default function Contact() {
  return (
    <footer data-below-fold aria-labelledby="contact" className="mx-auto w-full max-w-6xl px-gutter pt-section pb-16">
      <SectionLabel id="contact" />
      <ul>
        {contact.map((c) => (
          <li key={c.label} className="border-b border-line">
            <a
              href={c.href}
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[13rem_1fr_auto] md:gap-12"
            >
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">{c.label}</span>
              <span className="truncate text-fg-muted transition-colors duration-200 group-hover:text-fg">
                {c.value}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-xs text-fg-subtle transition-colors duration-200 group-hover:text-accent"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
