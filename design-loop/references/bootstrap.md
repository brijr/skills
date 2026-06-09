# Bootstrap (first run only)

Run this once, before the first real iteration, when no `design/` directory exists.

## 1. Generate the constraint system

Use the `ui-constraint-system` skill to produce:
- `design/UI_RULES.md`
- `design/tokens.json`
- `design/PATTERNS.md`

If that skill isn't available, hand-author them, but the constraint system must exist before any surface work. Rules as enforceable specifics ("body is 15px/1.6, never 14 or 16"), not vibes ("prefer readable type").

## 2. The highest-leverage hour: human edits UI_RULES.md

Stop and tell the user this explicitly. The generated rules are a competent default; the human's heavy edit of `UI_RULES.md` is how they program the agent's taste into the system. Every hour spent here saves many hours of gate rejections later. Encourage the user to:
- Delete rules they disagree with.
- Add their non-negotiables (density philosophy, motion stance, brand specifics).
- Point at a reference product they want to feel like, and translate that into rules.

## 3. Create BACKLOG.md

List every UI surface in the product. Rank by how much users actually live in it (the screen they spend the most time on goes first, not the screen that's easiest). Status starts at `todo`.

```
# Backlog

| # | Surface            | Status       | Notes                          |
|---|--------------------|--------------|--------------------------------|
| 1 | Dashboard          | todo         | the screen users live in       |
| 2 | Settings           | todo         |                                |
| 3 | Onboarding         | todo         |                                |

Status values: todo | in-progress | needs-review | done
```

## 4. Create an empty DECISIONS.md

```
# Decisions

Append-only log of human verdicts from the design-loop gate.
Never re-litigate anything recorded here.
```

## 5. Pick the reference slice first

Before fanning out across the backlog, take the #1 surface all the way to world-class in the first iteration. It becomes the reference everything else is judged against (check 12 in the rubric). Depth-first produces a quality benchmark that pulls everything up; breadth-first produces uniform mediocrity.
