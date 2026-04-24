# UI system prompt

Portable, rule-dense version of the calm-ui constraint system. Paste into a `CLAUDE.md` in another project as a persistent design constraint. For the full skill (with code examples, shadcn refinement, and workflow), see the parent `SKILL.md`.

> Derived from `SKILL.md`. When rules change, update both.

## Aesthetic direction

Build interfaces that feel calm, restrained, structured, spacious, precise, human, and quietly premium. The language draws from Swiss, Japanese, Scandinavian, and German design traditions. This is an authored product system — not a template, not a dashboard kit, not a component demo.

## Non-negotiables

1. **Restraint over expression.** Prefer reduction and clarity over visual novelty.
2. **Minimal typography variance.** Hierarchy from weight, spacing, placement, alignment, grouping, density, and contrast — not type size jumps.
3. **Calm over busy.** Interfaces feel quiet and easy to scan.
4. **Structure over decoration.** Layout, spacing, and rhythm before visual chrome.
5. **System over one-offs.** Repeated elements follow one consistent pattern.
6. **Neutral first.** The UI works in grayscale before accent color is added.
7. **Shadcn is a foundation, not the final look.** Never ship default-looking shadcn components without refinement.

## Hard rules

- **Type scale:** `text-xs` through `text-lg` in product UI. `text-xl` for page titles only. No `text-2xl`+.
- **Shadows:** `shadow-sm` sparingly, or none. Never `shadow-lg`+. No tinted shadows.
- **Border radius:** Set `--radius` to `0.375rem`–`0.5rem`; let shadcn components inherit. Don't override with `rounded-xl`/`rounded-full` on containers.
- **Color:** Only shadcn CSS-variable classes (`bg-background`, `text-foreground`, `bg-muted`, `border-border`). Never hardcode `bg-gray-*`, `bg-white`, `text-black`.
- **Icons:** Lucide React. `h-4 w-4` inline, `h-5 w-5` stand-alone.
- **Font weights:** 2–3 per screen max; avoid `font-bold` and heavier.

## Component guidance

- **Buttons:** `size="sm"` (h-9 px-3) for most product UI. One `variant="default"` per screen; secondaries use `ghost` or `outline`. Labels short, sentence case.
- **Cards:** Intentional, not automatic. Only when containment adds clarity. Prefer open composition over card-wrapped sections.
- **Tables:** Quiet header (normal weight, muted, `h-9` rows, no background fill). Primary column at full contrast; secondary columns `text-muted-foreground`. `hover:bg-muted/50`.
- **Form fields:** `space-y-4` between fields, `space-y-1.5` label-to-input. Labels `text-sm font-medium`. No per-field borders or cards.
- **Navigation:** Predictable, label-driven. Active state through weight or one subtle marker — not both. One nav pattern per app.

## Anti-patterns

Do not produce:

- Generic SaaS dashboard energy
- Default shadcn demos shipped as-is
- Excessive borders, cards, badges, dividers, shadows
- Large typography jumps for hierarchy
- Card-on-card nesting
- Crowded forms, dense layouts
- Loud gradients, decorative motion, colorful widgets
- Too many button variants on a single screen
- Overdesigned marketing-site energy inside a product

## Dark mode and responsive

- CSS variables handle dark mode automatically. Hardcoded colors break it.
- Dark mode: borders go lower contrast (`border-border/50`); surfaces layer through lightness, not drop shadow.
- Mobile: reduce horizontal padding (`p-4 md:p-6`), keep section spacing (`space-y-6`). Columns collapse to single column.
- Tables at mobile: horizontal scroll OR card list — not both.
- Touch targets: `h-9` floor. Button labels stay full unless the icon is universally understood.
- Grayscale-check in both themes. If hierarchy only reads with accent color, the hierarchy is wrong.

## Pre-ship checklist

- Calm at first glance?
- Hierarchy from spacing and weight, not type size?
- One clear primary action per screen?
- Every badge/border/card earns its place?
- Reads in grayscale in both light and dark mode?
- Mobile preserves spacing rhythm?
- Type scale, radius, and shadow within hard limits?
- Feels authored, not templated?
