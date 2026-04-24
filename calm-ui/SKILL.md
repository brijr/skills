---
name: calm-ui
description: Apply a restrained, Swiss/Japanese/Scandinavian/German-influenced product design system when building or refining UI in React, Next.js, TypeScript, and shadcn/ui. Use when the user asks to build, refine, critique, redesign, or review a page, screen, component, form, table, dashboard, layout, or other frontend interface, especially in projects using shadcn/ui. Do not use for marketing sites, landing pages, non-UI work, or requests for bold, playful, maximalist, or otherwise expressive aesthetics.
---

# calm-ui — restrained product design system

This skill is an opinionated constraint system for product UI in React, Next.js, TypeScript, and shadcn/ui. It is not generic guidance. Most rules are prompts to apply when reviewing a screen. A handful — type scale ceilings, radius, shadow, spacing tokens, CSS variable usage — are hard limits. Follow those literally.

## Non-negotiables

1. **Restraint over expression.** Prefer reduction and clarity over visual novelty.
2. **Minimal typography variance.** Hierarchy comes from weight, spacing, placement, alignment, grouping, density, and contrast — not type size jumps.
3. **Calm over busy.** Interfaces feel quiet and easy to scan.
4. **Structure over decoration.** Layout, spacing, and rhythm before visual chrome.
5. **System over one-offs.** Repeated elements follow one consistent pattern.
6. **Neutral first.** The UI works in grayscale before accent color is added.
7. **Shadcn is a foundation, not the final look.** Never ship default-looking shadcn components. See "Components — default vs. refined" below.

## Principles by domain

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
- Prefer tighter tracking and line height while maintaining legibility

### Color

- Neutral tones dominate — use shadcn's CSS variable system (`bg-background`, `text-foreground`, `bg-muted`, etc.)
- Never hardcode Tailwind color classes (`bg-gray-*`, `bg-white`) — this breaks dark mode
- Accent color sparingly and semantically
- Color for meaning, not decoration

### Interaction

- Subtle hover/focus/selected/loading/disabled states
- Smooth transitions, never flashy
- Motion reinforces calmness

### Icons

