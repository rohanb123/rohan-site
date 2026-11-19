"use client";

import { useSyncExternalStore } from "react";
import { scenes, type SceneId } from "../content/photography";

const KEY = "scene";
const DEFAULT: SceneId = scenes[0].id;

// The scene lives on <html data-scene> (set before paint by FIRST_VIEW_SCRIPT); this reads and writes it there.
function read(): SceneId {
  return (document.documentElement.dataset.scene as SceneId | undefined) ?? DEFAULT;
}
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });
  return () => mo.disconnect();
}
function choose(id: SceneId) {
  const html = document.documentElement;
  if (id === DEFAULT) delete html.dataset.scene;
  else html.dataset.scene = id;
  try {
    if (id === DEFAULT) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, id);
  } catch {}
}

/**
 * Small text switch in the hero: which of Rohan's photos sits behind the name. Each brings its own palette
 * (html[data-scene] in globals.css), so the whole page recolors with it. Remembered on this device.
 */
export default function SceneSwitch() {
  const current = useSyncExternalStore(subscribe, read, () => DEFAULT);
  return (
    <div role="group" aria-label="Hero photo" className="flex items-center gap-3 font-display text-[0.8125rem] tracking-[0.08em] uppercase">
      <span className="text-fg-muted">Photo</span>
      {scenes.map((s, i) => (
        <span key={s.id} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="text-fg-subtle">/</span>}
          <button
            type="button"
            aria-pressed={current === s.id}
            onClick={() => choose(s.id)}
            className={`border-b py-0.5 uppercase transition-colors duration-150 ${
              current === s.id ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        </span>
      ))}
    </div>
  );
}
