import { sectionColor } from "../content/site";

/** Structure layer: numbered mono label followed by a hairline rule. The number takes the section's color. */
export default function SectionLabel({ index, title, id }: { index: string; title: string; id?: string }) {
  return (
    <h2
      id={id}
      style={id ? sectionColor(id) : undefined}
      className="mb-12 flex items-center gap-4 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-fg-subtle"
    >
      <span>
        <span className="text-(--section)">{index}</span> / {title}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </h2>
  );
}
