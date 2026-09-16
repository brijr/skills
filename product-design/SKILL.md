---
name: product-design
description: Design or critique product journeys, roles, handoffs, and workflow decisions spanning screens; implement the agreed direction when authorized.
---

# Product workflow design

Use for journeys spanning screens, roles, handoffs, permissions, and unresolved product decisions. A focused screen improvement belongs to `refactor-ui` when available; that is a routing distinction, not a required handoff or prerequisite.

Inspect the relevant product evidence and implementation. Establish the user's job, participating roles, workflow stages, ownership of the next step, and success outcome. Trace contracts and actions before proposing behavior changes. Preserve verified rules, data meaning, and existing design language unless the requested scope includes changing them.

Diagnose where the journey breaks: unclear responsibility, unavailable inputs, invalid actions, missing feedback, inconsistent states, or unnecessary work. Tie findings to observed behavior. Separate product facts from hypotheses and visual preferences.

For critique-only requests, deliver findings and a concrete proposal without editing. For substantial unresolved product choices, present their consequences and obtain a decision before dependent implementation. Continue independent investigation where possible. Existing approval covers the agreed direction; do not ask for the same approval again.

Make proposals concrete through workflow stages, role/action boundaries, changed states, and affected areas. Include alternatives only where they reveal a meaningful tradeoff. Ask only questions whose answers change the result and cannot be discovered.

When implementation is authorized, carry the agreed workflow through its required states using existing primitives and ownership boundaries. Verify affected permissions, transitions, failure states, and user-visible behavior with relevant tests and browser inspection. Do not silently expand into adjacent workflows or external actions.

Report the product outcome, decisions made, evidence, and unresolved scope. Keep local verification, provider behavior, and production evidence distinct.
