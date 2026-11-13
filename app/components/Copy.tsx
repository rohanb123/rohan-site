import { isNeeded } from "../content/site";

/**
 * Renders a content string. "[NEEDED: ...]" placeholders are shown in an unmistakable
 * dashed amber box so missing copy is visible on the page and can't ship unnoticed.
 */
export default function Copy({ text }: { text: string }) {
  if (!isNeeded(text)) return <>{text}</>;
  return (
    <span className="inline-block border border-dashed border-accent-2/60 px-2 py-0.5 font-mono text-[0.75rem] leading-relaxed text-accent-2">
      {text}
    </span>
  );
}
