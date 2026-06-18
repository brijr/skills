# Writing the `/design.md` contract

`/design.md` is the single canonical design contract. It combines machine-readable token data with human-readable product guidance, similar to Vercel's Geist design document.

Inputs: the bootstrap value audit, product read, existing component inventory, and any user-provided references.

## 1. Use this document shape

```md
---
version: alpha
name: <Product Design System>
description: <one-sentence product design direction>
colors:
  primary: "#171717"
typography:
  copy-14:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
spacing:
  1: 4px
rounded:
  sm: 6px
shadow:
  low: "0 1px 2px rgba(0, 0, 0, 0.04)"
motion:
  fast: 120ms
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    typography: "{typography.button-14}"
    rounded: "{rounded.sm}"
---

# <Product>

## Overview
## Product Point Of View
## Colors
## Typography
## Layout
## Components
## States
## Motion
## Voice & Content
## Quality Bar
## References
## Anti-References
## Do's and Don'ts
```

Adapt token names to the project. The contract is that every visual value used by implementation traces back to `/design.md` or optional `/design.dark.md`.

## 2. Rationalize the audit into scales

The audit found many distinct font sizes, spacing values, colors, and component dimensions. Keep fewer. Every value you keep is a decision someone else never has to make again.

- **Type:** 5-8 named tokens, each with family, size, line height, weight, and letter spacing when needed. Separate single-line labels from multi-line copy if the product needs both.
- **Spacing:** one base unit, usually 4px, with 8-10 named steps. Off-scale values found in the audit become migration work, not exceptions.
- **Color:** neutrals first. Add one accent plus semantic colors for success, warning, danger, links, and focus when needed. Express values in the format the stack already uses.
- **Radius / shadow:** 2-3 of each plus `full`. More than that and shape/elevation stop meaning anything.
- **Motion:** 2-3 durations and 1-2 easings. State when motion should be avoided.
- **Components:** write ready-to-use defaults for common controls: buttons, inputs, cards, menus, dialogs, tables, and empty states when they exist.

If dark-mode values materially differ, create `/design.dark.md` using the same token names with dark values. If dark mode can be described as usage guidance over the same tokens, keep it in `/design.md`.

## 3. Write enforceable guidance

Rules must be specific enough to verify from a screenshot or grep.

Good:
- "Data tables use 36px rows and `copy-13` unless the content is prose."
- "Only the primary action on a view may use a solid accent fill."

Bad:
- "Prefer readable type."
- "Use tasteful spacing."

Include these sections:

- **Overview:** one paragraph on what the product should feel like.
- **Product Point Of View:** what the product wants to be visually, what currently fights that, and the attack order.
- **Colors:** token intent and how color carries meaning.
- **Typography:** where each type token is allowed.
- **Layout:** density, spacing rhythm, columns, alignment, responsive rules.
- **Components:** component defaults and do/don't notes for patterns already present.
- **States:** empty, loading, error, disabled, hover, focus, active, overflow.
- **Motion:** when motion clarifies change and when it is forbidden.
- **Voice & Content:** labels, button text, errors, toasts, empty states, loading copy.
- **Quality Bar:** what "done" means for screenshots and reviews.
- **References / Anti-References:** concrete products or screens and the exact qualities to borrow or avoid.
- **Do's and Don'ts:** short bullets agents can apply during implementation.

## 4. Wire enforcement

The project config should enforce the contract rather than merely suggest it:

- Tailwind v4: define contract values as custom properties in the `@theme` block where the project allows it.
- Tailwind v3: map contract values into `theme` rather than extending broad defaults when feasible.
- CSS-only stacks: expose contract values as CSS custom properties.
- The skill's `token-lint.mjs` is the backstop: arbitrary bracket values, raw colors, and inline px fail the mechanical gate unless they live in `/design.md`, `/design.dark.md`, CSS token definitions, or token-backed `var(...)` references.

## 5. Keep the contract alive

New reusable patterns are added during the loop's promote step, not speculatively. If the same judgment call keeps coming up during reviews, the contract is missing a rule. Promote that decision into `/design.md` so the agent gets it right unprompted next time.
