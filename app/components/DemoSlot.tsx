import type { CaseStudy } from "../content/case-studies";
import Copy from "./Copy";

/** Live demo or video, shown first on a case study. Media gets a square (0) radius. */
export default function DemoSlot({ demo, title }: { demo: CaseStudy["demo"]; title: string }) {
  if (demo?.kind === "video") {
    return (
      <video
        className="aspect-video w-full border border-line bg-bg-raised"
        src={demo.src}
        poster={demo.poster}
        controls
        preload="metadata"
        aria-label={`${title} demo video`}
      />
    );
  }

  if (demo?.kind === "link") {
    return (
      <a
        href={demo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-video w-full items-center justify-center border border-line bg-bg-raised font-mono text-[12px] uppercase tracking-[0.16em] text-accent transition-colors duration-200 hover:border-accent"
      >
        {demo.label} ↗
      </a>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-line-strong bg-bg-raised/60 p-6 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">Demo</span>
      <Copy text="[NEEDED: live demo URL or a 30 to 90 second video]" />
    </div>
  );
}
