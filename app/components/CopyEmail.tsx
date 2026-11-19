"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The email link. A plain click copies the address and shows "Copied" in its place for a moment; modifier-clicks, no clipboard
 * access, or a failed copy fall through to the normal mailto link.
 */
export default function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const href = `mailto:${email}`;
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1800);
      },
      () => {
        window.location.href = href;
      },
    );
  };

  return (
    <a href={href} onClick={onClick} title="Click to copy" className={`text-link relative inline-block ${className}`}>
      {/* While copied, the address hides and "Copied" takes its exact spot, so nothing shifts */}
      <span className={`transition-opacity duration-200 ${copied ? "opacity-0" : "opacity-100"}`}>{email}</span>
      <span
        aria-live="polite"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}
      >
        {copied ? "Copied" : ""}
      </span>
    </a>
  );
}
