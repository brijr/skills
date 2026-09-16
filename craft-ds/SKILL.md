---
name: craft-ds
description: Create or maintain the single-file ds.tsx layout and prose contract when that specific primitive system is requested.
---

# Single-file layout and prose primitives

Use when the user requests the `components/ds.tsx` contract or this specific layout/prose system. Do not replace an existing component library or impose this architecture on an ordinary screen edit.

Keep layout primitives and optional Prose in one `ds.tsx`. Export `cn()` first and allow className overrides. Use semantic elements, small component-specific interfaces, and the project's responsive defaults and semantic color tokens. Keep business logic, routing, state, hooks, and project-module dependencies outside the file.

Choose the implementation matching the installed stack:

- With Tailwind, consult [Tailwind primitives](references/ds-tailwind.tsx); use `clsx` and `tailwind-merge` for class overrides.
- Without Tailwind, consult [CSS primitives](references/ds-css.tsx) and [stylesheet](references/ds.css); use `clsx` without Tailwind merging.

Read only the chosen variant. Adapt its defaults to the current project rather than copying an alien visual system. The CSS companion stylesheet is allowed; the component contract remains in one file.

Provide Section, Container, Main, and Nav where the requested contract needs them. Compose Section and Container explicitly. Main remains a semantic hook. Include Prose only for rendered text content, never around forms or application UI. Keep inline code distinct from code blocks, avoid applying body-link styling to heading links, and scope descendant styles to content.

Avoid prop-driven styling variants when className overrides suffice. Do not recreate buttons, cards, or dialogs. Add only needed primitives; treat file growth as a reason to simplify, not to add a framework.

Verify class overrides, semantic structure, affected responsive layouts, and content rendering. Run appropriate existing checks and inspect the rendered result; no numeric self-review score is required.
