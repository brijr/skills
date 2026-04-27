---
name: refactor-ui
description: Refactor an existing piece of UI by diagnosing visible problems, asking a few meaning-focused questions (not aesthetic ones), proposing a ranked plan, then editing the code. Use when the user points at a specific component, screen, or pattern — via image, code file, or both — and asks to refactor, improve, clean up, or make it better. Do not use for green-field UI design (use frontend-design or calm-ui), for writing components from scratch, or for design reviews without edits.
---

# refactor-ui — diagnose-then-edit refactoring for existing UI

This skill is a *process*, not a design system. "Refactor this UI" without context usually produces generic cleanup that misses the point. The questions this skill asks are about **meaning** — what the UI is for, what matters, what's locked. Aesthetic direction is a single neutral question, not the main event.

## Inputs

The user gives you one or more of:

- **an image** of a UI (screenshot, mock, Figma export)
- **a component file path** (or a directory of components)
- **both** — preferred, because diagnosis is sharper with the image and edits require the code

If the input is image-only and the user wants edits, ask where the code lives before Phase 3. If the user explicitly wants code written from an image with no existing source, say so and proceed — but that's closer to `frontend-design` than a refactor.

## The four phases

Run in order. Don't skip, don't merge them into a wall of text. Each phase produces a distinct visible step for the user.

### Phase 1 — Observe (silent)

Build an internal list of visible issues from the inputs. Look for:

- **Hierarchy mismatch** — the most prominent element isn't the most important
- **Redundancy** — two or three signals saying overlapping things (badge + icon + text), multiple actions doing the same job
- **Ambiguity** — labels that don't state what they mean ("Ready Apr 23" — ready for what?), unlabeled icons, unclear states
- **Machine data leaking through** — UUIDs, raw filenames, ISO timestamps, internal category names shown to end users
- **Action overload** — >2 actions on a row/card without a clear primary
- **Alignment drift** — things almost-aligned, mixed grids, inconsistent padding
- **Density** — over-chromed chrome, card-on-card-on-card, unnecessary containers
- **Noise** — metadata that doesn't serve the user's task

Also flag these structural signals — they require upstream questions before any visual fix makes sense:

- **Multi-user signal** — the screen has mixed read/write controls, role-specific labels (reviewer, attorney, manager), or actions that only make sense to certain people
- **Workflow signal** — there's a hidden state machine: status badges suggesting sequence, handoff actions ("submit for review", "return to reviewer"), or a concept of "whose turn it is"
- **Conceptual model mismatch** — the layout reflects the data model rather than the user's mental model (e.g. four parallel form cards that are actually sequential steps, or the same concept appearing in two places with different representations)
- **Affordance mismatch** — editable controls (forms, dropdowns) are visible to users who shouldn't edit; the screen's affordances don't match its actual permissions

If any of these are present, the Phase 2 questions must address them before visual issues. Fixing spacing on a screen that serves three users badly is waste.

This list is raw material for Phase 2 and 3. Do not dump it unfiltered on the user.

### Phase 2 — Diagnose and ask

Output one block with this shape:

```
**What I'm noticing**
- <concrete issue, naming the real element — not "the header could be better">
- <3–6 items, stop when you run out of real observations>

**Before I refactor, a few questions**
1. **Meaning** — What does <this element> represent to the user, and what's the primary thing they do from it?
2. **Signal vs. noise** — Of the visible elements (<name them: "Draft badge, OCR ready badge, filename, Ready date, View, Details, pin, overflow menu">), which matter to users, and which could be hidden, moved to a detail view, or dropped?
3. **What's locked?** — What can't change: data shape, API contract, component library, copy/translations, URL structure, analytics events?
4. **Aesthetic direction** — Existing design system or reference to match? Link, file, or product. If none, I'll default to restrained/calm.
```

**If multi-user or workflow signals were flagged in Phase 1**, replace or extend Q1 with these before asking about visual elements:

