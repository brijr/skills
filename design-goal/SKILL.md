---
name: design-goal
description: Audit and refine the entire product interface for intentional spacing, alignment, proportion, and visual hierarchy, tracking coverage until the completion gate. Use when the user runs /design-goal or asks to audit or refine the whole UI across every screen. Not for a single-screen correction, a design-loop campaign against a contract, or product-workflow decisions.
---

# Refine the full interface

Make every in-scope element have intentional spacing, correct alignment, appropriate proportions, and a cohesive visual hierarchy. Work the full interface, not a sample of screens.

This is a *refinement* pass. Keep implementation *batches* small and reviewable without shrinking *coverage*. Continue through the *inventory* until the *completion gate* is met or a genuine execution limit or blocker stops progress.

A single-screen correction belongs to `refactor-ui` when available. An authorized multi-surface campaign against a shared design contract belongs to `design-loop`. Those are routing distinctions, not prerequisites.

## 1. Inventory and track coverage

Read the project's existing instructions. Inspect its framework, styling system, tokens, components, layouts, and verification tools.

Inventory distinct screens, route templates, shared components, feature-specific UI, and overlays. For dynamic routes, use representative records and content conditions.

Include navigation, headers, breadcrumbs, tabs, toolbars, cards, lists, tables, forms, buttons, icons, menus, dialogs, tooltips, empty states, and footers wherever present.

Use the project's existing progress-tracking convention. Otherwise create `UI-PROGRESS.md`.

For each work item record:

- A stable identifier and the relevant routes or files
- Concrete acceptance criteria
- Required viewports, themes, and states
- Status: `pending`, `in progress`, `needs verification`, `verified`, or `blocked`
- Verification evidence or the exact blocker

Start with a usable inventory and begin implementation. Add newly discovered in-scope items as work proceeds. Planning is complete when the first unblocked item can be executed with recorded acceptance criteria. Keep difficult areas in the inventory with their original criteria.

## 2. Inspect the rendered interface

Run the application and inspect actual screens with available browser or screenshot tooling. Review full-page composition and component detail. Source code does not establish that a layout is visually correct.

Capture baseline screenshots where practical. Compare changes using matching viewport sizes, content, themes, and interaction states.

Review shared components in their actual page contexts — a toolbar, narrow panel, or dense form can change how a component reads. When rendering is unavailable, continue useful static work and mark visual verification incomplete.

## 3. Review criteria

Apply every criterion the item can exhibit. Use the project's existing scale and language.

**Spacing and rhythm.** Use the spacing scale consistently. Group related elements; separate distinct sections. Check padding, margins, gaps, gutters, first and last child offsets, doubled spacing, crowding, and excess. Preserve intentional density differences.

**Alignment.** Check leading and trailing edges, columns, text baselines, label/input pairs, control rows, table headers and cells, and action placement. Align icons with accompanying text. Prefer structural alignment; keep optical adjustments small, intentional, and reusable. Preserve intentional asymmetry.

**Sizing and proportion.** Review control dimensions, icon sizes, container widths, text measures, card proportions, image crops, and overlays. Make related controls compatible in height, padding, and visual weight. Tie size differences to role or variant. Prefer layouts that hold longer content and narrower viewports. Keep text and interaction targets usable rather than shrinking them to force a fit.

**Typography and hierarchy.** Review size, weight, line height, letter spacing, wrapping, and alignment. Give page titles, section headings, body, labels, descriptions, and metadata recognizable roles. Check multiline headings, long labels, numerical data, and unusually short or long content. Keep essential content visible and readable.

**Visual balance and consistency.** Review the distribution of content, whitespace, density, and emphasis. Look for competing focal points, disconnected actions, uneven columns, and accidental empty regions. Check borders, radii, shadows, surfaces, and icon treatments against the existing design language. Preserve meaningful differences.

**Responsive behavior and interaction states.** Check narrow, medium, and wide layouts, including widths between existing breakpoints. Verify wrapping, stacking, gutters, alignment changes, overflow, and navigation. Inspect relevant loading, empty, error, disabled, selected, expanded, hover, and focus states. Open menus and dialogs. Check long content, validation messages, and text enlargement. Preserve semantic structure, keyboard access, visible focus, readable contrast, and usable interaction targets.

## 4. Execute in small complete batches

Repeat:

1. Select the highest-priority unblocked item.
2. Inspect its implementation and rendered behavior.
3. Make one coherent improvement, or record that inspection found no change.
4. Verify it against its acceptance criteria.
5. Update the progress file.
6. Continue to the next unblocked item.

Fix shared causes before local symptoms: tokens, shared components, recurring patterns, then screen-specific adjustments. Split oversized work without dropping the original requirements. Include the consumer updates that make a shared fix actually used.

Run relevant automated checks during implementation. Visual changes also require rendered inspection; a successful build does not verify alignment or balance.

Mark implemented but unverified work `needs verification`. An inspected area that needs no changes may be `verified` with evidence. Recheck affected consumers after shared changes. Reopen previously verified items when those changes invalidate their evidence.

## 5. Preserve the existing system

Reuse existing tokens, components, primitives, and styling conventions. Centralize repeated fixes.

Keep the product's visual identity, content, business logic, navigation, intentional design decisions, and existing user changes. When design intent is ambiguous, preserve the current direction and record the uncertainty.

Stay inside a refinement: no new dependencies, styling-stack replacement, unrelated architectural rewrites, weakened tests, disabled checks, or hidden defects.

## 6. Persist progress and continue

After each batch, save what changed and was verified, remaining issues and decisions, the next concrete action, and the commands, routes, or setup needed to resume.

At the start of a resumed session, read the progress file and inspect the current repository state.

Within the authorized scope, continue without asking whether to proceed after every batch. Cover unreviewed areas before re-polishing completed ones. A finished first pass, several improved files, or repetitive remaining work is not completion.

When blocked, record the exact cause and what would unblock it, then continue independent work. Change approach only with new evidence. Respect user stop requests, permissions, and execution or cost limits. When execution must end, save a usable checkpoint and report partial completion as the session outcome.

## 7. Completion gate

Before declaring completion:

- Reconcile the inventory against the original scope.
- Confirm every required item is `verified`, except explicitly user-approved exclusions.
- Perform a final cross-screen consistency review.
- Run available type checks, lint, tests, and builds.
- Distinguish pre-existing failures from regressions.
- Document new or clarified visual conventions in the existing project documentation.

Blocked or unverified required items mean the goal remains incomplete.

Finish with verified versus total work items, improvements made, checks performed, remaining issues, and the exact next action when unfinished. Claim coverage, visual verification, or passing checks only with evidence.
