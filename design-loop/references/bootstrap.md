# Bootstrap (first run only)

Run this once, before the first real iteration, when no `design/` directory exists. This procedure is fully self-contained — no other skill is required. Output: `design/POV.md`, `design/tokens.json`, `design/UI_RULES.md`, `design/PATTERNS.md`, `design/BACKLOG.md`, `design/DECISIONS.md`, plus enforcement wiring in the Tailwind theme.

## Phase 1 — Read before writing

Don't touch code yet. Two reads, then a short written point of view.

**Read the codebase the way an editor reads a manuscript:**
- The styling stack: Tailwind version, where theme values live today (`tailwind.config`, `@theme` blocks, CSS custom properties), the dark-mode mechanism (class, media query, next-themes), the component library (shadcn/ui? custom? none?).
- Component patterns: how components are organized, what primitives exist, what gets copy-pasted instead of shared.
- The routing structure and the major surfaces it implies.
- Where state lives and what the build tooling allows.
- **The value audit:** grep the actual font sizes, spacing values, colors, radii, and shadows in use across the code. Count the distinct values. This is the raw material for Phase 2 — the constraint system should be a rationalization of what exists plus the point of view, not an imported alien aesthetic.

**Interrogate the product like a critic:**
- Who uses this, and what's the core loop?
- Which screen do users actually live in?
- Where does the current UI create friction or feel generic?

**Output: `design/POV.md`** — a short written point of view, not a deck. Three sections, under a page total:
1. What this product wants to be visually.
2. What's fighting against that in the current code.
3. The order I'd attack it (this seeds `BACKLOG.md`).

Show the POV to the user before proceeding — everything downstream builds on it.

## Phase 2 — Establish the constraint system before any screens

This is the step most teams skip and it's the whole game. Before redesigning anything visible, codify the rules. Follow `references/constraint-system.md` to derive, from the value audit and the POV:

- `design/tokens.json` — type scale, spacing, color, radius, shadow, motion
- `design/UI_RULES.md` — the rules as enforceable specifics, not vibes
- `design/PATTERNS.md` — an index of the components that already exist
- Enforcement wiring — tokens mapped into the Tailwind theme so the scale is enforced rather than suggested, with the skill's `token-lint.mjs` as the backstop

The test of a good constraint system: a mediocre contributor following it still produces decent UI. Constraints are what make iteration fast later, because every decision downstream becomes smaller.

## The highest-leverage hour: human edits UI_RULES.md

Stop and tell the user this explicitly. The generated rules are a competent default; the human's heavy edit of `UI_RULES.md` is how they program their taste into the system. Every hour spent here saves many hours of gate rejections later. Encourage the user to:
- Delete rules they disagree with.
- Add their non-negotiables (density philosophy, motion stance, brand specifics).
- Point at a reference product they want to feel like, and translate that into rules.

## Create BACKLOG.md

List every UI surface in the product. Rank by how much users actually live in it (the screen they spend the most time on goes first, not the screen that's easiest). The attack order from `POV.md` is the starting point. Status starts at `todo`.

```
# Backlog

| # | Surface            | Status       | Notes                          |
|---|--------------------|--------------|--------------------------------|
| 1 | Dashboard          | todo         | the screen users live in       |
| 2 | Settings           | todo         |                                |
| 3 | Onboarding         | todo         |                                |

Status values: todo | in-progress | needs-review | done
```

## Create an empty DECISIONS.md

```
# Decisions

Append-only log of human verdicts from the design-loop gate.
Never re-litigate anything recorded here.
```

## Phase 3 — The reference slice comes first

Before fanning out across the backlog, take the #1 surface all the way to world-class in the first iteration. Not 80% — all the way: typography tuned, empty states designed, loading states, keyboard interactions, the works. It becomes the reference implementation everything else is judged against (check 12 in the rubric), it proves the constraint system works under real pressure, and it gives everyone a concrete answer to "what does done look like here." Depth-first produces a quality benchmark that pulls everything up; breadth-first produces uniform mediocrity.

## The end state

The bootstrap plus the loop are building toward replaceability. When the backlog is done: the self-review criteria are written down (the rubric), the patterns are documented with do/don't examples, and the decisions log holds the human's taste — so anyone, human or fresh agent session, can produce work at ~90% of the expert's quality without the expert in the room. The constraint system is the deliverable; the redesigned screens are almost a byproduct.