```
1. **Users** — Who uses this screen? List the roles. For each: what is the one thing they need to accomplish here?
2. **Workflow** — Is there a handoff sequence? If so: who has the "baton" right now, what action passes it, and can it go backwards?
3. **Role-aware affordances** — Should all users see the same controls, or should editability and visible actions change based on role or workflow state?
```

Work through these conversationally — don't ask all three at once if the first answer makes the others obvious. The goal is to answer: **whose screen is this, and what is it for, right now?** Only after that does visual diagnosis matter.

Rules for the questions:

- **Tailor Q2 (signal/noise) to the actual elements in the input.** Generic "what matters to users?" is useless. Name the specific badges, fields, and actions you can see.
- **Don't ask more than 4–5 questions total.** If multi-user questions consume the slot, drop or defer the visual ones.
- **Never ask aesthetic questions beyond the direction question.** No "rounded or sharp corners?", no "what color palette?". Those are not refactor drivers.
- **Ask one thing at a time if the user is thinking through the problem.** A screen serving multiple users is often genuinely unclear to its owners — give them space to work it out.

### Phase 3 — Propose a specific plan

Once answers are in, produce a plan concrete enough that the user can evaluate it without seeing code. Each item must name:

- **What changes** — which element, section, or component
- **What it becomes** — the specific UI element or component pattern to use (not "add a status indicator" — "replace the Work Status column with a sticky `<header>` bar using `Badge` + muted text in a single row")
- **Why** — one clause referencing the user's answer

Format:

```
**Refactor plan**

Layout
- <structural change> — use <specific element/component/pattern> — <why>

Components
- <component name>: <what it is, what props/states it has, what existing primitives it's built from>
- ...

Sequence
1. Build <X> first — it's the foundation for <Y>
2. Then <Y>
...
```

Rules for Phase 3:

- **Name the element.** "A sticky case header" is not enough. "A `<header>` with `position: sticky; top: 0` containing condition name, posture `Badge`, and last-decision `<time>`" is.
- **Name existing primitives.** If the repo has shadcn/ui, say which components you'll use (`Badge`, `Separator`, `Select`, etc.). If you'll build something new, say so explicitly and why existing ones don't fit.
- **Show the component tree for new or restructured sections.** A short indented list is enough:
  ```
  <CaseHeader>           ← always visible, sticky
  <WorkflowStepper>      ← whose turn indicator
  <ActionArea>           ← role + state aware
    <ReviewerForm>       ← editable pillars (reviewer only)
    <AttorneyReview>     ← read-only pillars + approve/return (attorney only)
  ```
- **Name states.** If a component has multiple states (reviewer turn / attorney turn / returned), list them. Don't make the user infer.
- **Rank by build sequence**, not just impact. Structural shells before content, shared primitives before the things that use them.
- **3–7 items.** More than 7 means scope is too wide — narrow with the user before proceeding.

Show the plan. **Wait for explicit approval or adjustments. Do not touch the code until the user approves.**

### Phase 4 — Edit

On approval:

- Reuse existing components, design tokens, and utilities (`cn`, CSS variables, shared primitives). Don't invent new color palettes, typography scales, or component abstractions unless asked.
- Match the surrounding code style — if the repo uses shadcn/ui with Tailwind CSS variables, use those. Don't hardcode colors.
- Change copy when copy is the problem. Don't restyle ambiguous labels — rewrite them.

After editing, report in 1–2 lines per file:

```
**Changed**
- <file:line> — <what and why, terse>

**Didn't change**
- <anything the user might have expected to change and why you left it> (omit if nothing)
```

## Design of Everyday Things lens

When a screen is genuinely complex — multiple users, workflow state, mixed read/write — run it through these DOET questions before proposing any structural change. They cut faster than visual inspection.

