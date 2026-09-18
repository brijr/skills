---
name: check-ui
description: Inspect the rendered UI after frontend work and fix visual defects in the changed surfaces. Use after implementing or editing pages, components, layouts, CSS, or styling. Not for a whole-product audit, backend-only work, or product-workflow decisions.
---

# Check the rendered UI

After UI-facing changes, look at the actual screen before calling the work done.

1. Identify the changed surfaces and the states the change actually touches.
2. Render them with available browser or screenshot tooling. Source is not visual proof.
3. Scan for broken alignment, uneven spacing, clipped or overflowing content, weak hierarchy, controls that do not match their neighbors, and the touched states (empty, error, disabled, focus as applicable).
4. Fix defects inside the current change using existing tokens and components.
5. Re-check the rendered result.

Done when the changed surfaces have been rendered and obvious defects are fixed, or the visual check is reported unavailable. Stay inside the current change.
