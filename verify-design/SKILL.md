---
name: verify-design
description: Render the UI you just changed, look at it, and fix design defects until it looks right. Use after building or editing pages, components, layouts, or styles, before calling the work done. Not for whole-product audits, backend-only changes, or product-workflow decisions.
---

# Verify design

Code that compiles is not a finished design. Look at the result and fix it.

## Loop

1. **Render.** Open each changed screen in the running app with the available browser or screenshot tool. Capture a desktop and a mobile width.
2. **Look.** Study the screenshot the way a designer would:
   - Alignment: edges and baselines line up; nothing is a few pixels off.
   - Spacing: gaps are consistent and come from the existing scale.
   - Hierarchy: the most important thing reads first; one clear primary action.
   - Fit: no clipped, overflowing, or awkwardly wrapped text; no horizontal scroll on mobile.
   - Consistency: new elements match their neighbors in size, radius, color, and type.
   - States the change touches: hover, focus, empty, loading, error, disabled.
3. **Fix.** Correct what you saw using the project's existing tokens and components. Stay inside the current change.
4. **Repeat** until a fresh screenshot shows nothing left to fix. After three passes, stop and list what remains.

## Done

Report what you checked, what you fixed, and the final screenshots. If the UI could not be rendered, say the design is unverified. Never claim it looks right from source alone.
