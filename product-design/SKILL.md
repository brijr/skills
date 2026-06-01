---
name: product-design
description: Product design critique and approved implementation workflow for existing product experiences. Use when the user writes `/product-design`, asks for a product design critique, UX critique, Design of Everyday Things / DOET review, critique-and-implement pass, or wants to improve a screen, flow, route, dashboard, form, onboarding, workflow, or product experience. Ground in screenshots, browser state, routes, code, docs, and product context; critique first, propose a concrete implementation plan, then wait for approval before editing. Do not use for pure visual styling without product intent (use calm-ui), greenfield UI creation, or behavior-preserving cleanup after a finished change (use clean-up).
---

# product-design — critique, plan, then implement

Use this skill to improve an existing product experience, not just its visual polish. Diagnose what the product is asking the user to understand or do, critique that experience through a practical UX and *Design of Everyday Things* lens, then propose implementation changes. Do not edit until the user approves the plan.

## Relationship to adjacent UI skills

- `product-design` owns product intent, workflow, user role, state, copy, trust, accessibility, and the critique/approval loop for an existing experience.
- `calm-ui` owns restrained visual/interface execution for React, Next.js, TypeScript, and shadcn/ui. Use its constraints during implementation when the approved plan needs visual refinement.
- `craft-ds` owns creating or maintaining the single-file `components/ds.tsx` design-system contract. Use it only when the approved plan requires that artifact.

Do not let visual-system rules replace the product critique. The product finding comes first; visual polish supports it.

## Inputs

The user may provide any of:

- screenshot, mock, video, or current browser state
- local route, app URL, component file, or directory
- product area or workflow name
- product docs, PRD, issue, or rough intent

If the user provides only a screenshot and wants implementation, ask where the code lives after the critique unless the repo makes it obvious. If the user gives only a vague product area, inspect the repo and ask one targeted question if the primary flow is still ambiguous.

## Workflow

### Phase 1 — Ground in product context

Inspect before critiquing. Use the available evidence:

- screenshots or browser-visible state
- route structure, components, copy, data states, and action handlers
- nearby docs, PRDs, issues, README, analytics/event names, and tests
- existing design system primitives, tokens, and UI conventions

Identify the product frame:

- target user or role
- job-to-be-done
- primary action
- workflow state and "whose turn is it"
- product promise or success outcome
- locked constraints: data shape, API contract, permissions, copy/legal, design system, analytics, URL structure

Do not report raw exploration unless it changes the recommendation.

### Phase 2 — Critique

Lead with concrete product findings, not aesthetic preference. Tie each finding to observed UI/code/product evidence.

Use this lens:

- **Conceptual model**: Does the screen teach the right mental model, or expose the data model?
- **Affordances and signifiers**: Do controls suggest the right actions to the right users?
- **Feedback and current state**: Can users tell what happened, what is happening, and what is next?
- **Mapping**: Are related actions, labels, status, and objects placed where users expect them?
- **Constraints and error prevention**: Does the UI prevent invalid or destructive mistakes before they happen?
- **Gulf of execution**: Is it obvious how to accomplish the user's goal?
- **Gulf of evaluation**: Is it obvious whether the user's action worked?
- **Hierarchy and information scent**: Is the most important thing easiest to find?
- **Trust and confidence**: Does the experience explain risk, provenance, timing, or consequences where needed?
- **Accessibility and resilience**: Does the flow work with keyboard, screen readers, small screens, loading, empty, error, and permission states?

Prioritize findings by product impact:

1. blocked primary task or misleading model
2. wrong action available to the wrong user or state
3. unclear status, feedback, or consequence
4. noisy hierarchy, redundant signals, or ambiguous copy
5. visual polish that supports the above

### Phase 3 — Ask only blocking questions

Ask at most three questions, and only when the answer materially changes the implementation plan. Prefer questions about:

- user/role and the primary job
- workflow sequence or ownership
- constraints that cannot be inferred from code
- what must not change

Do not ask generic aesthetic questions. If no design direction is given, default to a restrained, product-focused UI that preserves local conventions.

### Phase 4 — Propose implementation

Produce a plan concrete enough to approve without reading code. Include:

- prioritized product changes and why they matter
- affected route/component area
- component or layout shape to use
- states to support: loading, empty, error, success, permission, read-only, destructive, mobile
- existing primitives/tokens to reuse
- copy changes when language is the issue
- verification commands or browser checks

Stop here and wait for explicit approval before editing.

Use this shape:

```text
**Product critique**
- <finding tied to evidence and UX principle>

**Implementation plan**
- <specific change> — <component/pattern> — <why>

**Questions**
- <only if blocking>
```

### Phase 5 — Implement after approval

When the user approves:

- edit narrowly to the approved plan
- reuse existing components, tokens, utilities, and route patterns
- fix ambiguous copy instead of decorating it
- avoid new abstractions unless they remove real product complexity
- preserve API/data/permission contracts unless approval included changing them
- verify with relevant tests/checks and browser inspection when frontend behavior changed

Report changed files and verification results briefly.

## Defaults

- One primary action per view or workflow step.
- Status should answer: what state is this in, what does it mean, and what should happen next?
- Read-only things should not look editable.
- Dangerous actions need explicit consequence and recovery cues.
- Remove redundant signals before adding new UI.
- Prefer human product language over raw database labels, enum values, IDs, or timestamps.
- Use hierarchy, grouping, and placement before bigger type or heavier chrome.
- Preserve local design language unless it conflicts with product clarity.

## Anti-patterns

- Critiquing colors, spacing, or card shape before understanding the user's job.
- Treating a screenshot as the whole product when route/code/docs are available.
- Asking broad "what do you want?" questions instead of naming the specific ambiguity.
- Shipping implementation without approval after critique.
- Adding decorative explanation text that describes the UI instead of making the UI clearer.
- Inventing new design primitives when local ones fit.
- Expanding scope into unrelated screens or flows without calling it out.
