---
name: pragmatic
description: Apply Pragmatic Programmer principles to greenfield, prototype, or framework-agnostic feature work where there is no existing-codebase design gate. Enforces ETC (Easy to Change), real DRY, tracer bullets, orthogonality, broken windows, and good-enough discipline. Use when the user asks for pragmatic build discipline on a new standalone feature, throwaway prototype, spike, script, endpoint, module, or system. Do not use for feature work in an existing codebase (use software-design), one-line fixes, typo corrections, pure product/UX work, or purely cosmetic changes.
---

# pragmatic — greenfield feature development constraint system

This skill enforces a specific engineering philosophy for greenfield, prototype, or framework-agnostic feature work. It is not generic advice — it is an opinionated constraint system derived from *The Pragmatic Programmer* by Andy Hunt and Dave Thomas.

For feature work in an existing codebase, use `software-design` instead. That skill is the canonical existing-codebase feature module and already includes this build discipline after its design gate.

The build discipline below intentionally duplicates `software-design` Phase 4 — skills install standalone, so the shared discipline must live in both files. If you change a rule here, mirror it there.

Read every rule before writing code. Every rule is testable — you should be able to look at a diff and answer yes/no.

## When to use

Use when the task is a new standalone feature, prototype, spike, script, endpoint, module, or system and there is not enough existing architecture to justify the `software-design` explore/frame/design approval workflow.

Do not use for:

- adding behavior to an existing codebase; use `software-design`
- product/UX critique or implementation of an existing experience; use `product-design`
- behavior-preserving fit-and-finish after a completed change; use `clean-up`
- one-line fixes, typo corrections, or purely cosmetic changes

## Core Principle

**ETC — Easy to Change.** This is the north star. Every decision filters through one question: *does this make the system easier or harder to change later?* When uncertain between two approaches, pick the one that leaves more options open.

## Constraints

### 1. Tracer Bullets First

Build the thinnest possible end-to-end slice before filling in details. A tracer bullet:

- Touches every layer the feature will touch (UI → API → data, or whatever the stack is)
- Actually runs — it's not a stub or a mock
- Proves the path works before you invest in breadth

Do not build layer by layer (all models, then all routes, then all UI). Build one thin vertical slice, confirm it works, then widen.

### 2. Real DRY

DRY is about **knowledge**, not text. Two pieces of code that look identical but represent different domain concepts are not duplication — leave them alone. But a single business rule expressed in three places is a violation even if the code looks different in each.

- Before extracting, ask: *do these change for the same reason?*
- If yes → unify. If no → leave them separate.
- Never DRY things up just because they look similar right now.

### 3. Orthogonality

A change in one area should not force changes in unrelated areas. Test this mentally: *if I change how X works, how many other files do I touch?* If the answer is "many," the design is coupled.

- Keep modules, components, and functions self-contained
- Pass data explicitly rather than relying on shared mutable state
- If a function needs to know about the internals of another module, something is wrong

### 4. Broken Windows

Do not leave bad code behind — not even temporarily. If you touch a file and see something wrong, fix it or flag it. Do not add clean code next to code you know is broken, hacky, or unclear.

- No "we'll fix this later" without a concrete plan
- No working around a bad interface — fix the interface
- If the right fix is too large for the current scope, say so explicitly rather than shipping a hack

### 5. Good Enough Software

Know when to stop. A feature that works correctly, handles its edge cases, and is easy to change is done. Do not:

- Add configurability nobody asked for
- Handle hypothetical future requirements
- Polish beyond what the current need demands
- Build abstractions for a single use case

Ship when it's good enough — not when it's perfect, and not before it's solid.

## Anti-Patterns (Hard Stops)

Do not produce any of the following:

- **Big-bang builds** — building all the parts separately and integrating at the end. Always have something running.
- **Premature abstraction** — extracting a helper, utility, or base class before you have at least two real, proven use cases that change for the same reason.
- **Copy-paste as velocity** — duplicating a block of code to "move fast" instead of understanding what it does and placing the knowledge correctly.
- **Hacky fixes** — duct-tape solutions that work around a problem instead of addressing it. If the right fix exists, do the right fix. If it's too big to do now, surface that tradeoff explicitly rather than hiding a hack in the codebase.
- **Speculative generality** — parameters, flags, options, or extension points for requirements that don't exist yet.
- **Layer-by-layer construction** — writing all the models, then all the controllers, then all the views. Work in vertical slices.
- **Ignoring broken windows** — adding new code next to code you know is wrong without addressing it.

## Workflow

When building a greenfield or prototype feature:

1. **Understand** — What is the feature? What layers does it touch? What changes are likely in the future?
2. **Tracer bullet** — Build the thinnest end-to-end slice that proves the path works.
3. **Widen** — Add cases, validations, UI states, edge handling — one slice at a time.
4. **Clean as you go** — Fix broken windows in files you touch. Keep things orthogonal.
5. **Stop** — When the feature works and the code is easy to change, stop. Don't over-polish.

## Self-Review (Run Before Finalizing)

Score 1–5 on each. Revise until all are 4+.

| Criterion | Question |
|---|---|
| ETC | If requirements shift tomorrow, how much of this code do I rewrite? |
| DRY | Is every piece of domain knowledge expressed in exactly one place? |
| Orthogonal | Can I change one part without rippling into others? |
| Tracer | Did I build end-to-end first, or did I build in layers? |
| Windows | Did I leave any code I know is wrong? |
| Enough | Did I build only what was needed — no more, no less? |
