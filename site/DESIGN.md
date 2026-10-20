---
name: Carol Limah
description: Portfolio and media kit for Carol Limah, an espresso-dark editorial world lit by caramel italics.
colors:
  bg: "#17110d"
  bg-band: "#1d1611"
  bg-hover: "#1f1813"
  bg-video: "#221a15"
  text: "#f3ece2"
  text-2: "#e4d8c9"
  muted: "#cbbfb1"
  subtle: "#a89a8a"
  cream: "#f3ece2"
  cream-card: "#d9cfc2"
  cream-eyebrow: "#6f5f50"
  cream-italic: "#9a5b22"
  accent: "oklch(0.8 0.11 65)"
  accent-light: "oklch(0.85 0.1 65)"
  bar-2: "oklch(0.72 0.1 65)"
  bar-3: "oklch(0.64 0.09 65)"
  bar-4: "oklch(0.56 0.08 65)"
  line: "rgba(243, 236, 226, 0.1)"
typography:
  display-xl:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(48px, 7.4vw, 112px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  display:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(48px, 6vw, 84px)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(40px, 5vw, 68px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline-sm:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(36px, 4vw, 52px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.05
  title-sm:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.1
  numeral:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1
  body-lg:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  nav:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  meta:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  track: "4px"
  thumb: "6px"
  card-sm: "12px"
  card: "16px"
  media: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 40px)"
  container: "1240px"
  grid-gap: "14px"
  grid-gap-sm: "10px"
  stack: "28px"
  section: "clamp(64px, 9vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "15px 26px"
  button-primary-hover:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.bg}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "15px 26px"
  button-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "9px 16px"
  button-cream-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
  button-mail:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0 44px"
    height: "64px"
  button-mail-hover:
    backgroundColor: "{colors.bg-hover}"
    textColor: "{colors.accent-light}"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  filter-chip-active:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.cream}"
  media-card:
    backgroundColor: "{colors.cream-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  service-cell:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    padding: "32px 28px 36px"
---

# Design System: Carol Limah

## Overview

**Creative North Star: "The Late Table"**

A dimly lit table at the end of the evening: espresso ground, cream type, and one warm caramel light that falls only on the words worth leaning toward. The site reads like a printed food-and-travel supplement more than a creator link page. Large Instrument Serif headlines carry the voice, Hanken Grotesk carries the facts, and the caramel lives almost entirely in italics, ordinals and the one action the page wants.

Density is relaxed and editorial: wide section breathing room, hairline dividers instead of boxes, and the proof (9:16 video cards, view counts, partner brands) given the most surface. Depth comes from photographs, never from containers. The world is chic and restrained; ornaments are typographic (a thin caramel rule, a middot, a serif numeral), never decorative symbols.

**Key Characteristics:**
- Espresso dark ground with one inverted cream band (portfolio) and one full-caramel band (contact).
- Instrument Serif at weight 400 for every headline, title and number; italic phrases in caramel.
- Pill-shaped actions; softly rounded 9:16 media; flat text surfaces divided by 1px hairlines.
- Soft, dark, diffuse shadows only under photographs, the lightbox and floating actions.
- The route: a vertical hairline with caramel stop dots that light as the reader passes them.

## Colors

A warm, near-monochrome brown world with a single caramel accent stepped into a four-tone data ramp.

### Primary
- **Caramel** (`accent`): the italic phrase in every serif headline, ordinals, route dots and line, data bar for the leading value, the primary pill button, and the whole contact band. Also the default focus ring and text selection.
- **Pale Caramel** (`accent-light`): hover state of caramel fills; category labels on dark media captions.

### Secondary
- **Caramel Data Ramp** (`bar-2`, `bar-3`, `bar-4`): descending tones for ranked bars; `bar-4` marks the baseline or non-key series so the caramel lead reads as the answer.

### Neutral
- **Espresso** (`bg`): page ground, text on caramel and cream, card borders in the hero collage.
- **Roast Band** (`bg-band`): marquee and "other routes" bands, one step lifted from the ground.
- **Roast Hover** (`bg-hover`) and **Video Well** (`bg-video`): hover fill on the dark mail button; placeholder behind video and thumbnails.
- **Cream** (`text` / `cream`): primary text on dark; the portfolio band ground; cream pill buttons and badges.
- **Oat** (`text-2`): secondary emphasis, labels, chart titles, marquee words.
- **Latte** (`muted`): body paragraphs and nav links.
- **Dust** (`subtle`): meta lines, sources, footer, counts.
- **Card Oat** (`cream-card`): placeholder behind media cards on cream.
- **Cocoa Ink** (`cream-eyebrow`) and **Burnt Caramel** (`cream-italic`): secondary text and the italic accent when the ground is cream, where pure caramel would fail contrast.
- **Hairline** (`line`): 1px dividers between sections, stops, list rows.

