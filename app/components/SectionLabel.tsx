/** Structure layer: numbered mono label followed by a hairline rule. */
export default function SectionLabel({ index, title, id }: { index: string; title: string; id?: string }) {
  return (
    <h2
      id={id}
      className="mb-12 flex items-center gap-4 font-mono text-[0.6875rem] font-normal uppercase tracking-[0.2em] text-fg-subtle"
    >
      <span>
        {index} / {title}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </h2>
  );
}
