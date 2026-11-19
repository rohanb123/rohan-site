// Home-page copy that is not on the resume. Strings starting with "[NEEDED" are placeholders
// Rohan still has to supply; components render them visibly so they can't ship unnoticed.

export const site = {
  name: "Rohan Bharti",
  tagline: "Ex-IBM watsonx SDE Intern | CS @ UC Irvine",
  /** One line under the tagline. */
  whatIBuild: "Experience in AI, ML, embedded, backend and systems engineering.",
  /** Hidden while empty. One line on what you're building right now. */
  currentlyBuilding: "",
  /** Hidden while empty. Availability line in the hero. */
  openTo: "Open to internships, part-time or full-time, any term.",
  location: "San Francisco / Irvine",
};

/** Home-page sections, in page order. Shared by the header nav and the section labels. */
export const sections = [
  { title: "Work", id: "work" },
  { title: "Projects", id: "projects" },
  { title: "School", id: "education" },
  { title: "Photography", id: "photography" },
  { title: "Contact", id: "contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function isNeeded(text: string) {
  return text.startsWith("[NEEDED");
}
