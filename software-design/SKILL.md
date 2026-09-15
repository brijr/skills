---
name: software-design
description: Design and implement features in existing codebases when interfaces, ownership, or data flow need design.
---

# Software design

Inspect the relevant implementation, ownership boundaries, and nearby contracts before choosing a design. Keep caller interfaces simple and place business rules in the module that owns them. Follow repository conventions and preserve unrelated work.

For straightforward features, explain the intended change briefly and proceed within the user's authorization. For substantial features with unresolved product rules or architectural tradeoffs, present a concrete design and obtain approval before implementation. Existing approval is sufficient; do not restart the approval loop. A request for planning or critique alone does not authorize implementation.

Compare alternative designs when they expose a meaningful tradeoff. Do not manufacture a second design for an obvious extension. Consider what each interface hides, what callers must know, and whether rules or ordering requirements leak across boundaries. Ask only about decisions that cannot be inferred and would materially change the result.

Build a thin working slice through the necessary layers, then complete the required states and error handling. Unify duplicated knowledge, avoid speculative abstractions, and keep changes within the requested scope. This skill includes the relevant build discipline; do not load another general implementation skill for the same advice.

For React or Next.js App Router implementation, consult [framework guidance](references/framework-guidance.md) only for the relevant framework, reconciling it with the installed version and repository conventions.

Run the checks needed to verify the changed behavior, including visual inspection for UI work when feasible. Fix failures introduced by the change and rerun affected checks. Continue through the full authorized outcome, rather than stopping at the first working slice. If blocked, report the concrete blocker and remaining work.

Report the behavior or interface delivered, verification evidence, and any uncompleted scope. Keep local, CI, deployment, and production evidence distinct.
