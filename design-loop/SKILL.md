---
name: design-loop
description: Run the AI design-engineer loop on a product's UI, fully standalone. If the repo has no design/ system yet, bootstrap one from the codebase itself — read the code and product, write a point of view (POV.md), derive the constraint system (tokens.json, UI_RULES.md, PATTERNS.md) from the values already in use. Then run one iteration per session — pick a surface from the backlog, implement it against the tokens, screenshot light/dark at desktop and mobile widths, critique against the rules, fix until clean, promote reusable patterns, and stop at a human review gate. Use whenever the user types /design-loop, asks to "run the design loop", "redesign this screen against the system", "take this surface to world-class", "bootstrap a design system for this app", or references their design/ state files (POV.md, UI_RULES.md, tokens.json, PATTERNS.md, DECISIONS.md, BACKLOG.md) and asks to advance the design work.
---

# Design Loop

This skill is a complete design-engineering engagement, run one session at a time. The arc:

1. **Read before writing** — understand the codebase and the product before touching code; write a short point of view (`design/POV.md`).
2. **Constraint system before screens** — codify type, spacing, color, radius, shadow, and motion as enforceable artifacts. This is the step most teams skip, and it's the whole game: constraints make every downstream decision smaller.
3. **One vertical slice to world-class** — take the single most important surface all the way. It becomes the reference implementation everything else is judged against.
4. **Systematize outward** — the loop. Surface by surface, refactor onto the system; the system absorbs the learnings, not just the individual screens.
5. **Make yourself replaceable** — the rules, rubric, patterns, and decisions all live in files. The constraint system is the deliverable; the redesigned screens are almost a byproduct.

Phases 1–3 happen once, at bootstrap (see below). After that, every session runs ONE iteration on ONE surface and stops at the human gate. The session boundary is the iteration boundary — fresh context, read state from disk, do the work, write state back, stop. This keeps every run auditable in git and resumable later.

The taste lives in files, not in this skill. This skill is the *procedure*; the project's `design/` files are the *point of view*. Never invent design opinions mid-loop — read them from the system files. The loop is what keeps you honest; the constraint system is where conviction lives. Most failed engagements have one without the other — endless tasteful exploration that never ships, or fast shipping with no point of view. This process holds both at once.

## The state files

Everything the loop needs lives in a `design/` directory at the repo root. Read ALL of these at the start of every run:

- `design/POV.md` — the written point of view: what this product wants to be visually, what's fighting against that in the current code, the attack order
- `design/UI_RULES.md` — the constraint system and philosophy, as enforceable rules
- `design/tokens.json` — type scale, spacing, color, radius, shadow, motion values
- `design/PATTERNS.md` — component library index with do/don't examples
- `design/DECISIONS.md` — append-only log of human verdicts; never re-litigate anything here
- `design/BACKLOG.md` — surfaces ranked by importance, with status per surface

If `design/` does not exist, bootstrap it — this skill is fully standalone and generates everything itself from the codebase and the product. See `references/bootstrap.md` for the procedure and `references/constraint-system.md` for how to derive the tokens and rules. Do not start surface work without the system.

## Running one iteration

Work through these steps in order. Do not skip the screenshot step — an agent that can't see its own work can only be consistent, not good.

### 1. Load state and pick the surface

Read all six state files. Then determine the target surface:
- If the user named a surface, use it.
- Otherwise read `BACKLOG.md` and take the highest-priority surface whose status is `todo` or `in-progress`.
- Restate which surface you're working on and its current status before touching code.

Mark the surface `in-progress` in `BACKLOG.md` if it isn't already.

### 2. Implement

Build or refactor the surface against the constraint system. Hard requirements:
- Use ONLY token values. No arbitrary Tailwind values (`p-[13px]`, `text-[#333]`), no off-scale spacing, no raw colors outside the token definitions. Token-backed references like `w-[var(--sidebar-width)]` are fine. The lint script enforces this — but write it right the first time.
- Follow `PATTERNS.md`. If a pattern exists for what you're building, use it; don't reinvent it.
- Design the full surface, not the happy path: empty states, loading states, error states, keyboard interaction, focus order. The reference-quality bar is "all the way," not 80%.

### 3. Render and screenshot

Render the surface and capture screenshots so you can critique what actually shows up, not what you intended.
- Run `node scripts/screenshot.mjs <url> <out-dir>` using the script's path inside this skill's directory. It captures light + dark mode at desktop (1280px) and mobile (390px) widths — four shots. It handles both `prefers-color-scheme` and class-based dark mode (it sets `.dark` on `<html>` and seeds the next-themes localStorage key).
- If the project has Playwright MCP or `claude --chrome` available, you may drive the browser directly instead (useful when the surface is behind auth); the requirement is four screenshots covering both themes and both breakpoints.
- View each screenshot before critiquing. You must actually look at the images.

### 4. Critique against the rules

Two layers, both required. Write the results to `design/reviews/<surface>-<timestamp>.md`.

**Mechanical layer (zero judgment, ruthless):** run `node scripts/token-lint.mjs <changed-files>` using the script's path inside this skill's directory. Any arbitrary value, off-scale spacing, or raw color is an automatic fail. CSS custom-property definitions (where tokens are born) and `var(--…)` references pass. No other exceptions.

**Taste layer (vision rubric):** score each screenshot against the checklist in `references/critique-rubric.md` and against the reference slice if one exists. Each check gets pass/fail + a one-line reason. The default rubric covers hierarchy, spacing rhythm, alignment, state coverage, dark-mode parity, and fidelity to the reference. The project's `UI_RULES.md` may add checks — honor those too.

### 5. Fix or pass

- If anything failed: fix it and return to step 3. Re-render, re-screenshot, re-critique. Loop until clean.
- The ratchet rule: you may NEVER relax a rule to make a surface pass. If a rule genuinely seems wrong, leave the surface failing and flag the conflict for the human gate. Quietly eroding constraints is the failure mode this whole system exists to prevent.

### 6. Promote and prune

Before declaring the surface done, make the system absorb what this iteration learned:
- Did I build anything that already exists elsewhere in near-identical form, or that another surface will obviously need? If yes: extract it into a shared component, add it to `PATTERNS.md` with a do/don't note, and refactor the call sites.
- The inverse, too: if a token or pattern has gone unused across several surfaces, propose deleting it at the gate. The design system stays a living thing rather than a museum.
- This is the step that makes the system compound. Without it you get N nice screens; with it the design system gets stronger every iteration.

### 7. Stop at the human gate

Do NOT mark the surface `done` yourself. Instead:
- Write a short handoff: what changed, the four screenshots, the critique results, any patterns promoted or prunes proposed, and any rule conflicts you flagged.
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

If `design/` doesn't exist, follow `references/bootstrap.md`. It is fully self-contained:

1. **Read before writing** — read the codebase like an editor reads a manuscript (styling stack, component patterns, routing, the actual values in use) and interrogate the product (who uses it, the core loop, where the UI fights itself). Write `design/POV.md`.
2. **Derive the constraint system** — follow `references/constraint-system.md` to rationalize the audited values into `tokens.json`, write `UI_RULES.md` as enforceable specifics, index existing components into `PATTERNS.md`, and wire the tokens into the Tailwind theme so the scale is enforced, not suggested.
3. **Create `BACKLOG.md`** (every surface, ranked by where users actually live) and an empty `DECISIONS.md`.

The highest-leverage moment in the whole engagement is the human editing the generated `UI_RULES.md` — that edit is how the human programs the agent's taste. Encourage it. Then take the #1 surface to world-class first — depth-first produces a quality benchmark that pulls everything up; breadth-first produces uniform mediocrity.
