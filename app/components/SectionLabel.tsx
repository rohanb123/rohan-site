import { sections } from "../content/site";

/** Structure layer: numbered mono label followed by a hairline rule. Number and title come from `sections`. */
export default function SectionLabel({ id }: { id: (typeof sections)[number]["id"] }) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <h2
      id={id}
      className="mb-12 flex items-center gap-4 font-mono text-label font-normal uppercase tracking-[0.2em] text-fg-subtle"
    >
      <span>
        {s.index} / {s.title}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </h2>
  );
}
