---
name: software-design
description: Guide system design when adding a new feature to an existing codebase. Based on A Philosophy of Software Design by John Ousterhout. Triggers when the user wants to add, implement, or build something new. Explores the existing system, frames the complexity the feature introduces, proposes two module designs with red flag checks, gets approval, then builds. Do not use for greenfield projects, pure refactors (use refactor-ui), or trivial one-line changes.
---

# software-design — design before code

Rooted in *A Philosophy of Software Design* by John Ousterhout. The core idea: complexity accumulates through small decisions, and the right time to fight it is before the code is written — not after.

Four phases: explore, frame, design twice, build. Hard gate before implementation. The goal at every phase is to find the design that hides the most complexity behind the simplest interface.

## When to use

The user is introducing something new into an existing codebase — a new capability, a new data flow, a new interaction between modules. The signal is new abstraction, not new lines. Not a one-line fix, not a style change, not a pure refactor.

---

## Phase 1 — Explore

Read the relevant codebase silently before saying anything. Understand what's already there: existing modules, abstractions, patterns, and where complexity currently lives. Use this to make Phase 2 specific. Don't report the exploration — use it.

---

## Phase 2 — Frame

Tell the user what the feature actually adds to the system: which boundaries it crosses, what new state or knowledge it introduces, what callers will need to hold in their heads. Name the complexity specifically — new failure modes, new coordination between layers, new concepts that didn't exist before.

Then ask only what's genuinely unclear. The right questions depend on the feature — common ones are about scope, ownership, error handling, and what should be visible to callers vs. hidden. Max three. If something is obvious from the code, state the assumption instead of asking.

Don't propose a design yet.

---

## Phase 3 — Design it twice

Propose two genuinely different designs — different decompositions, different information hiding boundaries, different allocations of responsibility. Not the same idea with different names.

For each design: make the interface concrete in the repo's actual language (not pseudocode), say what it hides and what callers must know, check for red flags, and name the honest tradeoff.

**Red flags to check:**
- **Shallow module** — interface nearly as complex as the implementation
- **Information leakage** — same knowledge encoded in multiple places
- **Temporal coupling** — callers must act in order without the interface enforcing it
- **Pass-through** — a method that adds no value, just forwards
- **Repetition** — logic that should be in the module is duplicated across callers
- **Special-case code** — a condition a better design would make impossible
- **Conjoined variables** — two values always used together; they're one concept
- **Vague names** — a name that needs a comment to explain it

End with a recommendation and the reasoning. Prefer the deeper design — simpler interface, richer implementation.

If both designs have real red flags, don't pick the less-bad one. Say so, find the constraint that's forcing both to be bad, and design again with that constraint surfaced. One more round is better than approving a flawed design.

**Wait for approval before writing any implementation code.**

---

## Phase 4 — Build

Implement the approved design. The interface is already agreed — build the implementation to match it.

Pull complexity downward: when logic could live in the caller or the implementation, put it in the implementation. Hide details that could change without affecting the interface. Where possible, define error states out of existence rather than asking callers to catch them. Don't add abstraction the feature doesn't need yet.

After building, briefly report: what was built, the public interface, anything deferred, and any principled shortcuts taken and why.

---

## Core principles

**Deep modules.** Simple interface, rich implementation. The interface is what callers hold in their heads — make it small.

**Information hiding.** If a detail can change without affecting callers, hide it. Exposure is a cost paid at every call site, forever.

**Pull complexity down.** When in doubt, pay the cost in the implementation, not in the caller.

**Strategic over tactical.** Tactical code just makes it work. Strategic code asks what the feature adds to the system's complexity and whether that cost is worth it.

**Obvious code.** A reader should understand a module without reading three other files. If they can't, the abstraction is in the wrong place.

---

## Anti-patterns

- Designing in Phase 4 — if the interface isn't agreed before coding, the code drives the design
- Proposing one design — two options surface tradeoffs that one hides
- Picking the less-bad design when both have real red flags — find the broken constraint and redesign
- Adding abstraction the feature doesn't need yet — "we might need this later" is tactical thinking in disguise
- Putting complexity in the caller — every param they must pass, every error they must catch, every ordering rule they must remember is a permanent tax
