"use client";

import { useEffect } from "react";

/**
 * Lowkey: the band of peach light in the last name's gradient drifts with the pointer across the hero (damped),
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
      // Damped: the pointer's position across the whole window (not the word) moves the light from the left edge
      // of the word (u = 0) only part of the way across (u = RANGE), so it drifts rather than tracks.
      const RANGE = 0.55;
      const u = (clientX / window.innerWidth) * RANGE;
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
