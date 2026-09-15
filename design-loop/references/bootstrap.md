# Bootstrap (first run only)

Run this once, before the first real iteration, when `/design.md` does not exist. This procedure is fully self-contained — no other skill is required.

Output:

- `/design.md` — canonical design contract
- `/design.dark.md` — optional, only when dark-mode token values materially differ
- `design/BACKLOG.md` — ranked surface queue
- `design/DECISIONS.md` — append-only human verdict log

Bootstrap establishes the contract before surface implementation. Resolve substantial undecided choices; existing authorization for the direction remains valid.

## Phase 1 — Read before writing

Don't touch implementation files yet. Read the product and codebase like an editor reads a manuscript.

**Read the codebase:**
- Styling stack: Tailwind version, theme location (`tailwind.config`, `@theme` blocks, CSS custom properties), dark-mode mechanism (class, media query, next-themes), component library (shadcn/ui? custom? none?).
- Component patterns: how components are organized, what primitives exist, what gets copy-pasted instead of shared.
- Routing structure and the major surfaces it implies.
- State and build tooling constraints that affect UI work.
- **Value audit:** grep actual font sizes, spacing values, colors, radii, shadows, durations, and component dimensions in use. Count distinct values. The contract should rationalize the product's current visual material, not import an alien aesthetic.

**Interrogate the product:**
- Who uses this, and what's the core loop?
- Which screen do users actually live in?
- Where does the current UI create friction or feel generic?
- What should the product absolutely not feel like?

## Phase 2 — Draft `/design.md`

Follow [contract schema](constraint-system.md) to write a Vercel-style document:

- YAML frontmatter for token scales and component defaults
- Markdown guidance for product point of view, usage rules, component patterns, states, motion, voice/content, quality bar, references, and anti-references

The draft should be opinionated. Do not ask the user to invent taste from a blank page. Infer a strong default from the product and current code, then make the assumptions explicit in the document.

The test of a good `/design.md`: a mediocre contributor — or a fresh agent session with no memory of this conversation — can follow it and produce decent UI without supervision.

## Phase 3 — Create operational state

Create `design/BACKLOG.md`.

List the authorized UI surfaces; include the whole product only when that scope is requested. Rank by how much users actually live in it: the screen they spend the most time on goes first, not the easiest screen.

```md
# Backlog

| # | Surface   | Status | Notes                    |
|---|-----------|--------|--------------------------|
| 1 | Dashboard | todo   | the screen users live in |
| 2 | Settings  | todo   |                          |
| 3 | Onboarding| todo   |                          |

Status values: todo | in-progress | needs-review | done
```

Create `design/DECISIONS.md`.

```md
# Decisions

Append-only log of human verdicts from the design-loop gate.
Never re-litigate anything recorded here.
```

## Phase 4 — Resolve contract decisions

Present the concrete contract and identify only material unresolved choices about references, density, color, or layout. Pause dependent work when a decision is needed or the user requested review. Continue when the direction is already authorized. Do not require a new taste questionnaire for a settled direction.

## Phase 5 — The reference slice comes first

After `/design.md` is accepted or edited, take the #1 surface all the way to world-class in the first iteration. Not 80% — all the way: typography tuned, empty states designed, loading states, keyboard interactions, the works.

That surface becomes the reference implementation everything else is judged against, proves the contract works under real pressure, and gives everyone a concrete answer to "what does done look like here." Depth-first produces a quality benchmark that pulls everything up; breadth-first produces uniform mediocrity.
