"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "../content/site";

/**
 * Phones only: a plain "Menu" text button in the bar that drops down the section links. Closes on a link tap,
 * Escape, a tap outside, or when the screen widens past the phone breakpoint (the full nav takes over there).
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 40rem)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <div ref={root} className="sm:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className={`border-b py-1 text-[0.9375rem] transition-colors duration-150 ${
          open ? "border-accent text-fg" : "border-transparent text-fg-muted"
        }`}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Sits behind the bar's content (inside the bar's stacking context) and starts at the very top, so the
          see-through bar reads as solid while the menu is open */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-0 -z-10 border-b border-rule bg-bg px-gutter pt-bar pb-4"
      >
        <nav aria-label="Sections">
          <ul>
            {sections.map((s) => (
              <li key={s.id} className="border-t border-rule">
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 font-display text-lg tracking-[-0.01em] text-fg transition-colors duration-150 active:text-accent"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
