---
name: redesign
description: Guided UI redesign intake and critique for pointed-at product surfaces. Use when the user writes /redesign, says "redesign this", "what should change about this UI", asks Codex or Claude to critique a screenshot, browser-visible screen, component, route, dashboard, form, workflow, or small UI fragment, or wants questions plus suggestions before implementation. Ground in visible UI evidence, apply Design of Everyday Things principles, ask targeted redesign questions, suggest concrete UX/UI changes, and stop at a redesign brief or handoff. Do not use for full product redesign engagements with /design.md state files (use design-loop), approved implementation plans (use product-design, calm-ui, or ui-principles as appropriate), or non-UI code work.
---

# Redesign

Use this skill when the user points at a piece of UI and wants a better redesign conversation before code. The job is to turn a vague "make this better" into:

1. what the surface appears to be trying to help someone do
2. what the current design is making harder than it should be
3. which questions actually change the redesign direction
4. a concrete redesign brief or implementation handoff

Default behavior is critique, questions, and direction. Do not edit code, emit patches, or produce implementation unless the user explicitly approves a follow-up implementation step.

## Relationship to adjacent UI skills

- `redesign` owns the first pass: pointed-at UI, diagnosis, targeted questions, and redesign direction.
- `product-design` owns deeper product critique plus an approved implementation plan for an existing product experience.
- `calm-ui` owns React, Next.js, TypeScript, and shadcn visual/interface execution after direction is clear.
- `ui-principles` owns framework-agnostic visual/interface execution after direction is clear.
- `design-loop` owns full product redesign systems with `/design.md`, surface briefs, screenshots, critiques, and human gates.

If the user asks to implement after the redesign brief, name the right handoff path instead of silently switching modes.

## Required reference

For every substantive `/redesign` critique, read [references/everyday-things.md](references/everyday-things.md). Use it as the principle lens, not as a checklist to dump into the answer.

## Workflow

### 1. Ground in the actual surface

Inspect the evidence the user gave:

- screenshot, video frame, current browser state, or image attachment
- route, URL, component, story, or file path
- observed copy, labels, controls, states, layout, data, and visual hierarchy
- product docs or issue context if the user includes them

If no UI evidence is available, ask for the missing screenshot, URL, route, or component. If evidence is partial, proceed with explicit assumptions and ask only for the context that changes the redesign.

State the apparent frame before critiquing:

- user or role
- job the surface seems to support
- primary object
- primary action
- current workflow state or "whose turn is it"

### 2. Diagnose through everyday-things principles

Use the reference to identify the highest-impact issues. Prioritize:

1. wrong or confusing conceptual model
2. unclear affordances or signifiers
3. poor feedback about current state, progress, or result
4. weak mapping between controls, objects, and consequences
5. missing constraints or error prevention
6. gulfs of execution or evaluation
7. hierarchy, trust, accessibility, and state coverage problems

Tie every finding to visible evidence or a stated assumption. Do not lead with generic taste such as "add more whitespace" unless it directly supports the user's task.

### 3. Ask targeted redesign questions

Ask at most three questions. Each question must satisfy all three conditions:

- it is based on something observed in the UI
- the answer would change the redesign direction
- it is specific enough that the user can answer quickly

Good questions:

- "Should the user decide row-by-row, or is this screen mainly for approving the whole import?"
- "Is the destructive action supposed to be available before validation finishes?"
- "Which user is this empty state for: a first-time account owner or an operator who expected data?"

Bad questions:

- "What vibe do you want?"
- "Do you like the colors?"
- "Should this be modern?"

If the answer is helpful but not blocking, continue with the strongest assumption and label it.

### 4. Suggest the redesign moves

Produce concrete recommendations in product language. Prefer structural changes over decoration:

- rename raw labels into user-facing language
- group controls with the object they affect
- make one primary action obvious and demote the rest
- separate valid, invalid, loading, empty, error, disabled, success, and permission states
- add progressive disclosure for dangerous or advanced actions
- move risk, provenance, timing, and consequences near the decision point
- remove redundant containers, badges, copy, or competing actions

Use visual-system advice only after the task structure is clear. Visual changes should explain what they clarify.

### 5. End with a brief or handoff

Use this response shape:

```text
**Apparent frame**
- User:
- Job:
- Primary object:
- Primary action:

**What should change**
- <finding tied to evidence> - <principle> - <redesign move>

**Questions that change the redesign**
- <only if useful; max 3>

**Redesign brief**
- <the implementable direction in a few bullets>

**Handoff**
- <product-design, calm-ui, ui-principles, or design-loop path if implementation or a larger loop is next>
```

Keep answers compact. The user asked for direction, not a lecture.

## Handoff rules

- Use `product-design` next when the redesign needs a full product critique and approved implementation plan.
- Use `calm-ui` next when the direction is clear and implementation is in React, Next.js, TypeScript, or shadcn.
- Use `ui-principles` next when the direction is clear and implementation is framework-agnostic.
- Use `design-loop` next when the user wants to redesign a whole product or create a durable `/design.md` contract.

## Anti-patterns

- Editing code during the first `/redesign` response.
- Asking a broad questionnaire instead of questions from the observed design.
- Critiquing color, rounded corners, or spacing before the user job is clear.
- Treating the screenshot as decoration instead of as an interaction model.
- Listing every principle from the reference instead of using the few that matter.
- Producing a generic "make it cleaner" recommendation with no object, action, or state.
