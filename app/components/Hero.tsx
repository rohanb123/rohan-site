const sections = [
  { index: "01", title: "Work", href: "#work" },
  { index: "02", title: "Projects", href: "#projects" },
  { index: "03", title: "Education", href: "#education" },
  { index: "04", title: "Contact", href: "#contact" },
];

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[86svh] w-full max-w-6xl flex-col px-gutter pb-10">
      {/* One entrance for the whole block, not a fade per element */}
      <div className="hero-rise flex flex-1 flex-col justify-center pt-24">
        {/* Structure layer: a thin rule with a small mono label */}
        <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
          <span>00 / Index</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* Content layer */}
        <h1 className="font-display text-6xl leading-[0.95] tracking-[-0.01em] text-fg sm:text-8xl lg:text-[7rem]">
          Rohan Bharti
        </h1>
        <p className="mt-5 max-w-measure text-lg leading-relaxed text-fg-muted sm:text-xl">
          Ex-IBM watsonx SDE | CS @ UC Irvine
        </p>
      </div>

      {/* The index itself: real navigation that also signals there is more below */}
      <nav aria-label="Sections" className="hero-rise border-t border-line pt-5">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] sm:flex sm:gap-10">
          {sections.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="group inline-flex gap-3 py-1 text-fg-muted transition-colors duration-200 hover:text-fg">
                <span className="text-fg-subtle transition-colors duration-200 group-hover:text-accent">{s.index}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
