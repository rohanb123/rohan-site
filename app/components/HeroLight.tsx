"use client";

import { useEffect } from "react";

/**
 * Lowkey: the band of peach light in the last name's gradient follows the pointer horizontally across the hero,
 * like the glow at the edge of the gap in the photo. Sets background-position on the word itself (Safari won't
 * repaint clipped text when an inherited variable changes); .name-gradient eases toward it and stays put when
 * the pointer stops. Off for touch and reduced motion. Renders nothing.
 */
export default function HeroLight({ targetId }: { targetId: string }) {
  useEffect(() => {
    const hero = document.getElementById(targetId);
    const word = hero?.querySelector<HTMLElement>(".name-gradient");
    if (!hero || !word) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    let clientX = 0;
    const apply = () => {
      frame = 0;
      const r = word.getBoundingClientRect();
      // u: pointer position across the word (0 = left edge, 1 = right edge), allowed a little past either end.
      const u = Math.min(1.2, Math.max(-0.2, (clientX - r.left) / r.width));
      // The gradient is 2.5x the word, with the light at its middle. Background-position p puts the light at
      // u = 1.25 - 1.5p, so p = (1.25 - u) / 1.5.
      word.style.backgroundPosition = `${((1.25 - u) / 1.5) * 100}% 0`;
    };
    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
    };
  }, [targetId]);

  return null;
}