Lucide React (shadcn's default). One set only. Consistent sizing: `h-4 w-4` inline with text, `h-5 w-5` when stand-alone. Icons support a label, they rarely replace one.

## Anti-patterns

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

## shadcn foundation

shadcn/ui is the component and color baseline. The job is to refine it into the restrained language — not replace it, not ignore it, and not ship it looking stock.

### Always use CSS variables for color

shadcn's theming runs through CSS variables in `globals.css`. This is the color system — and it's what makes dark mode work automatically. Always use the semantic color classes:

```
✅  bg-background  text-foreground  border-border
✅  bg-muted  text-muted-foreground  bg-primary  text-primary-foreground
✅  bg-card  bg-popover  bg-accent  bg-destructive

❌  bg-gray-100  text-gray-500  border-gray-200  bg-white  text-black
```

Hardcoded Tailwind color classes (like `bg-gray-*` or `bg-white`) break dark mode and bypass the design system. If you need a color, it should come from a CSS variable. The only exception is opacity modifiers on semantic colors when needed (e.g., `border-border/50`).

### Tune the theme variables

The first lever for making shadcn not look like default shadcn is adjusting the CSS variables in `globals.css`:

- **`--radius`**: Reduce for a more restrained feel. `0.375rem` or `0.5rem` — not `0.75rem`. shadcn components read from this variable; tune the variable, don't override with `rounded-xl` at the component level.
- **`--border`**: Slightly lower contrast than default. Borders should be felt, not seen.
- **`--primary`**: Keep it understated. It's an accent, not a shout.
- **`--muted`**: The workhorse for subtle backgrounds. Make sure it's actually subtle.

## Components — default vs. refined

For each component type, the refined version is what to produce. The default is shown only so you can recognize it in existing code.

### Card

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

### Button

```tsx
// Default — every action looks equally important
<div className="flex gap-2">
  <Button>Save changes</Button>
  <Button>Cancel</Button>
  <Button>Archive</Button>
</div>

// Refined — one primary, secondaries quiet
<div className="flex items-center gap-2">
  <Button size="sm">Save changes</Button>
  <Button size="sm" variant="ghost">Cancel</Button>
  <Button size="sm" variant="ghost">Archive</Button>
</div>
```

- `size="sm"` (`h-9 px-3`) for most product buttons. `default` is for hero/CTA contexts only.
- One `variant="default"` per screen. Secondary actions use `ghost` or `outline`.
- Labels short, sentence case.

### Table

```tsx
// Default — heavy header, uniform emphasis, loud hover
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ava Chen</TableCell>
      <TableCell>Engineer</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Refined — quiet header, muted secondary columns, subtle hover
<Table>
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="h-9 font-normal text-muted-foreground">Name</TableHead>
      <TableHead className="h-9 font-normal text-muted-foreground">Role</TableHead>
      <TableHead className="h-9 font-normal text-muted-foreground">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/50">
      <TableCell className="py-2">Ava Chen</TableCell>
      <TableCell className="py-2 text-muted-foreground">Engineer</TableCell>
      <TableCell className="py-2 text-muted-foreground">Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

- Header: normal weight, muted, `h-9` row height. Don't bold headers. No header background fill.
- Primary column at full contrast; secondary columns use `text-muted-foreground`.
- `hover:bg-muted/50` — felt, not announced.
- Resist per-column icons, pills, and badges unless they carry data the user actively scans for.

### Form fields

```tsx
// Default — heavy labels, loose rhythm, tall inputs
<div className="space-y-6">
  <div>
    <Label className="text-base font-semibold">Display name</Label>
    <Input className="mt-2" />
  </div>
  <div>
    <Label className="text-base font-semibold">Email</Label>
    <Input className="mt-2" />
  </div>
</div>

// Refined — understated labels, tight rhythm
<div className="space-y-4">
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">Display name</Label>
    <Input className="h-9" />
  </div>
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">Email</Label>
    <Input className="h-9" />
  </div>
</div>
```

- `space-y-4` between fields; `space-y-1.5` label-to-input.
- Labels `text-sm font-medium` — readable but quiet.
- Helper text below input in `text-xs text-muted-foreground`, one line max.
- No per-field borders, no card-per-field.

### Navigation

- Predictable placement; label-driven, not icon-only
- Active state through weight or a single 1px marker — never both
- No background fill on inactive items
- One navigation pattern per app; don't mix tabs, sidebars, and breadcrumbs on the same screen without reason

## Design tokens

Starting points for the restrained feel. Rows marked **(hard)** are enforced; others are defaults you can deviate from with reason.

| Property | Guidance |
|---|---|
| **Type scale** | **(hard)** `text-xs` through `text-lg` in product UI. `text-xl` for page titles only. No `text-2xl`+. |
| **Font weights** | 2–3 weights max per screen (e.g. `font-normal`, `font-medium`). Avoid `font-bold` and heavier. |
| **Section spacing** | `space-y-6` or `gap-6` between major sections |
| **Group spacing** | `space-y-2` or `gap-2` within related items |
| **Page padding** | `p-4` on mobile, `p-6` or `px-6 py-8` on desktop |
| **Border radius** | **(hard)** Set `--radius` to `0.375rem`–`0.5rem` in `globals.css` and let shadcn components inherit. Don't override with `rounded-xl` or `rounded-full` on containers. |
| **Shadows** | **(hard)** `shadow-sm` sparingly, or none. Never `shadow-lg`+. No tinted/colored shadows. |
| **Border weight** | Default `border` (1px). Use `border-border` or `border-border/50` for subtler lines. |
| **Button height** | `size="sm"` (h-9) in product UI; `default` for hero/CTA only. |
| **Color** | **(hard)** Only shadcn CSS-variable classes. No `bg-gray-*`, `bg-white`, `text-black`. |

## Dark mode

shadcn's CSS variables handle dark mode automatically. The refinement is in how restrained the dark palette stays — dark mode is where calm aesthetics most easily fall apart.

- **CSS variables everywhere.** Hardcoded colors break dark mode. This is the single largest source of dark-mode bugs.
- **Borders go lower contrast in dark mode, not higher.** Reach for `border-border/50` more often than `border-border`.
- **Elevation reads through surface lightness, not drop shadow.** In dark mode, a slightly lighter `bg-card` or `bg-muted` is the signal of "raised." Keep shadows at `shadow-sm` or remove.
- **No tinted shadows in either mode.** Colored shadows are loud. Restraint says grayscale.
- **Grayscale check both themes.** Toggle dark mode and ask: does hierarchy still read? If it only reads because of accent color, the hierarchy is wrong.

## Responsive and density

Calm at desktop often becomes cramped at mobile. Preserve rhythm, not grid.

- **Reduce horizontal padding, preserve section spacing.** `p-4 md:p-6` on containers. Keep `space-y-6` between sections; don't collapse to `space-y-3` just to fit.
- **Columns collapse to single column.** Don't fight to keep a 3-column grid at 375px.
- **Tables: pick one mobile strategy.** Either horizontal scroll (simplest, preserves structure) or collapse to a card list (better for scan-heavy small-screen reads). Don't do both.
- **Button labels stay full.** Icon-only buttons only when the icon is universally understood (close, search, menu) — otherwise the label stays.
- **No mobile-only novelty.** A bottom sheet that exists only at mobile is still a design decision. Skip it unless it earns its place; don't add mobile chrome for its own sake.
- **Touch targets: `h-9` is the floor.** Below that, taps become imprecise. Button `size="sm"` meets this; smaller is a mistake.

## Workflow

When building or refining UI, do these in order.

1. **Structure** — layout, spacing, grouping, alignment
2. **Typography** — restrained hierarchy, weight over size
3. **Component refinement** — adapt shadcn into the calm design language
4. **Unification** — make repeated patterns feel cohesive
5. **Noise reduction** — strip anything that doesn't earn its place
6. **Color** — neutral system with semantic accents
7. **Interaction** — polish states subtly
8. **Final check** — run the pre-ship checklist below

Do not jump ahead. If you are about to write JSX without a clear answer to steps 1 and 2, stop and go back.

## Pre-ship checklist

Answer yes to each before finishing. If any is no, revise.

- Does this feel calm at first glance, or busy?
- Is hierarchy coming from spacing, weight, and alignment — not type size jumps?
- Is there a clear primary action per screen, row, or card?
- Does every badge, border, divider, and card earn its place?
- Does the UI read in grayscale? Does it still read in dark mode grayscale?
- Are all colors from CSS variables (no `bg-gray-*`, no `bg-white`)?
- Does mobile preserve section spacing and rhythm?
- Are type scale, radius, and shadow within the hard limits?
- Does this feel authored — or templated?

## References

Task-specific copy-paste prompts (build, refinement passes, critiques, one-liners):
→ `references/prompt-library.md`

Condensed portable version of the rules for pasting into a CLAUDE.md in other projects:
→ `references/system-prompt.md`
