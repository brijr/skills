---
name: design-loop
description: Run the AI design-engineer loop on a product's UI, fully standalone. If the repo has no /design.md contract yet, bootstrap one from the codebase itself: read the product and styling stack, draft a Vercel-style design.md with token frontmatter and human guidance, create the loop state files, ask targeted taste questions, and stop for human review. After that, run one iteration per session: read /design.md, pick a surface from the backlog, write a surface brief and reference-calibrated quality target, implement against the contract, screenshot light/dark at desktop and mobile widths, critique against the rules, make one bold revision if needed, promote reusable patterns back into /design.md, and stop at a human review gate. Use whenever the user types /design-loop, asks to "run the design loop", "redesign this screen against the system", "take this surface to world-class", "bootstrap a design system for this app", or references /design.md, design.dark.md, BACKLOG.md, DECISIONS.md, design briefs, or review artifacts and asks to advance the design work.
---

# Design Loop

This skill is a complete design-engineering engagement, run one session at a time. The arc:

1. **Read before writing** — understand the codebase, product, and current UI values before touching implementation.
2. **Canonical contract before screens** — create or read `/design.md`, a Vercel-style design contract with machine-readable token frontmatter and human-readable usage guidance.
3. **Quality target before code** — each surface gets a short design brief and reference calibration before implementation starts. The agent must know the user job, primary object, hierarchy, density, and what to remove.
4. **One vertical slice to world-class** — take the single most important surface all the way. It becomes the reference implementation everything else is judged against.
5. **Systematize outward** — the loop. Surface by surface, refactor onto the contract; the contract absorbs the learnings, not just the individual screens.
6. **Make yourself replaceable** — tokens, rules, patterns, decisions, briefs, and reviews live in files. The design contract is the deliverable; the redesigned screens are almost a byproduct.

Bootstrap happens once. The first iteration then takes one reference slice all the way; after that, every session runs ONE iteration on ONE surface and stops at the human gate. The session boundary is the iteration boundary — fresh context, read state from disk, do the work, write state back, stop. This keeps every run auditable in git and resumable later.

Taste lives in `/design.md`, not in this skill. This skill is the *procedure*; `/design.md` is the *point of view and contract*. Never invent design opinions mid-loop — read them from the contract. The loop is what keeps you honest; the contract is where conviction lives. Most failed engagements have one without the other: endless tasteful exploration that never ships, or fast shipping with no point of view. This process holds both at once.

## The state files

At the repo root, `/design.md` is required. It is the canonical design contract and contains:

- YAML frontmatter for tokens and component defaults: `version`, `name`, `description`, `colors`, `typography`, `spacing`, `rounded`, `shadow`, `motion`, and `components`
- Markdown guidance for product point of view, color usage, type, layout, components, states, motion, voice/content, quality bar, do/don't rules, references, and anti-references

Optional:

- `/design.dark.md` — only when dark-mode tokens materially differ from `/design.md`

Operational loop state lives under `design/`:

- `design/BACKLOG.md` — surfaces ranked by importance, with status per surface
- `design/DECISIONS.md` — append-only log of human verdicts; never re-litigate anything here
- `design/briefs/` — per-surface quality targets
- `design/reviews/` — screenshot critiques and gate handoffs

If `/design.md` does not exist, bootstrap it. See `references/bootstrap.md` and `references/constraint-system.md`. Do not start surface work without the contract.

## Running one iteration

Work through these steps in order. Do not skip the quality target or screenshot steps — an agent that has not named what great looks like before code, and cannot see its own work after code, can only be consistent, not good.

### 1. Load the contract and pick the surface

Read `/design.md`, `/design.dark.md` if present, `design/BACKLOG.md`, and `design/DECISIONS.md`. Then determine the target surface:
- If the user named a surface, use it.
- Otherwise read `design/BACKLOG.md` and take the highest-priority surface whose status is `todo` or `in-progress`.
- Restate which surface you're working on and its current status before touching code.

Mark the surface `in-progress` in `design/BACKLOG.md` if it isn't already.

### 2. Write the surface brief and quality target

Before touching implementation files, follow `references/surface-quality.md`.

Write `design/briefs/<surface>-<timestamp>.md` with:
- user job, primary object, and primary action
- intended information hierarchy and density target
- 1-3 reference products, screens, or approved in-repo surfaces, plus anti-references
- what to remove, quiet, and sharpen
- non-negotiables from `/design.md`, `design/DECISIONS.md`, and the approved reference slice

If the brief conflicts with `/design.md`, `design/DECISIONS.md`, or the user's explicit direction, stop and flag the conflict before implementing. Do not resolve taste conflicts silently.

### 3. Implement

Build or refactor the surface against the design contract. Hard requirements:
- Use ONLY token values from `/design.md` or `/design.dark.md`. No arbitrary Tailwind values (`p-[13px]`, `text-[#333]`), no off-scale spacing, no raw colors outside token definitions. Token-backed references like `w-[var(--sidebar-width)]` are fine. The lint script enforces this — but write it right the first time.
- Follow component defaults and pattern guidance in `/design.md`. If a pattern exists for what you're building, use it; don't reinvent it.
- Design the full surface, not the happy path: empty states, loading states, error states, keyboard interaction, focus order. The reference-quality bar is "all the way," not 80%.
- Implement toward the brief. The primary object should be visually clear, the primary action should be easier to find than secondary actions, and unnecessary containers or decorative chrome should be removed rather than restyled.

### 4. Render and screenshot

