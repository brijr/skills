---
name: design-loop
description: Improve an authorized set of product surfaces against a shared design contract, with resumable progress and visual verification.
---

# Design across an authorized set of surfaces

Use for a sustained product design effort with a shared design contract and resumable backlog. Establish the authorized surfaces and requested review checkpoints from the conversation. A single-screen correction does not require bootstrapping a whole-product process.

Keep `/design.md` as the canonical token and design contract, with optional `/design.dark.md` for materially different dark-mode tokens. Track surface status in `design/BACKLOG.md`, actual user verdicts in `design/DECISIONS.md`, and briefs and verification evidence in `design/briefs/` and `design/reviews/`.

If the contract is missing, consult [bootstrap](references/bootstrap.md) and [contract schema](references/constraint-system.md). Draft from the existing product and approved direction. Resolve substantial undecided design choices before dependent work; do not ask for approval already given.

For surface work, consult [iteration guidance](references/iteration.md). Establish the job and quality target, implement against the contract, inspect rendered screenshots, and fix observed problems. Use the bundled token checker where applicable and preserve accessibility, supported themes, responsive behavior, and relevant interaction states.

Continue through all authorized surfaces without mandatory per-screen stops. Pause only at requested checkpoints, unresolved consequential choices, or concrete blockers. Do not relax design constraints just to pass checks, invent human approval, or migrate unrelated screens.

Record each verified surface before continuing. `done` means verification is complete and no required checkpoint remains; `needs-review` means a user verdict is outstanding. Explain any verification gaps rather than claiming completion. Keep actual user verdicts separate from agent findings and retain append-only decision history.

Publishing, merging, deployment, external messages, and production changes require their own authorization. Finish with the completed scope, verification evidence, preview location, and remaining decisions or blockers.
