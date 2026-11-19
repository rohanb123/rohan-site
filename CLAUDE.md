@AGENTS.md

# Design rules

The site should feel dark, warm and art-directed, like a record sleeve built around Rohan's own photographs.
Restrained, never sweet or cute, and it must never distract from the content.

## Direction
- The atmosphere is Rohan's photography, not CSS effects. The hero is his towers photo (the sliver of sunset
  light between two buildings), full-bleed, slightly darkened, fading into the page at the bottom.
- Lavender and sunset come from the photos: the palette is sampled from them, not invented.
- Rejected on purpose (Rohan's feedback): pill buttons, colored dots before labels, bouncy/spring hovers,
  rounded raised cards, soft "plush" serifs (Fraunces), posterized CSS sunset bands, the starfield and the
  tissue map. Don't bring them back.

## Layers
1. **Atmosphere.** The hero photo only. No background effects elsewhere except a faint film grain
   (`body::after`, 6% overlay) that matches the grain in the photos.
2. **Structure.** Small wide uppercase section labels (`--color-fg-subtle`) in a left column, and thin
   lavender-tinted rules (`--color-rule`). Every section uses the same two columns (`Section.tsx`,
   `--label-col`), so content always starts on the same line.
3. **Content.** Off-white text (`--color-fg`), the lavender accent and the name gradient. The only layer
   that should draw the eye.

## Color
- Base is violet-black `#0E0C11` (`--color-bg`), not neutral black.
- Text is warm off-white `#ECE4E3`, never pure `#fff`.
- All text must meet WCAG AA: 4.5:1 for small text. `--color-fg-subtle` is the dimmest allowed text color (5.2:1).
- One accent: lavender `--color-accent` (#B9A7E6) for links, hover, focus. No secondary accent; the orange
  accent was removed at Rohan's request. Years and dates stay `--color-fg-subtle`.
- The name gradient (`--name-1` … `--name-3`: peach glow, rose windows, lavender, sampled from the towers photo)
  is used on the last name in the hero and the OG image only (`.name-gradient`). It is the one gradient on the site.
- Teal and cyan appear only inside Rohan's photographs, never as UI color. No neon, no glow.
- Each color is a one-line edit in `app/globals.css`. Derive tints with `color-mix()`; never introduce an undefined hue.

## Type
- Archivo for display (`font-display`), pushed wide on its width axis (`wdth` 125): the name (light 300,
  uppercase, huge), org/project/school names, section labels (small, uppercase, tracked). Chosen over serifs
  because it reads cooler and more deliberate; Rohan picked it over Bodoni.
- Schibsted Grotesk for body (`font-sans`), weight 400. 500 only for small UI emphasis, never body text.
- No mono labels.
- The OG image uses a static Archivo Expanded Light instance (`assets/fonts/Archivo-Expanded-Light.ttf`),
  because Satori can't use variable axes.

## Layout
- Header: fixed, see-through over the hero photo, filling in with `--color-bg` as you scroll (`.site-bar`, a CSS
  scroll-driven animation; solid where unsupported). Site mark (same art as the favicon) left; section links and
  GitHub/LinkedIn icons right. On phones only Contact and the icons stay.
- GitHub and LinkedIn must be reachable from the first screen: header icons and labeled links in the hero,
  plus the Contact section.
- Work is a list (dates / org and role / one line). Projects is a 2x2 grid split by a thin cross of rules, newest
  first. Both are newest first.
- Square corners everywhere. Photos keep a 0 radius.

## Motion
- Almost none. Hover changes color or underline only, 150ms. No springs, no lifts.
- One entrance, in the hero only: the photo opens out from the strip of light between the towers (`.hero-open`,
  850ms) and the name settles in (`.hero-settle`). Text below the name is readable from the first frame.
- One lowkey interaction: a band of peach light in the last name's gradient drifts with the pointer across the hero (damped: the full window width moves it about half the word, easing over 1.4s)
  (`HeroLight.tsx`, inline background-position), easing and then staying put. Fine pointers only.
- Above the name: "Based in San Francisco / Irvine — 4:12 pm PT", the live Pacific time (`LocalTime.tsx`,
  client-only so the static page never shows a stale time).
- Clicking the email copies it and shows "Copied" in its place (`CopyEmail.tsx`); modifier-clicks still open mail.
- The header fill is tied to scroll position, not time.
- Always respect `prefers-reduced-motion`: the entrance collapses to its final state and the cursor light is off.

## Tokens
- All colors, fonts and spacing live as CSS variables in `app/globals.css` (`:root`), exposed to Tailwind via
  `@theme inline`. Don't hardcode hex values or magic spacing in components (the OG image mirrors tokens because
  Satori can't read CSS variables).

## Code
- One component per file in `app/components/`.
- Keep client components (`"use client"`) to what genuinely needs the browser: currently only `HeroLight`, `CopyEmail` and `LocalTime`.

## Anti-slop rules (avoid unchosen defaults)

Never ship an unchosen default. Every design choice must be justified by my content.

Typography
- Do not use Inter, Roboto, Arial, system fonts, or Space Grotesk as the primary typeface.
- Use a deliberately chosen display + body pairing with strong contrast in size/weight. Body weight 400; no semibold body text.

Color & background
- No purple/indigo/violet-blue gradients. No gradient-clipped text, except the last name (`.name-gradient`), which I asked for.
- One accent and a semantic token for each color (not gradient-start/end). No teal/cyan in the UI. No neon glow.
- Background atmosphere must be tied to my work (my own photography), never generic blur or glow.

Layout & components
- No "centered hero + three equal feature cards" skeleton. No four-card icon grids.
- No pill buttons, no rounded-2xl shadow-lg cards. Square corners by default.
- No colored left-border cards. No nested cards. No glassmorphism.
- No emoji as icons. One icon set (the GitHub/LinkedIn marks in `SocialIcon.tsx`); label icons with text or an aria-label.
- No pill badges above headlines. No colored dots before nav items. No pulsing "Live/New" dots unless it reflects real status.
- Left-align body text; use asymmetry and a clear grid.

Motion
- No fade-in on every element, no infinite decorative loops, no bouncy hovers.
- Hover/click states must communicate state (focus, pressed, loading). Respect prefers-reduced-motion.

Copy & content
- No filler headlines ("Build the future of…"), no buzzwords, no em-dash overuse.
- Use real project names, real numbers, and real links only. No placeholder stats or fake dashboards.

Quality
- Mobile-first at 320px with no horizontal scroll. Proper titles, meta descriptions, OG image, alt text, contrast, and keyboard focus.

Process
- Before finalizing a page, list which of the above you checked and which design decisions were deliberate. If a default slipped in, replace it and say so.
- When I ask for a new section, propose 2 distinct directions before building, and vary away from the most common one.
