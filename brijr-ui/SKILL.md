---
name: brijr-ui
description: Apply a restrained, Swiss/Japanese/Scandinavian/German-influenced product design system when building or refining UI in React, Next.js, TypeScript, and shadcn/ui. Use when the user asks to build, refine, critique, redesign, or review a page, screen, component, form, table, dashboard, layout, or other frontend interface, especially in projects using shadcn/ui. Do not use for marketing sites, landing pages, non-UI work, or requests for bold, playful, maximalist, or otherwise expressive aesthetics.
---

# brijr-ui — Restrained Product Design System

This skill enforces a specific design philosophy when building product interfaces. It is not generic guidance — it is an opinionated constraint system.

## Core Constraints

Read these before writing any UI code. Every rule is testable — you should be able to look at a screen and answer yes/no.

### Non-Negotiables

1. **Restraint over expression.** Prefer reduction and clarity over visual novelty.
2. **Minimal typography variance.** Hierarchy comes from weight, spacing, placement, alignment, grouping, density, and contrast — not type size jumps.
3. **Calm over busy.** Interfaces feel quiet and easy to scan.
4. **Structure over decoration.** Layout, spacing, and rhythm before visual chrome.
5. **System over one-offs.** Repeated elements follow one consistent pattern.
6. **Neutral first.** The UI works in grayscale before accent color is added.
7. **Shadcn is a foundation, not the final look.** Never ship default-looking shadcn components. See "shadcn Foundation" below for how to refine them.

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

- Neutral tones dominate — use shadcn's CSS variable system (`bg-background`, `text-foreground`, `bg-muted`, etc.)
- Never hardcode Tailwind color classes (`bg-gray-*`, `bg-white`) — this breaks dark mode
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

## shadcn Foundation

shadcn/ui is the component and color baseline. The job is to refine it into the restrained language — not replace it, not ignore it, and definitely not ship it looking stock.

### Always use CSS variables for color

shadcn's theming runs through CSS variables in `globals.css`. This is the color system — and it's what makes dark mode work automatically. Always use the semantic color classes:

```
✅  bg-background  text-foreground  border-border
✅  bg-muted  text-muted-foreground  bg-primary  text-primary-foreground
✅  bg-card  bg-popover  bg-accent  bg-destructive

❌  bg-gray-100  text-gray-500  border-gray-200  bg-white  text-black
```

Hardcoded Tailwind color classes (like `bg-gray-*` or `bg-white`) break dark mode and bypass the design system. If you need a color, it should come from a CSS variable. The only exception is opacity modifiers on semantic colors when needed (e.g., `border-border/50`).

### Customize the theme variables

The first lever for making shadcn not look like default shadcn is adjusting the CSS variables in `globals.css`:

- **`--radius`**: Reduce for a more restrained feel. `0.375rem` or `0.5rem` — not `0.75rem`.
- **`--border`**: Slightly lower contrast than default. Borders should be felt, not seen.
- **`--primary`**: Keep it understated. It's an accent, not a shout.
- **`--muted`**: This is the workhorse for subtle backgrounds. Make sure it's actually subtle.

### Refining components — what "not default" looks like

The second lever is how you compose and style the components themselves.

**Card — default vs. refined:**

Default shadcn wraps everything in `<Card>` with `<CardHeader>` and `<CardContent>`. Often the card is unnecessary — spacing and typography create the grouping on their own:

```tsx
// Default — card doing nothing structural
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Manage your team and roles.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// Refined — open composition, card removed
<div className="space-y-4">
  <div>
    <h2 className="text-sm font-medium">Team Members</h2>
    <p className="text-sm text-muted-foreground">Manage your team and roles.</p>
  </div>
  <div className="space-y-2">...</div>
</div>
```

Use `<Card>` only when you need explicit containment — a clickable surface, a draggable item, a visually distinct group inside a larger layout.

**Button — refinement:**

- Tighten padding: `h-9 px-3` or `h-8 px-3 text-sm` feels more restrained than the default `h-10 px-4 py-2`
- Lean on `variant="ghost"` and `variant="outline"` for secondary actions — `variant="default"` (solid primary) is for the one main action on a screen
- Keep button labels short and sentence-case

**Table — refinement:**

- Reduce row height from default padding — tighter rows read as more refined
- Use `text-muted-foreground` for secondary columns to create quiet hierarchy
- Subtle hover: `hover:bg-muted/50` rather than `hover:bg-muted`
- Minimal header styling — don't bold everything, don't add background color to the header row

### Design tokens — the positive signal

These are starting points for the restrained feel. The point isn't to be rigid — it's to have a baseline that produces consistent, calm output.

| Property | Guidance |
|---|---|
| **Type scale** | Stay within `text-xs` through `text-lg`. Use `text-xl` for page titles only. No `text-2xl`+ in product UI. |
| **Section spacing** | `space-y-6` or `gap-6` between major sections |
| **Group spacing** | `space-y-2` or `gap-2` within related items |
| **Page padding** | `p-6` or `px-6 py-8` — enough to breathe |
| **Border radius** | `rounded-md` on components. Never `rounded-xl` or `rounded-full` on containers. |
| **Shadows** | `shadow-sm` sparingly, or none. Never `shadow-lg`+. |
| **Border weight** | Default `border` (1px). Use `border-border` or `border-border/50` for subtler lines. |

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
