---
name: clean-up
description: Make a just-finished fix or feature belong in the codebase — conform it to local conventions and tie off loose ends, without changing behavior. Triggers right after the user finishes a change and says things like "clean this up", "make it fit", "tie off loose ends", "make this maintainable", "make it fit the codebase". Operates only on the recent diff and the files it touched. Do not use for greenfield code, for general code-quality passes on untouched code unrelated to a recent change (use thermo-nuclear-code-quality-review for strict structural review), for product/UX rework of existing screens or flows that predate this change (use `product-design`), for designing something new (use `software-design`), or while the feature is still unfinished — finish it first; this pass preserves behavior, it does not add it.
---

# clean-up — make the change belong

The code works. This pass makes it look like it was always meant to be there: matching the conventions of the code around it, with no scaffolding, dead ends, or "clearly bolted on" smell left behind.

This is **not** a generic code-quality pass or strict structural review (use `thermo-nuclear-code-quality-review` for that) and **not** a product/UX rework of pre-existing screens or flows (that is `product-design`). It is scoped to the change you just made and how that change sits next to its neighbors.

## When to use

The user has just finished a fix or feature and wants it integrated cleanly. The signal is "make this fit / tie this off", not "make the codebase better" and not "add more behavior".

## The one rule

**Behavior must not change.** Every phase checks against this. It is what keeps this pass from sprawling into a rewrite. If a finding can't be addressed without changing what the code does, it is out of scope — report it, don't do it.

---

## Phase 1 — Pin the blast radius

Run `git diff` against the base branch and `git status` for untracked files. Enumerate exactly what changed and the set of files touched.

**Freeze the scope here:** the diff, plus conforming edits *within* those touched files. Anything outside that set is reported, never edited.

State the frozen scope back to the user in one line before continuing.

## Phase 2 — Learn local conventions (silent)

For each touched file, read its neighbors — sibling files, the module it lives in, nearby tests. Note how that local code does: naming, error handling, import style, file layout, logging, test patterns, control flow.

The standard is "look like the code next to you," not a global style guide. Convention is local. Don't report this phase — use it.

## Phase 3 — Findings checklist (hard gate)

Produce one categorized list. Apply nothing yet.

- **Loose ends** — dead code, debug logs, commented-out blocks, orphaned imports, temp/placeholder names, unused params, leftover TODO stubs, half-applied patterns, scaffolding from working the problem.
- **Convention mismatches** — where the change reads foreign next to its neighbors (naming, error handling, structure, imports).
- **Duplication** — logic the change copied that already exists, or near-identical blocks that should be hoisted.
- **Misplacement** — code sitting in the wrong file or module for what it does.

For each item: `file:line`, what it is, why it's a loose end or mismatch, and the proposed fix.

**Stop. Wait for the user to approve or trim the list.** The checklist is also the scope-creep guardrail — nothing not on the approved list gets touched.

## Phase 4 — Apply

Apply only approved items. Re-check the behavior-unchanged rule on every edit. If applying an item would change behavior, skip it and say so.

List anything deliberately left because it fell outside the frozen scope.

## Phase 5 — Verify

Discover the project's verification commands — check `package.json` scripts, `Makefile`, `CLAUDE.md`, `README`. Run typecheck, lint, and tests.

Report green or red explicitly. If red, the pass is not finished: fix it within scope, or roll back the offending edit and report it.

## Closing summary

- What was tied off and conformed.
- What was deliberately left, and why.
- Verification result (the actual command output status).
- Out-of-scope loose ends flagged for a separate pass.
