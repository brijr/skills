---
name: pragmatic
description: Guide standalone builds, prototypes, and spikes when pragmatic implementation discipline is requested, emphasizing working slices and scope-appropriate verification.
---

# Pragmatic implementation

Use for standalone builds, prototypes, or spikes when the user wants pragmatic implementation guidance. Establish the outcome and whether the artifact is disposable or maintained. Follow existing repository constraints when present.

Build the smallest end-to-end slice that tests the important assumption, then complete the requested behavior. Prefer interfaces that are easy to change. Unify duplicated knowledge, not superficially similar code. Keep independent concerns separate and avoid speculative options or abstractions.

For a prototype, make its limitations visible and avoid production side effects. For maintained code, handle relevant failures and states, reuse local conventions, and verify the behavior that matters.

Continue through the authorized outcome, fixing regressions introduced by the work. Stop when the outcome is verified or a concrete blocker requires input. Do not turn routine implementation choices into approval gates. Publishing, deployment, and external actions require their own authorization.

Report the delivered outcome, evidence, and material limitations. This skill is standalone; no companion skill is needed for general build discipline.
