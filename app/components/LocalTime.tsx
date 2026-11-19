"use client";

import { useSyncExternalStore } from "react";

// San Francisco and Irvine share Pacific time
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}
const now = () => fmt.format(new Date()).toLowerCase();

/** Rohan's local time after an em dash, e.g. " — 4:12 pm PT". Empty on the server, so the static page never shows a stale time. */
export default function LocalTime() {
  const time = useSyncExternalStore(subscribe, now, () => "");
  if (!time) return null;
  return (
    <>
      {" "}
      <span aria-hidden="true">—</span>{" "}
      <span className="sr-only">, local time </span>
      <time className="whitespace-nowrap">{time} PT</time>
    </>
  );
}
