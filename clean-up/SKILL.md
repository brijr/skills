---
name: clean-up
description: Clean up a recent code change to match local conventions while preserving behavior and keeping edits within the requested diff.
---

# Clean up a recent change

Identify the recent diff and current working-tree state. Preserve unrelated edits. Limit cleanup to the requested change and its touched files; report opportunities outside that scope instead of expanding it.

Preserve behavior and public contracts. Remove dead scaffolding, debug leftovers, unused imports, misleading names, and duplication of knowledge. Match nearby conventions where they are sound. Inspect neighbors only when needed to understand those conventions.

A request to perform cleanup authorizes these scoped edits. A request for a review or checklist alone stays read-only. Ask only when a proposed fix would change behavior or materially expand scope; do not require a second checklist approval for routine authorized cleanup.

Verify in proportion to the change using relevant existing checks. Fix regressions caused by the cleanup and rerun affected checks. Do not add tests that only assert formatting or run unrelated suites by default.

Report what improved, verification evidence, and any behavior-changing or out-of-scope findings left for another task.
