"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Series } from "../content/photography";
import SectionLabel from "./SectionLabel";

/**
 * Photo series as justified rows: each row's photos share one height and fill the width, read left to right
 * (so sequences like p1–p3 stay together). Phones get one photo per row. Clicking a photo opens it full screen in a native <dialog>
 * (Esc closes, arrow keys step through every photo on the page). Media gets a square (0) radius.
 */
/** Split n photos into rows of at most 3, as evenly as possible (4 -> 2+2, 5 -> 3+2). */
function rowsOf<T>(items: T[]): T[][] {
  const count = Math.ceil(items.length / 3);
  const rows: T[][] = [];
  let i = 0;
  for (let r = 0; r < count; r++) {
    const size = Math.ceil((items.length - i) / (count - r));
    rows.push(items.slice(i, i + size));
    i += size;
  }
  return rows;
}

export default function Gallery({ series }: { series: Series[] }) {
  const photos = series.flatMap((s) => s.photos);
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = (i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  };
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      {series.map((s, si) => (
        <section key={s.id} aria-labelledby={s.id} className="pt-16 first:pt-0">
          <SectionLabel index={String(si + 1).padStart(2, "0")} title={s.title} id={s.id} />
          <div className="flex flex-col gap-2 sm:gap-3">
            {rowsOf(s.photos).map((row) => (
              <ul key={row[0].id} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                {row.map((p) => (
                  // Grow by aspect ratio: equal heights across the row, widths fill it exactly.
                  <li
                    key={p.id}
                    id={p.id}
                    style={{ "--ar": p.src.width / p.src.height } as React.CSSProperties}
                    className="min-w-0 sm:grow-(--ar) sm:basis-0"
                  >
                    <button
                      type="button"
                      onClick={() => show(photos.indexOf(p))}
                      aria-label={`Open photo: ${p.alt}`}
                      className="group block w-full cursor-zoom-in overflow-hidden bg-bg-raised"
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        placeholder="blur"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="w-full opacity-90 transition-[opacity,scale] duration-300 group-hover:scale-[1.015] group-hover:opacity-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      ))}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        // Clicking the backdrop (the dialog itself, not its content) closes it.
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        aria-label="Photo viewer"
        className="m-0 h-full max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-bg/80"
      >
        {current && (
          <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
            <div className="flex items-center justify-between px-gutter pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
              <span aria-live="polite">
                {String(open! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="px-2 py-3 uppercase text-fg-muted transition-colors duration-200 hover:text-accent"
              >
                Close · Esc
              </button>
            </div>
            <div
              className="relative min-h-0 flex-1 px-gutter py-4"
              onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
            >
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                placeholder="blur"
                quality={90}
                sizes="100vw"
                className="mx-auto h-full w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex justify-between px-gutter pb-5 font-mono text-[11px] uppercase tracking-[0.16em]">
              <button
                type="button"
                onClick={() => step(-1)}
                className="px-2 py-3 uppercase text-fg-muted transition-colors duration-200 hover:text-accent"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="px-2 py-3 uppercase text-fg-muted transition-colors duration-200 hover:text-accent"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
