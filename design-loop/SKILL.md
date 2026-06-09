---
name: design-loop
description: Run one iteration of the AI design engineer loop on a UI surface — pick a surface from the backlog, implement it against the project's constraint system, render and screenshot it, critique it against the rules, fix until it passes, then promote any reusable patterns and stop at a human review gate. Use this whenever the user types /design-loop, asks to "run the design loop", "redesign this screen against the system", "take this surface to world-class", or wants to iterate a UI surface through the token/critique/promote cycle. Also use when the user references their UI_RULES.md, tokens.json, PATTERNS.md, DECISIONS.md, or BACKLOG.md and asks to advance the design work.
---

# Design Loop

Run ONE iteration of the design engineer loop on ONE surface, then stop at the human gate. The session boundary is the iteration boundary — fresh context, read state from disk, do the work, write state back, stop. This keeps every run auditable in git and resumable later.

The taste lives in files, not in this skill. This skill is the *procedure*; the project's `design/` files are the *point of view*. Never invent design opinions here — read them from the system files. If they don't exist yet, bootstrap them first (see "Bootstrap" below).

## The state files

Everything the loop needs lives in a `design/` directory at the repo root. Read ALL of these at the start of every run:

- `design/UI_RULES.md` — the constraint system and philosophy, as enforceable rules
- `design/tokens.json` — type scale, spacing, color, radius, shadow, motion values
- `design/PATTERNS.md` — component library index with do/don't examples
- `design/DECISIONS.md` — append-only log of human verdicts; never re-litigate anything here
- `design/BACKLOG.md` — surfaces ranked by importance, with status per surface

If a `design/` directory does not exist, do NOT guess. Tell the user and offer to bootstrap (the `ui-constraint-system` skill generates `UI_RULES.md`, `tokens.json`, and `PATTERNS.md`; this skill adds `DECISIONS.md` and `BACKLOG.md` — see `references/bootstrap.md`).

## Running one iteration

Work through these steps in order. Do not skip the screenshot step — an agent that can't see its own work can only be consistent, not good.

### 1. Load state and pick the surface

Read all five state files. Then determine the target surface:
- If the user named a surface, use it.
- Otherwise read `BACKLOG.md` and take the highest-priority surface whose status is `todo` or `in-progress`.
- Restate which surface you're working on and its current status before touching code.

Mark the surface `in-progress` in `BACKLOG.md` if it isn't already.

### 2. Implement

Build or refactor the surface against the constraint system. Hard requirements:
- Use ONLY token values. No arbitrary Tailwind values (`p-[13px]`, `text-[#333]`), no off-scale spacing, no hex colors outside `tokens.json`. The lint script enforces this — but write it right the first time.
- Follow `PATTERNS.md`. If a pattern exists for what you're building, use it; don't reinvent it.
- Design the full surface, not the happy path: empty states, loading states, error states, keyboard interaction, focus order. The reference-quality bar is "all the way," not 80%.

### 3. Render and screenshot

Render the surface and capture screenshots so you can critique what actually shows up, not what you intended.
- Run `node scripts/screenshot.mjs <url> <out-dir>` (see `scripts/screenshot.mjs`). It captures light + dark mode at desktop (1280px) and mobile (390px) widths — four shots.
- If the project has Playwright MCP or `claude --chrome` available, you may drive the browser directly instead; the requirement is four screenshots covering both themes and both breakpoints.
- View each screenshot before critiquing. You must actually look at the images.

### 4. Critique against the rules

Two layers, both required. Write the results to `design/reviews/<surface>-<timestamp>.md`.

**Mechanical layer (zero judgment, ruthless):** run `node scripts/token-lint.mjs <changed-files>`. Any arbitrary value, off-scale spacing, or non-token color is an automatic fail. No exceptions.

**Taste layer (vision rubric):** score each screenshot against the checklist in `references/critique-rubric.md` and against the reference slice if one exists. Each check gets pass/fail + a one-line reason. The default rubric covers hierarchy, spacing rhythm, alignment, state coverage, dark-mode parity, and fidelity to the reference. The project's `UI_RULES.md` may add checks — honor those too.

### 5. Fix or pass

- If anything failed: fix it and return to step 3. Re-render, re-screenshot, re-critique. Loop until clean.
- The ratchet rule: you may NEVER relax a rule to make a surface pass. If a rule genuinely seems wrong, leave the surface failing and flag the conflict for the human gate. Quietly eroding constraints is the failure mode this whole system exists to prevent.

### 6. Promote reusable patterns

Before declaring the surface done, check: did I build anything that already exists elsewhere in near-identical form, or that another surface will obviously need?
- If yes: extract it into a shared component, add it to `PATTERNS.md` with a do/don't note, and refactor the call sites.
- This is the step that makes the system compound. Without it you get N nice screens; with it the design system gets stronger every iteration.

### 7. Stop at the human gate

Do NOT mark the surface `done` yourself. Instead:
- Write a short handoff: what changed, the four screenshots, the critique results, any patterns promoted, and any rule conflicts you flagged.
- Set the surface to `needs-review` in `BACKLOG.md`.
- Present the screenshots to the user and ask for a verdict.

When the user responds with a verdict:
- Append it verbatim to `DECISIONS.md` with date and surface (use the format in `references/decisions-format.md`).
- If the verdict implies a general rule ("tables should always use 36px rows"), propose adding it to `UI_RULES.md` so the system remembers it forever and the gate rejects less next time.
- Update `BACKLOG.md`: `done` if approved, back to `in-progress` with the noted fixes if not.

## What this looks like to the user

```
$ claude
> /design-loop

[reads design/ state files]
Working on: Settings page (priority 2, status: todo). Marking in-progress.
[implements, renders, screenshots, critiques, fixes once]
Token lint: clean. Taste rubric: 11/12 pass — empty state for the
integrations list was missing, added it.
Promoted: <EmptyState> extracted to PATTERNS.md, refactored 2 call sites.
Surface set to needs-review. Here are the four screenshots — verdict?

> looks good but the section headers are too heavy, drop to weight 500

[appends verdict to DECISIONS.md, proposes UI_RULES.md change,
 fixes, sets surface to done]
```

One surface per session. Fresh context next time. The git history becomes the audit trail of the redesign.

## Bootstrap (first run only)

If `design/` doesn't exist, see `references/bootstrap.md`. The short version: generate the constraint system with the `ui-constraint-system` skill, then create `BACKLOG.md` (list every surface, rank by how much users live in it, status `todo`) and an empty `DECISIONS.md`. The highest-leverage moment in the whole engagement is the human editing the generated `UI_RULES.md` — that edit is how the human programs the agent's taste. Encourage it.
