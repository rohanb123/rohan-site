// Home-page copy that is not on the resume. Strings starting with "[NEEDED" are placeholders
// Rohan still has to supply; components render them visibly so they can't ship unnoticed.

export const site = {
  name: "Rohan Bharti",
  tagline: "Ex-IBM watsonx SDE | CS @ UC Irvine",
  /** What I build, in one line. Drafted from resume facts only. */
  whatIBuild: "I build data pipelines and ML systems, from agentic ETL at IBM to 2M+ brain cells at the Xu Lab.",
  currentlyBuilding: "[NEEDED: one line on what you're building right now]",
  about: {
    note: "[NEEDED: a short personal note, 2 to 4 sentences, in your own voice]",
  },
};

/** Home-page sections, in page order. Shared by the hero index nav and the tissue map. */
export const sections = [
  { index: "01", title: "About", id: "about" },
  { index: "02", title: "Work", id: "work" },
  { index: "03", title: "Projects", id: "projects" },
  { index: "04", title: "Education", id: "education" },
  { index: "05", title: "Contact", id: "contact" },
] as const;

export function isNeeded(text: string) {
  return text.startsWith("[NEEDED");
}
