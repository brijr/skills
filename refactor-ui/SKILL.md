---
name: refactor-ui
description: Refactor an existing piece of UI by diagnosing visible problems, asking a few meaning-focused questions (not aesthetic ones), proposing a ranked plan, then editing the code. Use when the user points at a specific component, screen, or pattern — via image, code file, or both — and asks to refactor, improve, clean up, or make it better. Do not use for green-field UI design (use frontend-design or calm-ui), for writing components from scratch, or for design reviews without edits.
---

# refactor-ui — diagnose-then-edit refactoring for existing UI

This skill is a *process*, not a design system. "Refactor this UI" without context usually produces generic cleanup that misses the point. The questions this skill asks are about **meaning** — what the UI is for, what matters, what's locked. Aesthetic direction is a single neutral question, not the main event.

## Inputs

The user gives you one or more of:

- **an image** of a UI (screenshot, mock, Figma export)
- **a component file path** (or a directory of components)
- **both** — preferred, because diagnosis is sharper with the image and edits require the code

If the input is image-only and the user wants edits, ask where the code lives before Phase 3. If the user explicitly wants code written from an image with no existing source, say so and proceed — but that's closer to `frontend-design` than a refactor.

## The four phases

Run in order. Don't skip, don't merge them into a wall of text. Each phase produces a distinct visible step for the user.

### Phase 1 — Observe (silent)

Build an internal list of visible issues from the inputs. Look for:

- **Hierarchy mismatch** — the most prominent element isn't the most important
- **Redundancy** — two or three signals saying overlapping things (badge + icon + text), multiple actions doing the same job
- **Ambiguity** — labels that don't state what they mean ("Ready Apr 23" — ready for what?), unlabeled icons, unclear states
- **Machine data leaking through** — UUIDs, raw filenames, ISO timestamps, internal category names shown to end users
- **Action overload** — >2 actions on a row/card without a clear primary
- **Alignment drift** — things almost-aligned, mixed grids, inconsistent padding
- **Density** — over-chromed chrome, card-on-card-on-card, unnecessary containers
- **Noise** — metadata that doesn't serve the user's task

This list is raw material for Phase 2 and 3. Do not dump it unfiltered on the user.

### Phase 2 — Diagnose and ask

Output one block with this shape:

```
**What I'm noticing**
- <concrete issue, naming the real element — not "the header could be better">
- <3–6 items, stop when you run out of real observations>

**Before I refactor, a few questions**
1. **Meaning** — What does <this element> represent to the user, and what's the primary thing they do from it?
2. **Signal vs. noise** — Of the visible elements (<name them: "Draft badge, OCR ready badge, filename, Ready date, View, Details, pin, overflow menu">), which matter to users, and which could be hidden, moved to a detail view, or dropped?
3. **What's locked?** — What can't change: data shape, API contract, component library, copy/translations, URL structure, analytics events?
4. **Aesthetic direction** — Existing design system or reference to match? Link, file, or product. If none, I'll default to restrained/calm.
```

Rules for the questions:

- **Tailor Q2 to the actual elements in the input.** Generic "what matters to users?" is useless. Name the specific badges, fields, and actions you can see.
- **Don't ask more than 4 questions unless the input is genuinely ambiguous.** If a 5th is needed (e.g. scale — "how many of these appear in practice?"), add it; don't pad.
- **Never ask aesthetic questions beyond Q4.** No "rounded or sharp corners?", no "what color palette?". Those are not refactor drivers.

### Phase 3 — Propose a ranked plan

Once answers are in, produce a plan:

```
**Refactor plan**
1. <change in one line> — <why, referencing the user's answer>
2. <change> — <why>
...
```

Rank by impact. Structural and hierarchy changes before visual polish. Copy fixes before styling. 3–7 items; more than 7 means scope is too wide and you should narrow with the user.

Show the plan. **Wait for approval or adjustments.** Do not edit yet.

### Phase 4 — Edit

On approval:

- Reuse existing components, design tokens, and utilities (`cn`, CSS variables, shared primitives). Don't invent new color palettes, typography scales, or component abstractions unless asked.
- Match the surrounding code style — if the repo uses shadcn/ui with Tailwind CSS variables, use those. Don't hardcode colors.
- Change copy when copy is the problem. Don't restyle ambiguous labels — rewrite them.

After editing, report in 1–2 lines per file:

```
**Changed**
- <file:line> — <what and why, terse>

**Didn't change**
- <anything the user might have expected to change and why you left it> (omit if nothing)
```

## Rules of taste (defaults for Phase 3 and Phase 4)

Apply when the user hasn't specified direction. Override any of these if the user's aesthetic answer conflicts.

1. **Primary action wins.** One action per row/card/screen gets visual weight. Secondary actions demote to links, overflow menus, or hover-reveal.
2. **One status pattern, not two.** Badge + muted text + icon all saying related things → pick one pattern and unify.
3. **Human data replaces machine data.** UUIDs, raw filenames, ISO timestamps → derived titles, relative time, tooltip for the raw value.
4. **Hierarchy from weight and placement, not size jumps.** 2–3 font weights > 5 font sizes.
5. **Ambiguous labels get rewritten, not restyled.** "Ready Apr 23" → "Uploaded Apr 23" or "Processed Apr 23". Fix the words first.
6. **Cut more than you add.** A good refactor removes visual weight net.
7. **Preserve what works.** Don't restyle things that weren't called out unless they block the change.

## Anti-patterns

- **Skipping Phase 2.** "Make this better" without meaning-context produces generic cleanup.
- **Aesthetic question stacking.** One question about direction is enough. If the user gave you a design-system link, don't also ask about colors, corners, and spacing.
- **Inventing new components or tokens** when existing ones would work.
- **Scope creep.** "While I was in here I also cleaned up…" — no. Stay inside what was asked.
- **Before/after essays.** The post-edit report is 1–2 lines per file, not a narrative.
- **Refactoring from image alone** when the code exists and the user has access to it. Ask for the code.

## Worked example — document row

**Input:** image of a file list row containing a machine-generated filename, a `Draft` badge, an `OCR ready` badge, `Ready Apr 23, 2026`, and `View` / `Details` / pin / `…` actions.

**Phase 2 output:**

> **What I'm noticing**
> - The filename is a machine-generated blob (`02540-VA 21-0966 Intent to File-20170303-7BFF…`); it has the most visual weight but the least readable content
> - Two status signals split across the row, styled differently: `Draft` (badge, left) and `OCR ready` + `Ready Apr 23, 2026` (badge + muted text, right)
> - Four competing actions with no clear primary: `View`, `Details`, pin, `…`
> - `Ready Apr 23, 2026` is ambiguous — ready for what?
> - `Other · 108.0 KB` — "Other" reads like an unclassified category; may be noise
>
> **Before I refactor, a few questions**
> 1. **Meaning** — What does this row represent: a doc the user uploaded, a doc received from the VA, a task awaiting action? And what's the primary thing they do from it — open it, check status, or something else?
> 2. **Signal vs. noise** — Of `Draft`, `OCR ready`, the filename, the date, `Other`, `108.0 KB`, `View`, `Details`, pin, and `…`: which matter to users, and which could move to a detail view or be dropped?
> 3. **What's locked?** — Can the filename be replaced with a derived title? Are `Draft` and `OCR ready` fixed copy from the backend, or can the wording change? Is the UI on shadcn/ui or custom components?
> 4. **Aesthetic direction** — Existing design system or reference? If not, I'll default to restrained/calm.

Phase 3 produces a ranked plan shaped by those answers. Phase 4 edits the component. The report at the end names every file touched and flags anything deliberately left alone.