### Named Rules
**The Caramel Speaks Once Rule.** On dark grounds caramel is reserved for italic emphasis, ordinals and route marks, data leads, and the primary action. Body copy, borders and surfaces never take it, except the contact band, where it becomes the ground.

**The Three Grounds Rule.** Espresso is the default, cream is the inverted proof band, caramel is the closing ask. Each ground swaps its accent: caramel on espresso, burnt caramel on cream, espresso on caramel (italics inherit). The focus ring follows the same swap (`--focus` set to espresso on cream and caramel).

## Typography

**Display Font:** Instrument Serif (with serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif)

**Character:** A narrow, high-contrast editorial serif set large and tight against a clean, friendly grotesk. The serif is the voice and the number; the sans is the caption and the control.

### Hierarchy
- **Display XL** (400, clamp 48–112px, 0.95): the closing contact headline only.
- **Display** (400, clamp 48–84px, 0.94, -0.02em): page H1, balanced wrapping, with a caramel italic close.
- **Headline** (400, clamp 40–68px, 1): section H2s and niche stop names (stop names run clamp 40–64px with a 0.42em caramel ordinal on the baseline).
- **Headline Small** (400, clamp 36–52px): sub-section heads such as audience and "other routes".
- **Title** (400, 32px, 1.05): service names; route stop names run clamp 26–32px; lightbox title 40px.
- **Title Small** (400, 22px, 1.1): media card titles (18px on mobile).
- **Numeral** (400, 44px, 1): hero stats; chart values in the same serif at 22–34px.
- **Body Large** (400, 18px, 1.6): narrative paragraphs, capped near 62ch / 440–520px; hero lead clamp 17–19px at 1.55.
- **Body** (400, 16px, 1.55): service descriptions; 15px for chart labels and lists.
- **UI** (600–700, 15px): buttons and filters.
- **Meta** (400, 13px): counts, sources, stamps, footer, tabular numerals.
- **Label** (600, 11px, 0.12em, uppercase): the category line inside a media card caption and the lightbox category. Confined to labels attached to an item.

### Named Rules
**The Serif Counts Rule.** Every figure the brand should remember (followers, views, percentages, ordinals) is set in Instrument Serif at weight 400, with tabular numerals where numbers stack. The sans never sets a hero number.

**The Weightless Serif Rule.** Instrument Serif is only ever weight 400. Emphasis comes from italic and caramel, not bold.

## Layout

A single centered column of 1240px with a fluid gutter (clamp 20–40px). Sections breathe with clamp(64px, 9vw, 128px) vertical padding; the contact band opens wider (up to 140px). Two-up compositions (hero, about, results, audience head) use `auto-fit` grids with 360–440px minimums, collapsing to one column without explicit breakpoints, and switch to fixed ratios above 1000px (hero 1.15fr / 1fr; niche page content / 320px sticky route).

Media grids are `auto-fill` with 230px (home) or 200px (niche) minimums and a 14px gap, forced to two columns with a 10px gap under 720px. Breakpoints in use: 480px (stacked actions, compact chart rows), 720px (burger nav, two-column grids, mobile dock), 860px (sticky results text), 1000px (two-column hero and niche layout).

Sticky elements sit 96–110px from the top to clear the blurred nav. Vertical stacks inside a block run at 14–28px; text never sits closer than 12px to an action group.

## Elevation & Depth

Flat surfaces, lifted photographs. Text containers, service cells, route rows and chart blocks have no shadow and are divided by hairlines or tonal bands. Shadows are soft, dark and large-radius, and they belong to imagery and to things that float above the page: hero photos, the hovered media card, the lightbox, the mail button and the mobile dock. The sticky nav uses a translucent espresso with a 14px backdrop blur instead of a shadow.

### Shadow Vocabulary
- **Portrait lift** (`box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45)`): main hero photograph.
- **Collage lift** (`box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`): secondary photos and video tile in the hero collage.
- **Card hover** (`box-shadow: 0 18px 40px rgba(23, 17, 13, 0.25)`): media card on hover and focus.
- **Stage** (`box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6)`): lightbox media.
- **Action float** (`box-shadow: 0 14px 30px rgba(23, 17, 13, 0.28)`): mail button on caramel; the mobile dock uses `0 12px 28px rgba(23, 17, 13, 0.45)`.

### Named Rules
**The Photographs Float Rule.** Only imagery and floating actions cast shadows. A block of text that needs separation gets a hairline or a band, never a drop shadow, and never a hard offset shadow.

## Shapes

Two families. Actions are full pills (999px): primary, outline, cream, filters, the mail button, the dock and the lightbox close. Media is softly rounded: 20px for large photographs and the lightbox stage, 16px for 9:16 cards (12px on mobile), 6px for reel thumbnails. Data tracks and bars use a quiet 4px, the audience split bar 8px. Icon controls are circles (30–44px). Text surfaces are square-edged and borderless; the only boxed text structure is the service grid, a 20px-rounded frame whose cells are separated by 1px gaps. Borders on dark run at 0.25–0.3 cream alpha for outlines and 0.08–0.12 for dividers.

