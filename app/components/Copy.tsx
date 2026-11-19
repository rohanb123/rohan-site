import { isNeeded } from "../content/site";

/**
 * Renders a content string. "[NEEDED: ...]" placeholders are shown in an unmistakable
 * dashed box so missing copy is visible on the page and can't ship unnoticed.
 */
export default function Copy({ text }: { text: string }) {
  if (!isNeeded(text)) return <>{text}</>;
  return (
    <span className="inline-block border border-dashed border-accent/60 px-2 py-0.5 text-[0.875rem] leading-relaxed text-accent">
      {text}
    </span>
  );
}
