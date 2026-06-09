# Deriving the constraint system

How to produce `tokens.json`, `UI_RULES.md`, and `PATTERNS.md` from the codebase itself, standalone. Inputs: the Phase 1 value audit and `design/POV.md`. The system rationalizes what already exists, steered by the POV — it does not import an alien aesthetic.

## 1. Rationalize the audit into scales

The audit found N distinct font sizes, spacing values, and colors. The system keeps far fewer. Collapse to the fewest steps that cover real use — every value you keep is a decision someone else never has to make again.

- **Type:** 5–7 steps, each with a paired line-height and allowed weights. One body size, committed to ("body is 15px/1.6, never 14 or 16").
- **Spacing:** one base unit (usually 4px), 8–10 steps. Off-scale values found in the audit map to the nearest kept step; the survivors become migration work for the loop, not exceptions to the scale.
- **Color:** neutrals ramp first — most of the UI is neutrals. One accent, plus semantic colors (success / warning / danger). Name them semantically where it matters (`bg`, `fg`, `muted`, `border`, `accent`) on top of the raw ramp. Express values in whatever format the stack already uses (hex, oklch).
- **Radius / shadow:** 2–3 of each plus `full`. More than that and elevation stops meaning anything.
- **Motion:** 2–3 durations, 1–2 easings.
- **Density** is a philosophy, not a token: a data tool is tight, a marketing page breathes. The POV decides; write the decision into `UI_RULES.md`.

## 2. Write tokens.json

```json
{
  "type": {
    "scale": {
      "caption": { "size": "12px", "lineHeight": "1.4" },
      "body":    { "size": "15px", "lineHeight": "1.6" },
      "heading": { "size": "20px", "lineHeight": "1.3", "weight": 600 }
    }
  },
  "space": { "base": "4px", "steps": [4, 8, 12, 16, 24, 32, 48, 64] },
  "radius": { "sm": "4px", "md": "8px", "full": "9999px" },
  "shadow": { "low": "…", "high": "…" },
  "color": {
    "neutral": { "50": "…", "900": "…" },
    "semantic": { "bg": "…", "fg": "…", "muted": "…", "border": "…", "accent": "…" }
  },
  "motion": { "fast": "120ms", "slow": "240ms", "ease": "cubic-bezier(0.2, 0, 0, 1)" }
}
```

Adapt the shape to the project; the contract is that every visual value the code uses traces back to this file.

## 3. Wire enforcement

The config should enforce the scale rather than suggest it:
- **Tailwind v4:** define the tokens as custom properties in the `@theme` block, replacing (not extending) the default scales where the project allows it.
- **Tailwind v3:** map tokens into `theme` (not `theme.extend`) so off-scale utilities don't exist.
- The skill's `token-lint.mjs` is the backstop: arbitrary bracket values, raw colors, and inline px fail the mechanical gate. Custom-property definitions and `var(--…)` references pass — tokens have to be born somewhere.

## 4. Write UI_RULES.md

Rules as enforceable specifics, not vibes. Each rule must be checkable from a screenshot or a grep.

- Good: "Body text is 15px/1.6. Never 14 or 16."
- Bad: "Prefer readable type."

Sections: Type, Spacing & density, Color, Layout, Components, States, Dark mode, Motion. Seed 3–6 rules per section from the POV and the audit. Then hand it to the human — their edit of this file is the highest-leverage hour in the engagement (see `bootstrap.md`).

## 5. Write PATTERNS.md

Record what exists; don't invent. At bootstrap this is an index of the components already in the codebase:

```
## EmptyState
When: any list/table/collection that can be empty.
Where: components/empty-state.tsx
Do: one-line explanation + primary action.
Don't: bare "No items found" text.
```

New patterns are added by the loop's promote step (step 6), never speculatively. If a pattern entry goes unused across several surfaces, the loop proposes deleting it.

## The test

A mediocre contributor — or a fresh agent session with no memory of this conversation — following these files produces decent UI without supervision. If the same judgment call keeps coming up during the loop, that's a missing rule: promote it into `UI_RULES.md`.
