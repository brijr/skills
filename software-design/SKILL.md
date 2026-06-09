---
name: software-design
description: Guide feature design and implementation in existing codebases. Based on A Philosophy of Software Design, with Pragmatic Programmer build discipline and conditional React/Next.js App Router constraints. Use when the user asks to add, implement, build, or scaffold a new feature, endpoint, module, route, component, hook, or system. Explore the existing system, frame complexity, design twice with concrete interfaces, wait for approval, then build with tracer bullets and repo-specific constraints. Do not use for greenfield projects, pure product/UX rework of existing experiences (use product-design), behavior-preserving cleanup after a finished change (use clean-up), or trivial one-line fixes.
---

# software-design - design before code, then build strategically

Use this skill when a request introduces new behavior into an existing codebase. The job is to keep the interface simple, hide complexity in the right module, and then build the approved design as a thin working slice before widening.

This is the canonical feature skill for existing codebases. It already includes the Pragmatic Programmer build discipline, so do not stack `pragmatic` on the same existing-codebase feature request.

Phase 4's build rules intentionally duplicate the `pragmatic` skill — skills install standalone, so the shared discipline must live in both files. If you change a rule here, mirror it there.

## When to use

Use for new capabilities: features, endpoints, modules, data flows, routes, actions, components, hooks, integrations, or systems.

Do not use for:

- greenfield, prototype, or standalone feature work with no existing architecture to inspect; use `pragmatic`
- pure visual/product critique of an existing experience; use `product-design`
- post-change fit-and-finish; use `clean-up`
- typo fixes, one-line changes, or purely cosmetic edits

## Phase 1 - Explore

Read the relevant codebase before proposing anything. Find:

- existing modules, boundaries, naming, data flow, and ownership
- tests, scripts, docs, contracts, schemas, and nearby examples
- whether the project is React, Next.js App Router, or another framework
- where complexity already lives and where this feature would add more

Use `rg` and local manifests first. Do not report the whole exploration; use it to make the design specific.

## Phase 2 - Frame

Explain what the feature adds to the system:

- new state, concepts, permissions, failure modes, or user-visible states
- boundaries crossed: UI, API, DB, background work, third-party services
- knowledge callers would need to hold if the design is shallow
- likely future change pressure

Ask at most three questions, only when the answer changes the design. State conservative assumptions instead of asking about discoverable repo facts.

## Phase 3 - Design It Twice

Propose two genuinely different designs before writing code. They should differ in responsibility boundaries, not just names.

For each design:

- make the interface concrete in the repo's language
- name what the design hides
- name what callers must know
- identify the files/modules likely touched
- check the red flags below
- give the honest tradeoff

Red flags:

- shallow module: interface nearly as complex as implementation
- information leakage: same knowledge encoded in multiple places
- temporal coupling: caller must know hidden ordering rules
- pass-through: abstraction only forwards
- repetition: business rule duplicated across callers
- special-case code: condition a better interface would make impossible
- conjoined variables: values always passed together but not modeled together
- vague names: name needs a comment to be understood

Recommend the deeper design: smaller interface, richer implementation, fewer caller obligations. If both designs are weak, surface the constraint causing that and redesign.

Stop here until the user approves the design.

## Phase 4 - Build the Approved Design

Build exactly the approved interface. Pull complexity downward into implementations rather than callers.

Apply these rules while building:

- **ETC**: choose the option that is easiest to change tomorrow.
- **Tracer bullet first**: build the thinnest end-to-end slice that actually runs, then widen.
- **Real DRY**: unify duplicated knowledge, not code that only looks similar.
- **Orthogonality**: changing one concern should not ripple through unrelated files.
- **Broken windows**: if touched code is clearly wrong, fix it or flag the larger follow-up.
- **Good enough**: handle real requirements and expected states; do not add speculative options, flags, slots, or extension points.

Implementation sequence:

1. Create the smallest vertical slice through every required layer.
2. Verify it runs.
3. Add required states, validations, errors, and edge cases one slice at a time.
4. Clean touched code to local conventions.
5. Stop when the feature works, is verified, and is easy to change.

## React Guidance

Apply when the inspected repo uses React.

- Build data-to-pixels vertical slices; do not build isolated component trees first.
- Keep state in the lowest component that needs it.
- Prefer props over context for local data; context is for truly shared, rarely-changing values.
- Extract components or hooks only when the knowledge changes for the same reason in multiple real places.
- Keep prop interfaces small and named around product/domain concepts.
- Handle loading, empty, error, success, disabled, and permission states that the feature actually needs.
- Avoid premature `useMemo`, `useCallback`, `React.memo`, render props, slot props, and variant systems.

## Next.js App Router Guidance

Apply when the inspected repo is a Next.js App Router project.

- Default to server components. Add `"use client"` only for hooks, event handlers, browser APIs, or interactive state.
- Server components fetch data and pass props down.
- Client components render props and call server actions for mutations.
- Server actions start with auth, then validate with Zod, mutate, and revalidate the affected path/tag.
- Do not import DB, server auth helpers, storage clients, or server actions into client-only code except action imports used for mutation calls.
- Use API routes for webhooks, uploads, streaming, and third-party callbacks; prefer server actions for app mutations.
- Put custom components outside `components/ui`; that directory is for primitives.
- Follow existing route groups, loading/error files, naming, and import order.

## Verification

Before finalizing:

- run the repo's relevant typecheck, lint, tests, or targeted smoke command
- for UI changes, verify the route or component visually when a local app can run
- report commands run and any remaining risk

## Closing Summary

Report:

- approved design implemented
- public interface or route/action/component added
- verification result
- anything intentionally deferred because it exceeded the approved design

## Anti-patterns

- designing during implementation because the interface was never approved
- building layer-by-layer instead of a tracer bullet
- extracting abstractions for a single use case
- adding flags/options for hypothetical requirements
- working around a bad interface instead of fixing it
- hiding uncertainty behind a successful-looking implementation
