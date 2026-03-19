---
name: pragmatic
description: Apply Pragmatic Programmer principles when building new features. Enforces ETC (Easy to Change), real DRY, tracer bullets, orthogonality, broken windows, and good-enough discipline. Use when the user asks to build, implement, add, or scaffold a new feature, endpoint, module, or system. Do not use for one-line fixes, typo corrections, or purely cosmetic changes.
---

# pragmatic — Feature Development Constraint System

This skill enforces a specific engineering philosophy when building new features. It is not generic advice — it is an opinionated constraint system derived from *The Pragmatic Programmer* by Andy Hunt and Dave Thomas.

Read every rule before writing code. Every rule is testable — you should be able to look at a diff and answer yes/no.

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

When building a new feature:

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
