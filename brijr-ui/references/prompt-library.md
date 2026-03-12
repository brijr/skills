# UI Prompt Library

Copy-paste prompts for different stages of the workflow. Use with the system prompt active.

---

## Build Prompts

### New Page

```
Build this page in React, Next.js, TypeScript, and shadcn/ui. Follow the system's restrained design language — calm, ordered, spacious, precise. Create hierarchy through spacing, weight, grouping, and alignment rather than type size. Avoid generic dashboard energy, excessive cards, loud accents, and default shadcn styling.
```

### New Component

```
Build this component using shadcn/ui as a base, but refine it so it doesn't look like a default component-library example. Typography disciplined, spacing consistent, interaction states subtle. It should feel like part of an authored product system.
```

### Data-Heavy View (Table, List, Dashboard)

```
Build this data view to feel spacious and refined despite the density. Clean table structure, subtle row separation, readable spacing, minimal controls. Avoid dense enterprise table aesthetics, heavy boxing around filters, and generic admin panel patterns.
```

### Form / Input Screen

```
Build this form to feel clean, quiet, and usable. Subtle field styling, aligned labels and controls, strong spacing between fields, clear focus states, minimal helper text. Avoid noisy form chrome, stacked boxes everywhere, and crowded field layouts.
```

### Empty State

```
Design this empty state to feel intentional and slightly human. Concise copy, thoughtful spacing, restrained icon use, one clear next step. Avoid placeholder-feeling empties, noisy panels, and corporate-sounding filler copy.
```

---

## Refinement Prompts

### Structure Pass

```
Review the layout structure. Focus on spacing, grouping, and alignment before any styling details. The layout should feel calm, ordered, spacious, and intentional. Identify and fix: weak alignment, excessive nesting, too many panels, cramped sections.
```

### Typography Pass

```
Review the typography hierarchy. It should use minimal variation in font sizing — hierarchy comes from weight, spacing, placement, alignment, and contrast between primary and secondary text. Flag: oversized headings, random font sizes, too many weights, dramatic scaling.
```

### Component Unification Pass

```
Review all repeated components and unify them into a small, consistent system. Buttons, inputs, cards, tables, modals, badges, and nav items should feel like the same product language. Remove one-off styling and unnecessary variants.
```

### Noise Reduction Pass

```
Simplify by removing unnecessary visual noise. Target: excessive borders, extra labels, duplicate actions, decorative elements, unnecessary cards, overly segmented layouts. Let spacing and typography create structure before adding visual chrome.
```

### Color Pass

```
Refine the color system so the interface works primarily in neutral tones with restrained accent use. Color is for meaning, not decoration. Flag: random accent colors, colorful widgets, visually loud UI moments. Test: does this still work in grayscale?
```

### Interaction Pass

```
Review hover, focus, selected, loading, and disabled states. They should be subtle, clear, and consistent across all components. Motion should feel smooth and modern but never flashy or playful.
```

### Final Premium Pass

```
Final review: does this feel calm, restrained, structured, spacious, precise, and quietly premium? Check for: generic SaaS dashboard energy, excessive card usage, default component-library styling, unnecessary visual noise. The result should reflect Swiss/Japanese/Scandinavian/German design principles — clarity, reduction, order, function, calm beauty.
```

---

## Review / Critique Prompts

### Quick Critique

```
Critique this UI:
- Does it feel too much like a generic SaaS dashboard?
- Too much visual containment (cards, borders, badges, dividers)?
- Is typography too expressive or too varied in size?
- Is hierarchy from spacing and structure, or from oversized type?
- Does the layout feel calm and ordered?
- Does it feel authored or templated?
Suggest specific refinements.
```

### Redesign Prompt

```
Refine this screen to feel more calm, structured, minimal, and authored. Remove generic SaaS dashboard energy. Reduce visual noise, unify repeated components, simplify color usage, and strengthen hierarchy through spacing and restraint.
```

### Shadcn Adaptation Check

```
Review shadcn/ui components used here. Are any still looking like default shadcn examples? Adapt them into the project's calmer, more restrained design language — subtle borders, restrained radius, minimal shadows, quiet interaction states, consistent spacing.
```

---

## One-Liners

Use these as suffixes or quick context injections.

| Label | Prompt |
|---|---|
| **Ultra-short** | `Calm, restrained product system. Minimal typography variance. Swiss/Japanese/Scandinavian/German design.` |
| **Anti-pattern reminder** | `Avoid: generic dashboard energy, default shadcn styling, excessive cards, loud accents, heavy shadows, large type jumps.` |
| **Hierarchy rule** | `Create hierarchy through weight, spacing, placement, and alignment — not type size.` |
| **Neutral check** | `This should work in grayscale before accent color is added.` |
| **Tone check** | `This should feel authored, not templated. Human, not corporate. Quiet, not busy.` |
