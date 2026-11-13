import { SECTION_INDEX_ID, sectionColor, sections, site } from "../content/site";
import Copy from "./Copy";
import TissueMap from "./TissueMap";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto flex min-h-[86svh] w-full max-w-6xl flex-col overflow-x-clip px-gutter pb-10">
      <div className="flex flex-1 flex-col justify-center gap-10 pt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-12">
        {/* One entrance for the whole text block, not a fade per element */}
        <div className="hero-rise">
          {/* Structure layer: a thin rule with a small mono label */}
          <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
            <span>00 / Index</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Content layer */}
          <h1 className="font-display text-6xl leading-[0.95] tracking-[-0.01em] text-fg sm:text-8xl lg:text-[6.25rem] xl:text-[7rem]">
            {site.name}
          </h1>
          <p className="mt-5 max-w-measure text-lg leading-relaxed text-fg-muted sm:text-xl">
            {site.tagline}
          </p>
          <p className="mt-3 max-w-measure leading-relaxed text-fg">
            {site.whatIBuild}
          </p>
          {/* Hidden until there's a line to show, so it leaves no gap */}
          {site.currentlyBuilding && (
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">
                Currently building
              </span>
              <span className="text-fg-muted">
                <Copy text={site.currentlyBuilding} />
              </span>
            </p>
          )}
        </div>

        {/* Signature visual: synthetic tissue map, one cluster per section (has its own intro) */}
        <div className="aspect-square w-full max-w-[30rem] self-center lg:max-w-none">
          <TissueMap />
        </div>
      </div>

      {/* The index itself: real navigation that also signals there is more below */}
      <nav
        id={SECTION_INDEX_ID}
        aria-label="Section index"
        className="hero-rise border-t border-line pt-5"
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] sm:flex sm:gap-10">
          {sections.map((s) => (
            <li key={s.id} style={sectionColor(s.id)}>
              <a
                href={`#${s.id}`}
                className="group inline-flex gap-3 py-1 text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                <span className="text-(--section)">
                  {s.index}
                </span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
