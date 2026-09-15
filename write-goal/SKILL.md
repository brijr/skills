---
name: write-goal
description: Draft or refine an agent goal with a measurable outcome, verification evidence, and explicit scope.
---

# Write an auditable agent goal

Draft goal text; do not activate or manage goal lifecycle unless explicitly requested.

Identify the desired outcome, evidence that would establish completion, constraints, permitted scope, and the concrete blocker that would require input. For repository-dependent goals, inspect only the relevant implementation and verification commands. Distinguish checked facts, user-provided context, and assumptions.

Write one compact goal that lets the agent choose its path while making completion testable. Name actual routes, commands, artifacts, or measures when verified. Require iteration on failures caused by the requested work and an honest report of blockers; do not equate time spent or an exhausted budget with completion.

If the user explicitly requests a native goal command, use supported syntax for that surface. Otherwise provide a portable goal paragraph or block. Do not invent lifecycle commands. A simple task can use a normal prompt instead, but still honor an explicit request to draft a goal.

Ask only if missing information prevents an auditable goal; otherwise state reasonable assumptions. Do not ask the user to repeat available context or choose arbitrary files within an already named scope.

Include a brief context-checked note for codebase goals. Keep examples optional: consult [examples](references/examples.md) when a concrete pattern would help. Preserve publication, production, and external-action boundaries in the drafted goal.
