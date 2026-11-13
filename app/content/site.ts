// Home-page copy that is not on the resume. Strings starting with "[NEEDED" are placeholders
// Rohan still has to supply; components render them visibly so they can't ship unnoticed.

export const site = {
  name: "Rohan Bharti",
  tagline: "Ex-IBM watsonx SDE | CS @ UC Irvine",
  /** What I build, in one line. Drafted from resume facts only. */
  whatIBuild: "I build data pipelines and ML systems, from agentic ETL at IBM to 2M+ brain cells at the Xu Lab.",
  /** Hidden while empty. One line on what you're building right now. */
  currentlyBuilding: "",
  about: {
    note: "[NEEDED: a short personal note, 2 to 4 sentences, in your own voice]",
  },
};

/**
 * Home-page sections, in page order. Shared by the hero index, the sticky header, the section labels
 * and the tissue map. `color` is each section's identity color from the data palette: it is the
 * section's cluster in the hero map and marks its index number everywhere else.
 */
export const sections = [
  { index: "01", title: "About", id: "about", color: "--data-4" },
  { index: "02", title: "Work", id: "work", color: "--data-2" },
  { index: "03", title: "Projects", id: "projects", color: "--data-5" },
  { index: "04", title: "Education", id: "education", color: "--data-8" },
  { index: "05", title: "Contact", id: "contact", color: "--data-1" },
] as const;

/** Inline style that exposes a section's color as `--section`, for classes like `text-(--section)`. */
export function sectionColor(id: string) {
  const s = sections.find((x) => x.id === id);
  return { "--section": s ? `var(${s.color})` : "var(--accent)" } as React.CSSProperties;
}

export function isNeeded(text: string) {
  return text.startsWith("[NEEDED");
}

/** The hero's section index carries this id; once it scrolls out of view, the sticky header takes over its job. */
export const SECTION_INDEX_ID = "section-index";