## Components

### Buttons
Soft and confident, always pills.
- **Shape:** full pill (999px), 44px minimum hit area.
- **Primary:** caramel fill, espresso text, 700 weight, 15px, 15px x 26px padding; hover lifts to pale caramel.
- **Outline:** transparent with a 1px cream border at 0.25 alpha, cream text, 600 weight.
- **Cream:** cream fill with espresso text for the nav call to action and lightbox close; hovers to caramel.
- **Mail button:** the closing action on the caramel band, espresso fill, cream text, 64px tall, 44px side padding, lifts 2px on hover with action float shadow.
- **Outline on caramel:** 1.5px espresso border, espresso text, fills espresso on hover with caramel text.
- **Focus:** 2px solid outline, 3px offset, in caramel (espresso on cream and caramel grounds).

### Chips
- **Style:** filter pills on cream, transparent with a 1px espresso border at 0.2 alpha, 14px/600, 44px tall, an optional count at 0.55 opacity.
- **State:** pressed fills espresso with cream text. On mobile the row scrolls horizontally with a right-edge fade mask.

### Cards / Containers
- **Media card:** 9:16 button, 16px radius, card-oat placeholder, bottom gradient shade into espresso at 0.92, cream brand badge pill at top left, blurred circular play mark at top right, caption with label, serif title and eye-icon view count. Fades in over 0.4s; hover adds the card shadow.
- **Service grid:** 20px-rounded frame, 1px cream hairlines between espresso cells, 32/28/36px padding, caramel serif ordinal, 32px serif title.
- **Internal padding:** 12–14px for overlay captions, 28–32px for text cells.

### Navigation
Sticky bar in translucent espresso (0.78) with 14px blur and a cream hairline below. Serif wordmark with the surname in caramel italic. Links are 14px/500 in latte, caramel on hover; the current page is cream with a 2px caramel underline offset 8px. The final item is the cream pill call to action. Under 720px the links collapse behind a three-line burger into a stacked list with hairline separators and a full-width pill. Breadcrumbs use 14px meta text, slash separators and underlined links, with the current page in caramel.

### Route Index (signature)
The niche pages' clickable table of contents. A vertical 1px hairline joins 11px ringed caramel dots; each row carries a serif stop name (clamp 26–32px) and a meta line of video count and top views; no ordinals, the line and dots carry the sequence. As the reader scrolls, passed dots fill caramel, the current dot scales to 1.35, and the line segment fills downward in caramel (0.6s, `cubic-bezier(0.16, 1, 0.3, 1)`). Each stop heading repeats the solid caramel dot. Sticky beside the content on desktop; on mobile it sits above the stops and, once scrolled away, the current stop shows in a strip inside the nav (dot, serif name, "3 de 5"). Stop cards drop the category label and any brand tag that repeats the stop name; on mobile each stop is a horizontal scroll-snap rail of 62vw cards.

### Ranked Bars
Data rows in a grid of thumbnail, label with caramel uppercase brand tag, and a right-aligned serif value. Tracks are 12–14px tall at 0.07 cream on 4px radius, filled from the caramel ramp in rank order and animated from zero over 1s when they enter the viewport.

### Marquee
A band in roast with hairline borders, serif words at clamp 24–34px in oat, separated by a 40px caramel rule at 0.55 opacity. Pauses on hover and through a circular toggle; stops under reduced motion.

## Do's and Don'ts

### Do:
- **Do** close serif headlines with an italic phrase in caramel (burnt caramel on cream, inherited espresso on caramel).
- **Do** set every remembered number in Instrument Serif 400 and every label in Hanken Grotesk.
- **Do** separate sections and rows with the 1px hairline or a tonal band before reaching for a container.
- **Do** keep every action a pill with a 44px minimum target and the caramel-or-cream fill logic above.
- **Do** present proof as 9:16 media cards with brand badge and views, in 14px-gap auto-fill grids.
- **Do** honour reduced motion: marquee, fills, route transitions, card fades and the dock all stop.

### Don't:
- **Don't** use decorative symbols or kitsch ornaments (such as ✦) as separators; use the thin caramel rule, a middot or a slash.
- **Don't** bold Instrument Serif or set it in any weight other than 400.
- **Don't** put caramel on body copy, borders or surfaces on the espresso ground.
- **Don't** cast shadows from text blocks, and never use a hard offset shadow.
- **Don't** add uppercase tracked kickers above headlines on new surfaces; the niche pages ship without them and the uppercase label stays attached to items (card captions, lightbox category, brand tags).
- **Don't** tilt route rows, grids or text; rotation belongs to the hero photo collage only.