1. **Conceptual model** — What mental model does this screen communicate? Does it match what each user expects to find? A screen that reflects the data model instead of the user's model will always feel wrong, no matter how well styled.
2. **Affordances** — Do the controls suggest the right actions to the right people? Form fields and dropdowns imply editability. If a user can't actually edit, those affordances mislead.
3. **Feedback / current state** — Can a user land on this screen and immediately answer "what needs to happen now, and is it my job?" If not, workflow state isn't surfaced — it's buried.
4. **Mapping** — Do related things live together? If the same concept appears in two places with different representations (e.g. a status summary at the top and a full form below), the mapping is broken.
5. **Gulf of evaluation** — Is the most important fact (case status, whose turn, what's blocked) the most visually prominent thing? If the user has to scan to find it, the hierarchy is inverted.

Use these as a diagnostic checklist, not a framework to explain to the user. The output is a clearer Phase 3 plan.

## Rules of taste (defaults for Phase 3 and Phase 4)

Apply when the user hasn't specified direction. Override any of these if the user's aesthetic answer conflicts.

1. **Primary action wins.** One action per row/card/screen gets visual weight. Secondary actions demote to links, overflow menus, or hover-reveal.
2. **One status pattern, not two.** Badge + muted text + icon all saying related things → pick one pattern and unify.
3. **Human data replaces machine data.** UUIDs, raw filenames, ISO timestamps → derived titles, relative time, tooltip for the raw value.
4. **Hierarchy from weight and placement, not size jumps.** 2–3 font weights > 5 font sizes.
5. **Ambiguous labels get rewritten, not restyled.** "Ready Apr 23" → "Uploaded Apr 23" or "Processed Apr 23". Fix the words first.
6. **Cut more than you add.** A good refactor removes visual weight net.
7. **Preserve what works.** Don't restyle things that weren't called out unless they block the change.

## Anti-patterns

- **Skipping Phase 2.** "Make this better" without meaning-context produces generic cleanup.
- **Aesthetic question stacking.** One question about direction is enough. If the user gave you a design-system link, don't also ask about colors, corners, and spacing.
- **Inventing new components or tokens** when existing ones would work.
- **Scope creep.** "While I was in here I also cleaned up…" — no. Stay inside what was asked.
- **Before/after essays.** The post-edit report is 1–2 lines per file, not a narrative.
- **Refactoring from image alone** when the code exists and the user has access to it. Ask for the code.

## Worked example — document row

**Input:** image of a file list row containing a machine-generated filename, a `Draft` badge, an `OCR ready` badge, `Ready Apr 23, 2026`, and `View` / `Details` / pin / `…` actions.

**Phase 2 output:**

> **What I'm noticing**
> - The filename is a machine-generated blob (`02540-VA 21-0966 Intent to File-20170303-7BFF…`); it has the most visual weight but the least readable content
> - Two status signals split across the row, styled differently: `Draft` (badge, left) and `OCR ready` + `Ready Apr 23, 2026` (badge + muted text, right)
> - Four competing actions with no clear primary: `View`, `Details`, pin, `…`
> - `Ready Apr 23, 2026` is ambiguous — ready for what?
> - `Other · 108.0 KB` — "Other" reads like an unclassified category; may be noise
>
> **Before I refactor, a few questions**
> 1. **Meaning** — What does this row represent: a doc the user uploaded, a doc received from the VA, a task awaiting action? And what's the primary thing they do from it — open it, check status, or something else?
> 2. **Signal vs. noise** — Of `Draft`, `OCR ready`, the filename, the date, `Other`, `108.0 KB`, `View`, `Details`, pin, and `…`: which matter to users, and which could move to a detail view or be dropped?
> 3. **What's locked?** — Can the filename be replaced with a derived title? Are `Draft` and `OCR ready` fixed copy from the backend, or can the wording change? Is the UI on shadcn/ui or custom components?
> 4. **Aesthetic direction** — Existing design system or reference? If not, I'll default to restrained/calm.

Phase 3 produces a ranked plan shaped by those answers. Phase 4 edits the component. The report at the end names every file touched and flags anything deliberately left alone.

## Worked example — multi-user case management screen

**Input:** screenshot of a case detail screen with a two-column layout. Left column: "Objective snapshot" card, a "Strategy" section with four editable sub-cards (Diagnosis, Service event, Continuity, Severity — each with a Status dropdown and Notes textarea), plus Reviewer notes and Attorney notes fields at the bottom. Right column: a Work Status summary (Strategy state, Evidence state), a Pending proposals panel, and an Evidence panel. Header shows condition name, posture (Denied), and last decision date.

**Phase 1 flags:**
- Multi-user signal: "Reviewer notes" and "Attorney notes" are separate fields — implies two distinct roles
- Workflow signal: "Submit for attorney" button implies a handoff; "Strategy" appears in both the Work Status column (read-only) and the main left card (editable)
- Conceptual model mismatch: the four sub-cards are parallel in layout but likely sequential in the review process; the internal data model is showing through
- Affordance mismatch: form fields and dropdowns are visible regardless of role or workflow state

**Phase 2 output (multi-user track):**

> **What I'm noticing**
> - "Strategy" appears twice — as a small read-only summary top-right and as a full editable form below-left. Same concept, two representations, no clear relationship
> - The four sub-cards (Diagnosis, Service event, Continuity, Severity) are identical in shape but aren't equal options — they appear to be components of a case argument, not parallel choices
> - The most important fact (Denied, Unrated, Aug 3 2021) is the smallest text on the screen
> - A user landing here can't immediately tell: is it my turn? What do I need to do?
>
> **Before I go further — a few questions about users and workflow**
> 1. **Users** — Who uses this screen? For each role, what's the one thing they need to accomplish here?
> 2. **Workflow** — Is there a handoff sequence between roles? Can it go backwards (e.g. attorney returns to reviewer)?
> 3. **Affordances** — Should the four sub-cards be editable for all roles, or only for the reviewer?

**After answers (reviewer → attorney → optional return, manager always read-only, attorney never edits pillars):**

> **Refactor plan**
>
> Layout
> - Replace the two-column layout with a single-column shell: sticky `<CaseHeader>` → `<WorkflowStepper>` → `<ActionArea>` — eliminates the duplicate Strategy representation and makes workflow state the primary signal
>
> Components
> - `<CaseHeader>`: sticky `<header>` (`position: sticky; top: 0`), contains condition name + posture `Badge` (variant: destructive for Denied) + `<time>` for last decision. Read-only for all roles.
> - `<WorkflowStepper>`: horizontal row of three `Badge` nodes (Reviewer → Attorney → Complete) connected by `<Separator>`. Active node uses default variant, inactive uses outline, completed uses secondary. Driven by `workflowState` prop.
> - `<ActionArea>`: renders one of three children based on `role` + `workflowState`:
>   - `<ReviewerForm>` (reviewer + reviewer-turn): four `<PillarCard>` sub-components each with a `<Select>` for status and `<Textarea>` for notes; Reviewer notes `<Textarea>` below; "Submit for attorney" primary `<Button>`
>   - `<AttorneyReview>` (attorney + attorney-turn): same four `<PillarCard>`s but all fields `disabled`; reviewer notes surfaced as read-only `<blockquote>`; two actions — "Approve" primary `<Button>` + "Return to reviewer" outline `<Button>`
>   - Manager view: `<CaseHeader>` + `<WorkflowStepper>` only; no `<ActionArea>` rendered
> - `<PillarCard>`: reusable card wrapping a pillar (title, description, `<Select status>`, `<Textarea notes>`). Accepts `readOnly` prop — disables both fields and removes border affordance when true.
>
> Build sequence
> 1. `<CaseHeader>` — foundation, no dependencies
> 2. `<WorkflowStepper>` — needs workflow state enum defined first
> 3. `<PillarCard>` with `readOnly` prop — shared by both form and review views
> 4. `<ReviewerForm>` using four `<PillarCard readOnly={false}>`
> 5. `<AttorneyReview>` using four `<PillarCard readOnly={true}>`
> 6. `<ActionArea>` — composes 4 + 5 with role/state switching logic
> 7. Remove old two-column layout and Work Status column

The plan doesn't touch visual polish until structural role/workflow issues are resolved. Phase 4 edits components only after this is approved.
