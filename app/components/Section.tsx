import { sections, type SectionId } from "../content/site";

/**
 * A home-page section on the shared two-column grid: a small wide label on the left, content on the right,
 * so every section starts on the same two lines. On phones the label sits above the content.
 */
export default function Section({
  id,
  as: Tag = "section",
  className = "",
  children,
}: {
  id: SectionId;
  as?: "section" | "footer";
  className?: string;
  children: React.ReactNode;
}) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <Tag
      aria-labelledby={id}
      className={`mx-auto grid w-full max-w-wide gap-5 px-gutter pt-section min-[900px]:grid-cols-[var(--label-col)_minmax(0,1fr)] min-[900px]:gap-0 ${className}`}
    >
      <h2
        id={id}
        className="font-display text-[0.8125rem] font-normal tracking-[0.08em] text-fg-subtle uppercase min-[900px]:pt-1"
      >
        {s.title}
      </h2>
      <div>{children}</div>
    </Tag>
  );
}
