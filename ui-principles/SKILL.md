---
name: ui-principles
description: Implements a calm, restrained UI system built on seventeen principles — one alignment spine, deliberate symmetric padding, a deliberate two-size type hierarchy built from space/color/weight/size, rare color, honest interactive states, and designed empty/loading/error states. Use when building, refining, or reviewing a page, component, form, table, dashboard, layout, or screen and the user wants the "calm confidence" / Principles of UI Design aesthetic, or invokes /ui-principles. Do not use for bold, playful, maximalist, or marketing-splash designs.
---

# UI Principles

A restrained product UI system. The aesthetic is **calm confidence** — good UI lasts and stays out of the way. If a piece feels like it's trying to impress, it has failed. Full source text and the "why" behind each rule: [PRINCIPLES.md](PRINCIPLES.md). Worked before/after patterns: [EXAMPLES.md](EXAMPLES.md).

This skill enforces **rules, not numbers.** It does not ship a type scale, palette, spacing scale, or radius. Each project defines its own values — the skill makes sure those values are used with discipline. Where a project already has tokens (CSS variables, a Tailwind theme, a design system), bind to those; never hardcode a one-off.

## Order of attention

Fix in this sequence — earlier wins beat later polish. **Alignment → padding → hierarchy → color → motion.** Most "off" layouts are a spine break or padding asymmetry, not a missing color.

## The rules

**Layout**
- One column width. Every section shares the same max-width container and the same vertical axis; edges line up top to bottom.
- Symmetric padding: top equals bottom, left equals right. Treat each spacing value as a decision.
- Content fills its parent. To narrow something, narrow its container — never cap an individual element with its own width.
- Rhythm from repetition: pick one section gap, one heading gap, one radius, one hover behavior, and reuse them everywhere. Same calm at 320px as at a wide viewport — reflow content, hold the discipline.

**Typography & hierarchy**
- Two sizes, and use both. A statement (display) size and a body size — the statement a genuine step up, not weight standing in for size. Body does most of the work; the statement size carries the page's primary heading and the one or two other moments that earn it. Collapsing everything to one size is under-differentiation — as much a failure as shouting. A page where nothing is larger reads as undifferentiated, not calm.
- Build hierarchy in order: **space → color → weight → size.** Reach for the cheapest contrast first and stop as soon as the level reads; escalate only when it doesn't. Size is the strongest and rarest lever — never the first thing you reach for, never absent where a statement earns it.
- One emphasis at a time. A statement earns the larger size plus slightly tight tracking; a label earns weight *or* color, not both loud. If a thing needs three cues at once (big + bold + colored) to read, the structure beneath it is wrong — fix the structure, not the type.
- Weight is two steps — normal and medium, medium the ceiling. Weight separates peers (label vs value, active vs rest); it does not stand in for the statement size.
- Color is three tiers — foreground, muted, subtle. Demote by color before you shrink. Metadata, timestamps, and helper text live muted or subtle at body size, not at a smaller size.
- Mixed case; slightly negative tracking on statements, normal on body. Never all-caps with positive letter-spacing. Balance statement wraps, let body wrap pretty, give body a comfortable measure and leading; numerals tabular.
- Spacing is hierarchy made spatial — more room above higher-level headings, the same room below each. Level and rhythm are one decision.

**Color**
- A small neutral set does almost all the work. Spend color rarely and semantically. When everything is colored, nothing reads as colored. Bind to the project's semantic tokens; don't hardcode one-off colors.

**Shape & motion**
- One corner radius across the whole surface.
- Transitions affect color/background only. Never opacity, transform, scale, or shadow on hover.

**Honesty & structure**
- Interactive elements look interactive; static text never teases clickability. A link that doesn't link is a lie — wire it up or omit it.
- A card is a device for discrete, repeatable, often-clickable content. Default blocks live in the column with no wrapper.
- Every block earns its place. Design the footer, the empty state, the form — or leave it off. No default chrome, no placeholder marks.
- Reading order is sequenced, not competing. Decide where the eye starts and where it goes.

**States & performance**
- Design empty, loading, error, success, and overflow states. Every action has a designed "after."
- No layout shift. Reserve space for fonts and images. Slow is broken; a page that jumps is not finished.

## Build / refine workflow

1. Read [PRINCIPLES.md](PRINCIPLES.md) once for intent.
2. Find the project's existing tokens (CSS variables / theme). Use them. If none exist, pick the minimal set this surface needs and apply it consistently — don't invent a scale per element.
3. Establish the spine and spacing rhythm first; get every section onto one axis with symmetric padding.
4. Set the two type sizes, then build hierarchy in order — space → color → weight → size. Lean on neutrals; add color only where earned.
5. Wire honest interactive states and the full set of empty/loading/error/success states.
6. Run the checklist below. Screenshot at 320px and a wide viewport to confirm "same calm."

## Review checklist

- [ ] One column width; section edges align top to bottom (spine).
- [ ] Padding symmetric (top=bottom, left=right) on every block.
- [ ] Content fills its parent; no per-element width caps.
- [ ] Spacing repeats — one section gap, one heading gap, one radius, one hover behavior.
- [ ] Holds its rhythm at 320px and at a wide viewport.
- [ ] Two sizes, both used — body carries the page, the statement size appears where earned (not collapsed to one size, not scattered).
- [ ] Hierarchy built space → color → weight → size; size is the last lever, not the first or the absent one.
- [ ] No element stacks three emphasis cues (big + bold + colored); weight within two steps, medium the ceiling.
- [ ] Color demotes before size does — metadata/helper text muted or subtle at body size.
- [ ] Mixed case, slightly tight tracking on statements; numerals tabular; body has a comfortable measure.
- [ ] Color is rare, earned, and bound to tokens; neutrals carry the page.
- [ ] Every block is deliberate — no afterthought footer, placeholder mark, or default form chrome.
- [ ] Reading order is sequenced, not competing.
- [ ] Interactive looks interactive; every link actually links.
- [ ] Cards used only for discrete/repeatable/clickable content.
- [ ] Hover is a color/background shift only — no opacity/transform/shadow/scale.
- [ ] Empty, loading, error, success, and overflow states all designed.
- [ ] No layout shift; fonts/images reserve their space.