Render the surface and capture screenshots so you can critique what actually shows up, not what you intended.
- Run `node scripts/screenshot.mjs <url> <out-dir>` using the script's path inside this skill's directory. It captures light + dark mode at desktop (1280px) and mobile (390px) widths — four shots. It handles both `prefers-color-scheme` and class-based dark mode (it sets `.dark` on `<html>` and seeds the next-themes localStorage key).
- In Codex, if the Browser plugin is available, prefer opening the surface URL in the in-app Browser for authenticated or user-visible review flows. Keep the four-screenshot requirement; Browser can satisfy it only when you can capture the same light/dark × desktop/mobile evidence there.
- If the project has Playwright MCP or `claude --chrome` available, you may drive the browser directly instead (useful when the surface is behind auth); the requirement is four screenshots covering both themes and both breakpoints.
- View each screenshot before critiquing. You must actually look at the images.

### 5. Critique against the contract and quality target

Three layers are required. Write the results to `design/reviews/<surface>-<timestamp>.md`.

**Mechanical layer (zero judgment, ruthless):** run `node scripts/token-lint.mjs <changed-files>` using the script's path inside this skill's directory. Any arbitrary value, off-scale spacing, or raw color outside token definition files is an automatic fail. CSS custom-property definitions and `var(--...)` references pass. No other exceptions.

**Taste layer (vision rubric):** score each screenshot against the checklist in `references/critique-rubric.md`, the surface brief, `/design.md`, and the reference slice if one exists. Each check gets pass/fail + a one-line reason. The default rubric covers hierarchy, spacing rhythm, alignment, state coverage, dark-mode parity, necessary chrome, mobile composition, and fidelity to the reference. `/design.md` may add checks — honor those too.

**Design critique layer (quality ceiling):** follow `references/surface-quality.md` and answer: strongest part, weakest part, what feels generic, what is visually noisy, weakest hierarchy decision, what should be removed, what should be made more precise, and one bold improvement.

### 6. Fix, revise, or pass

- If anything failed: fix it and return to step 4. Re-render, re-screenshot, re-critique. Loop until clean.
- If the surface is mechanically clean but the design critique names unresolved genericness, noise, or weak hierarchy: make one bold structural revision from `references/surface-quality.md`, then return to step 4. Tiny color, radius, or shadow tweaks do not count as the bold revision unless the brief specifically made that the quality target.
- If the first pass already matches the quality target, the review must say why before skipping the bold revision.
- The ratchet rule: you may NEVER relax `/design.md` to make a surface pass. If a rule genuinely seems wrong, leave the surface failing and flag the conflict for the human gate. Quietly eroding constraints is the failure mode this whole system exists to prevent.

### 7. Promote and prune

Before declaring the surface done, make the contract absorb what this iteration learned:
- Did I build anything that already exists elsewhere in near-identical form, or that another surface will obviously need? If yes: extract it into a shared component, add the component defaults or pattern guidance to `/design.md`, and refactor the call sites.
- The inverse, too: if a token or pattern has gone unused across several surfaces, propose deleting it at the gate. The design contract stays a living thing rather than a museum.
- This is the step that makes the system compound. Without it you get N nice screens; with it the design contract gets stronger every iteration.

### 8. Stop at the human gate

Do NOT mark the surface `done` yourself. Instead:
- Write a short handoff: the surface brief, reference target, what changed, the four screenshots, the critique results, the bold revision made or explicitly skipped with reason, any contract updates or prunes proposed, and any rule conflicts you flagged.
- Set the surface to `needs-review` in `design/BACKLOG.md`.
- In Codex, if the Browser plugin is available, open the same final reviewed surface URL used for the screenshots in the in-app Browser, make it visible to the user, and leave it on that review page before asking for a verdict. Follow the Browser plugin's control instructions for visibility. If auth blocks the page, ask the user to sign in there; do not route around the Browser gate.
- Present the screenshots to the user and ask for a verdict.

When the user responds with a verdict:
- Append it verbatim to `design/DECISIONS.md` with date and surface (use the format in `references/decisions-format.md`).
- If the verdict implies a general rule ("tables should always use 36px rows"), propose adding it to `/design.md` so the contract remembers it forever and the gate rejects less next time.
- Update `design/BACKLOG.md`: `done` if approved, back to `in-progress` with the noted fixes if not.

## What this looks like to the user

```
$ claude
> /design-loop

[reads /design.md and design/ state files]
Working on: Settings page (priority 2, status: todo). Marking in-progress.
[writes brief: Stripe-like settings hierarchy, tight density, remove card clutter]
[implements, renders, screenshots, critiques, makes one bold hierarchy revision]
Token lint: clean. Taste rubric: 15/15 pass. Design critique: first pass was
too card-heavy; removed nested panels and promoted the workspace name as anchor.
Promoted: SettingsSection pattern added to /design.md.
Surface set to needs-review. Here are the four screenshots — verdict?

> looks good but the section headers are too heavy, drop to weight 500

[appends verdict to design/DECISIONS.md, proposes /design.md change,
 fixes, sets surface to done]
```

One surface per session. Fresh context next time. The git history becomes the audit trail of the redesign.

## Bootstrap (first run only)

If `/design.md` doesn't exist, follow `references/bootstrap.md`. It is fully self-contained:

1. **Read before writing** — read the codebase like an editor reads a manuscript (styling stack, component patterns, routing, the actual values in use) and interrogate the product (who uses it, the core loop, where the UI fights itself).
2. **Draft `/design.md`** — follow `references/constraint-system.md` to rationalize audited values into token frontmatter and write human guidance for product point of view, usage rules, components, states, motion, voice, quality bar, references, and anti-references.
3. **Create loop state** — create `design/BACKLOG.md` and `design/DECISIONS.md`.
4. **Stop for human review** — ask targeted taste questions and tell the user that editing `/design.md` is the highest-leverage step before surface work.

Then take the #1 surface to world-class first. Depth-first produces a quality benchmark that pulls everything up; breadth-first produces uniform mediocrity.
