---
name: brijr-ui
description: Apply a restrained, Swiss/Japanese/Scandinavian/German-influenced design system when building UI in React, Next.js, TypeScript, and shadcn/ui. Use this skill whenever the user asks to build a page, screen, component, form, table, dashboard, layout, or any frontend interface — especially when the project uses shadcn/ui. Also trigger when the user asks to refine, critique, redesign, or review existing UI for visual quality. This skill should be used IN COMBINATION with the frontend-design skill when both apply — this skill provides the aesthetic constraints while frontend-design provides implementation patterns. Do NOT use this skill for marketing sites, landing pages, or contexts where bold/expressive design is explicitly requested.
---

# brijr-ui — Restrained Product Design System

This skill enforces a specific design philosophy when building product interfaces. It is not generic guidance — it is an opinionated constraint system.

## When to Use

- Building any page, screen, or component in React/Next.js/shadcn/ui
- Refining or critiquing existing UI
- Reviewing a screen for visual quality
- Any time the user says "build this," "design this," "make this look better," or "clean this up" for product UI

## When NOT to Use

- Marketing/landing pages where expressive design is requested
- Projects where the user explicitly asks for a different aesthetic (bold, playful, maximalist)
- Non-UI tasks

## Core Constraints

Read these before writing any UI code. Every rule is testable — you should be able to look at a screen and answer yes/no.

### Non-Negotiables

1. **Restraint over expression.** Prefer reduction and clarity over visual novelty.
2. **Minimal typography variance.** Hierarchy comes from weight, spacing, placement, alignment, grouping, density, and contrast — not type size jumps.
3. **Calm over busy.** Interfaces feel quiet and easy to scan.
4. **Structure over decoration.** Layout, spacing, and rhythm before visual chrome.
5. **System over one-offs.** Repeated elements follow one consistent pattern.
6. **Neutral first.** The UI works in grayscale before accent color is added.
7. **Shadcn is a foundation, not the final look.** Never ship default-looking shadcn components.

### Layout

- Start with spacing and grouping before reaching for cards
- Strong alignment throughout — architectural, not incidental
- Generous whitespace is structural, not decorative
- Fewer, stronger layout decisions; reduce unnecessary nesting
- No card-on-card-on-card; containment only when it adds clarity

### Typography

- Tight type scale with minimal size variance
- Hierarchy from weight, spacing, placement — not dramatic scaling
- Headings restrained, body text readable and consistent, labels understated

### Components

- Light, quiet, precise, refined, consistent
- One strong pattern per component type
- Buttons: clear primary/secondary hierarchy, subtle treatment, calm states
- Inputs/Forms: subtle field styling, aligned labels, strong spacing, clean focus states
- Cards: intentional, not automatic; prefer open composition
- Tables: clean structure, subtle row separation, readable spacing, minimal controls
- Navigation: predictable, quiet, understated
- Icons: one set, consistent sizing, restrained use

### Color

- Neutral tones dominate
- Accent color sparingly and semantically
- Color for meaning, not decoration

### Interaction

- Subtle hover/focus/selected/loading/disabled states
- Smooth transitions, never flashy
- Motion reinforces calmness

### Anti-Patterns (Hard Stops)

Do not produce any of the following:

- Generic SaaS dashboard energy
- Default shadcn demos shipped as-is
- Dense enterprise admin panel aesthetics
- Excessive borders, cards, badges, dividers, shadows
- Loud gradients, oversaturated surfaces, colorful widgets
- Crowded forms, dense layouts
- Decorative motion, flashy animation
- Large typography jumps for hierarchy
- Too many button styles or component variants
- Card-on-card nesting
- Generic table-heavy admin styling
- Overdesigned marketing energy inside an app

## Workflow

When building or refining UI, follow this order:

1. **Structure** — Layout, spacing, grouping, alignment
2. **Typography** — Restrained hierarchy, weight over size
3. **Component refinement** — Adapt shadcn into the calm design language
4. **Unification** — Make repeated patterns feel cohesive
5. **Noise reduction** — Strip anything that doesn't earn its place
6. **Color** — Neutral system with semantic accents
7. **Interaction** — Polish states subtly
8. **Final check** — Run the self-review below

## Self-Review (Run Before Finalizing)

Score 1–5 on each. Revise until all are 4+.

| Criterion | Question |
|---|---|
| Calm | Does this feel calm at first glance — or busy? |
| Hierarchy | Is hierarchy from spacing and structure — or oversized type? |
| Containment | Too many cards, borders, badges, dividers? |
| Authored | Does this feel authored — or templated? |
| Neutral | Would this work in grayscale? |
| Earned | Does every element earn its place? |

## References

For task-specific copy-paste prompts (build, refinement passes, critiques, one-liners), read:
→ `references/prompt-library.md`

For the full system prompt version suitable for injecting into other tools or CLAUDE.md files:
→ `references/system-prompt.md`
