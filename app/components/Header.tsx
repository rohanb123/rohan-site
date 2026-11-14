"use client";

import { useEffect, useState } from "react";
import { contact } from "../content/resume";
import { SECTION_INDEX_ID, sectionColor, sections } from "../content/site";
import SocialIcon from "./SocialIcon";

/**
 * Fixed top bar. At the top of the page it shows only the profile icons, floating over the hero.
 * Past the hero's section index it gains a background and the section links, with the current one marked.
 */
export default function Header() {
  const [docked, setDocked] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const index = document.getElementById(SECTION_INDEX_ID);
    if (!index) return;
    // Docked once the index's bottom edge has passed under the top of the viewport.
    const io = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(index);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // Current section = the last heading that has crossed below the header.
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      // At the very bottom, the last section is current even if its heading can't reach the top.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const links = contact.filter((c) => c.icon);
  const current = sections.find((s) => s.id === active);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 border-b transition-[background-color,border-color] duration-300 ${
        docked ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-gutter">
        {/* Section links: hidden (and out of the tab order) until the hero's own index has scrolled away */}
        <nav
          aria-label="Sections"
          inert={!docked}
          className={`min-w-0 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-opacity duration-300 ${
            docked ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Narrow screens: just the current section, linking back to the top */}
          <a href="#top" style={current ? sectionColor(current.id) : undefined} className="flex gap-3 py-2 text-fg-muted transition-colors duration-200 hover:text-fg sm:hidden">
            <span className="text-(--section)">{current?.index ?? "00"}</span>
            {current?.title ?? "About"}
          </a>
          <ol className="hidden gap-8 sm:flex">
            {sections.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id} style={sectionColor(s.id)}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? "location" : undefined}
                    className={`group inline-flex gap-3 py-2 transition-colors duration-200 hover:text-fg ${
                      on ? "text-fg" : "text-fg-muted"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-200 group-hover:text-(--section) ${
                        on ? "text-(--section)" : "text-fg-subtle"
                      }`}
                    >
                      {s.index}
                    </span>
                    {s.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <ul aria-label="Profiles" className="-mr-2 flex shrink-0 items-center gap-1">
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
      </div>
    </header>
  );
}
