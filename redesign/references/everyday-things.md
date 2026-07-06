# Everyday-Things Redesign Lens

Use this reference to inspect a UI the way a person experiences an everyday object: what it seems to do, how it invites action, how it responds, and how it prevents avoidable mistakes.

## Conceptual model

What to inspect: page title, object names, navigation, grouping, copy, data labels, and whether the screen teaches a product model or exposes an implementation model.

Question it should provoke: "What does the user think this thing is, and does that match how it actually works?"

Failure signs:
- raw database labels, enums, IDs, or system statuses become the main language
- the user must infer how objects relate before acting
- the page title promises one thing while the controls operate on another

Typical redesign moves:
- rename objects in user language
- introduce a clear primary object and make secondary objects subordinate
- organize by user decision, not by backend structure
- replace ambiguous page titles with the task or state the user recognizes

## Affordances and signifiers

What to inspect: buttons, links, fields, rows, icons, disabled controls, selected states, and anything that looks interactive.

Question it should provoke: "Can the user tell what can be done here without trying things?"

Failure signs:
- static text looks clickable
- clickable rows do not look clickable
- icons replace labels for unfamiliar actions
- disabled controls do not explain what would enable them
- multiple actions look equally primary

Typical redesign moves:
- make controls look like controls and static information look static
- pair unfamiliar icons with labels
- expose the next valid action and quiet secondary actions
- explain disabled states at the decision point

## Mapping

What to inspect: placement of actions relative to objects, table row actions, form labels, destructive controls, keyboard flow, and mobile reflow.

Question it should provoke: "Are controls placed where the user expects their effects to happen?"

Failure signs:
- global actions affect selected rows without a visible selection model
- destructive actions sit near safe actions with similar weight
- labels are far from inputs or values
- mobile order separates a control from the object it changes

Typical redesign moves:
- place row actions inside or immediately after the affected row
- group bulk actions with selection count and affected object
- separate destructive actions physically and visually
- keep labels, values, help text, and errors in one local group

## Feedback

What to inspect: loading, validating, saving, errors, success messages, current status, focus, hover, selected, and undo/retry behavior.

Question it should provoke: "After the user acts, can they tell what happened and what happens next?"

Failure signs:
- a button label never changes during async work
- success disappears before the user can understand the result
- errors appear far from the source
- current state is represented only by color
- validation status is mixed with final status

Typical redesign moves:
- make in-progress, success, and failure states explicit
- put errors next to the affected object
- replace generic toasts with local feedback when the decision is local
- show what changed, not just that something changed

## Constraints and error prevention

What to inspect: invalid states, destructive actions, permissions, sequencing, confirmation dialogs, required fields, validation timing, and undo paths.

Question it should provoke: "What mistakes can the UI make impossible or unlikely?"

Failure signs:
- destructive actions are available before prerequisites are complete
- users can start actions they do not have permission to finish
- invalid and valid items are mixed without a decision model
- confirmation copy repeats the button label instead of the consequence

Typical redesign moves:
- disable or defer actions until prerequisites are met, with an explanation
- hide or demote actions unavailable to the current role
- split valid, invalid, and needs-review states
- state the consequence and recovery path before destructive actions

## Gulf of execution

What to inspect: whether the user can see how to start, choose, configure, and finish the primary task.

Question it should provoke: "Can the user form and execute an action plan from what is visible?"

Failure signs:
- the primary action has a vague label like "Run" or "Submit"
- too many actions compete at the same level
- users must read raw data before discovering the next step
- important prerequisites are hidden below the fold

Typical redesign moves:
- use verb-object action labels
- expose a single next step
- turn prerequisites into visible checks or steps
- move essential context above the primary action

## Gulf of evaluation

What to inspect: final state, summaries, counts, changed objects, audit trails, receipt screens, and "what now" copy.

Question it should provoke: "Can the user tell whether the action worked and whether anything still needs attention?"

Failure signs:
- completion returns to the same screen with no clear change
- counts, totals, or affected records are absent
- the next responsible person or step is unclear
- success states do not mention unresolved exceptions

Typical redesign moves:
- show before/after counts or affected objects
- summarize exceptions separately from completed work
- make the next owner or next step visible
- preserve a receipt or audit trail for consequential actions

## Hierarchy and information scent

What to inspect: first read, headings, grouping, density, repeated badges, tables, empty space, progressive disclosure, and whether the most important information is easiest to scan.

Question it should provoke: "Where does the eye start, and does that match the user's job?"

Failure signs:
- everything is in a card, table, badge, or equal-weight block
- metadata competes with the decision
- raw detail appears before summary
- the page has no clear first read

Typical redesign moves:
- make the primary object and state the first read
- group by decision and scan path
- demote metadata through placement and tone
- put detail behind disclosure when it is not needed for the next action

## Trust and consequence

What to inspect: risk language, provenance, timestamps, money, permissions, destructive actions, generated content, external integrations, and irreversible operations.

Question it should provoke: "Does the UI give enough confidence for the user to act?"

Failure signs:
- risky actions lack consequence copy
- generated or imported data lacks provenance
- timestamps do not say what event they describe
- money or account changes are visually casual

Typical redesign moves:
- move provenance and timing next to consequential decisions
- name the consequence in the action area
- make permissions and ownership visible when they affect trust
- separate review from commitment for high-risk workflows

## Accessibility and resilience

What to inspect: keyboard order, focus states, screen-reader labels, color-only meaning, responsive layout, empty/loading/error/success/overflow states, and reduced-motion expectations.

Question it should provoke: "Does this still work when the screen is small, slow, empty, invalid, or navigated without a mouse?"

Failure signs:
- state is communicated only by color
- mobile layout hides the primary action or separates labels from values
- empty and error states are default blanks
- focus order does not match visual order

Typical redesign moves:
- pair color with text, icon, or shape
- design each data state as part of the workflow
- keep primary actions reachable and local on mobile
- preserve visible focus and logical keyboard order
