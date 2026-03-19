---
name: pragmatic-react
description: Apply Pragmatic Programmer principles to React development. Enforces ETC (Easy to Change), real DRY, tracer bullets, orthogonality, broken windows, and good-enough discipline — all through a React lens. Use when the user asks to build, implement, add, or scaffold a React component, page, hook, feature, or UI system. Do not use for one-line fixes, typo corrections, or purely cosmetic changes.
---

# pragmatic-react — React Feature Development Constraint System

This skill enforces a specific engineering philosophy when building React features. It is not generic advice — it is an opinionated constraint system derived from *The Pragmatic Programmer* by Andy Hunt and Dave Thomas, applied to component-driven UI development.

Read every rule before writing code. Every rule is testable — you should be able to look at a diff and answer yes/no.

## Core Principle

**ETC — Easy to Change.** This is the north star. Every decision filters through one question: *does this make the system easier or harder to change later?* When uncertain between two approaches, pick the one that leaves more options open.

In React, this means: components should be easy to move, rename, rewrap, and delete. State should be easy to relocate. Props should be easy to reshape.

## Constraints

### 1. Tracer Bullets First

Build the thinnest possible end-to-end slice before filling in details. A React tracer bullet:

- Renders something real on screen connected to real data (not mock data, not placeholder UI)
- Touches every layer the feature will touch (component → hook/state → API/data → routing if needed)
- Actually runs — it's not a Storybook-only component or an isolated fragment
- Proves the data flow works before you invest in breadth

Do not build component by component in isolation. Build one thin vertical slice from data to pixels, confirm it works, then widen.

### 2. Real DRY

DRY is about **knowledge**, not JSX. Two components that render similar markup but represent different domain concepts are not duplication — leave them alone. But a single business rule expressed in a component, a hook, and a utility is a violation even if the code looks different in each.

- Before extracting a shared component or hook, ask: *do these change for the same reason?*
- If yes → unify. If no → leave them separate.
- A `<Card>` in a dashboard and a `<Card>` in a settings page that happen to look alike are not DRY violations — they serve different contexts and will diverge.
- Never extract a component just because two pieces of JSX look similar right now.

### 3. Orthogonality

A change in one component should not force changes in unrelated components. Test this mentally: *if I change how X works, how many other files do I touch?* If the answer is "many," the design is coupled.

- **Props over context for local data** — don't reach for context or global state to avoid passing a prop two levels. Prop drilling through 2-3 levels is fine and explicit.
- **Colocate state** — state lives in the lowest common ancestor that needs it, not at the top "just in case."
- **Components own their layout** — a component should not assume anything about where it's placed. The parent decides layout; the child decides its own internals.
- **Hooks encapsulate behavior, not UI** — a hook should be usable in any component without knowing which component calls it.
- If changing a hook's return shape forces changes across many components, the abstraction boundary is wrong.

### 4. Broken Windows

Do not leave bad React code behind — not even temporarily. If you touch a file and see something wrong, fix it or flag it.

- No inline `// TODO: fix this` without a concrete plan
- No wrapping a broken component in a `try/catch` error boundary to hide the problem
- No working around a bad prop interface — fix the interface
- No leaving `any` types in TypeScript to "come back to later"
- If a component is doing too much, split it now — don't add more to it
- If the right fix is too large for the current scope, say so explicitly rather than shipping a hack

### 5. Good Enough Software

Know when to stop. A React feature that renders correctly, handles its states (loading, error, empty, populated), and is easy to change is done. Do not:

- Add props nobody asked for ("what if someone wants to customize the icon?")
- Build a component library when you need one component
- Add `renderX` or `slotX` props for hypothetical composition needs
- Over-optimize with `useMemo`, `useCallback`, or `React.memo` before measuring a performance problem
- Abstract a one-time layout into a reusable `<Layout>` component
- Handle hypothetical future states or edge cases the feature doesn't require

Ship when it's good enough — not when it's "flexible," and not before it's solid.

## Anti-Patterns (Hard Stops)

Do not produce any of the following:

- **Big-bang component trees** — building all components in isolation and assembling at the end. Always have something rendering end-to-end.
- **Premature component extraction** — extracting a shared component before you have at least two real, proven use cases that change for the same reason. Inline JSX is fine.
- **Premature hook extraction** — wrapping a single `useState` + `useEffect` in a custom hook before the logic is reused. A hook is an abstraction — earn it.
- **Prop explosion** — a component with 15+ props is usually doing too much. Split the component before adding another prop.
- **Context as global state** — using React context to avoid prop passing rather than to provide truly shared, rarely-changing values (theme, auth, locale).
- **Copy-paste components** — duplicating a component to "move fast" instead of understanding what it does. If you need a variation, understand the original first.
- **Speculative generality** — `variant`, `size`, `color`, `as`, `renderHeader`, or other extension props for requirements that don't exist yet.
- **Layer-by-layer construction** — writing all the hooks, then all the components, then all the pages. Work in vertical slices.
- **Ignoring broken windows** — adding a clean component next to a component you know is wrong without addressing it.
- **Over-abstracted state** — reaching for a state management library or reducer when `useState` in the right component would do.

## Workflow

When building a new React feature:

1. **Understand** — What is the feature? What components, state, and data does it need? What parts are likely to change?
2. **Tracer bullet** — Build the thinnest end-to-end slice: one component, real data, rendered on screen. Prove the data flow works.
3. **Widen** — Add states (loading, error, empty), edge cases, additional UI — one slice at a time. Each slice should render and work.
4. **Clean as you go** — Fix broken windows in files you touch. Keep components orthogonal. Colocate state. Simplify prop interfaces.
5. **Stop** — When the feature works, handles its states, and the components are easy to change, stop. Don't over-abstract.

## Self-Review (Run Before Finalizing)

Score 1–5 on each. Revise until all are 4+.

| Criterion | Question |
|---|---|
| ETC | If the design changes tomorrow, how many components do I rewrite? |
| DRY | Is every piece of domain knowledge expressed in exactly one place? |
| Orthogonal | Can I change one component without rippling into others? |
| Tracer | Did I build end-to-end first, or did I build components in isolation? |
| Windows | Did I leave any code I know is wrong? |
| Enough | Did I build only what was needed — no extra props, hooks, or abstractions? |
| State | Is state colocated to the lowest component that needs it? |
| Props | Does every component have a clean, minimal prop interface? |
