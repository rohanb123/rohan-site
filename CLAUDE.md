@AGENTS.md

# Design rules

The site should feel dark, spacey and high-end, and must never distract from the content.

## Three layers
1. **Atmosphere (background).** The starfield. It should read as a star chart tied to the work, never generic blur or glow. Never brighter than ~15% luminance/opacity
   (`--atmosphere-max`). The only exception: ~1% of near stars may reach `--atmosphere-peak` (0.35)
   for depth. Stars are colored by real spectral class (`--star-b` … `--star-m`, blue-white to orange);
   because they stay under the atmosphere cap they are not a second accent. It sits behind everything and is purely ambient.
2. **Structure.** Low-contrast scaffolding: thin 1px lines (`--color-line`), small mono uppercase labels
   (`--color-fg-subtle`). Organizes the page without asking for attention.
3. **Content.** High-contrast off-white text (`--color-fg`) and the accent. This is the only layer that
   should draw the eye.

## Color
- Base is near-black with a slight blue cast: `#05060A` (`--color-bg`).
- Text is off-white, never pure `#fff`.
- All text must meet WCAG AA: 4.5:1 for small text. `--color-fg-subtle` is the dimmest allowed text color (5.5:1); never lower its opacity.
- Exactly ONE accent color (`--color-accent`, currently warm amber #F0A35E). Use it sparingly: a link, a focus ring, a real status.
- Titles (orgs, projects, school) use `--color-fg-heading`, off-white with a faint accent tint. Body copy never takes the accent.
  Changing it is a one-line edit in `app/globals.css`. Derive tints with `color-mix()`, never add a second hue.

## Type
- Instrument Serif for display: name and headings only (`font-display`), weight 400, large.
  Chosen because it echoes the type of old celestial atlases, which matches the star-chart background.
- IBM Plex Sans for body (`font-sans`), weight 400. 500 only for small UI emphasis, never body text.
- JetBrains Mono for labels and metadata (`font-mono`), small and tracked out.

## Motion
- Motion only in the hero and in response to interaction (hover, focus, pointer). No scroll-jacking,
  no ambient animation elsewhere.
- Always respect `prefers-reduced-motion`: animations collapse to a static final state.
- The starfield renders a static frame on reduced motion and on mobile/coarse pointers.

## Tokens
- All colors, fonts, spacing and glow values live as CSS variables in `app/globals.css` (`:root`),
  and are exposed to Tailwind via `@theme inline`. Don't hardcode hex values or magic spacing in components.

## Code
- One component per file in `app/components/`.
- Keep client components (`"use client"`) to what genuinely needs the browser (e.g. the canvas).

## Anti-slop rules (avoid unchosen defaults)

Never ship an unchosen default. Every design choice must be justified by my content.

Typography
- Do not use Inter, Roboto, Arial, system fonts, or Space Grotesk as the primary typeface.
- Use a deliberately chosen display + body pairing with strong contrast in size/weight. Body weight 400; no semibold body text.

Color & background
- No purple/indigo/violet-blue gradients. No gradient-clipped text. No aurora or mesh-blob backgrounds.
- One accent color, defined as a token with a semantic name (not gradient-start/end). No neon glow unless I request it.
- Background atmosphere must be tied to my work (star chart, atlas, telemetry), never generic blur or glow.

Layout & components
- No "centered hero + three equal feature cards" skeleton. No four-card icon grids.
- Vary radius by role (e.g. 0 for media, small for inputs, larger only for pills). No rounded-2xl shadow-lg on everything.
- No colored left-border cards. No nested cards. No glassmorphism except at most one floating element (nav).
- No emoji as icons. One icon set, or none; label icons with text.
- No pill badges above headlines. No pulsing "Live/New" dots unless it reflects real status.
- Left-align body text; use asymmetry and a clear grid.

Motion
- Motion only in the hero and meaningful interactions. No fade-in on every element, no infinite decorative loops.
- Hover/click states must communicate state (focus, pressed, loading). Respect prefers-reduced-motion.

Copy & content
- No filler headlines ("Build the future of…"), no buzzwords, no em-dash overuse.
- Use real project names, real numbers, and real links only. No placeholder stats or fake dashboards.

Quality
- Mobile-first at 320px with no horizontal scroll. Proper titles, meta descriptions, OG image, alt text, contrast, and keyboard focus.

Process
- Before finalizing a page, list which of the above you checked and which design decisions were deliberate. If a default slipped in, replace it and say so.
- When I ask for a new section, propose 2 distinct directions before building, and vary away from the most common one.
