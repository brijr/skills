## Post-Merge Workflow

Only perform the explicitly authorized release steps. A merge request alone does not authorize migrations, deployment, or production changes. When those actions are authorized:

1. Merge via `gh pr merge` only after readiness is clear.
2. Fast-forward local `main`.
3. If DB migrations changed, trigger the project's production migration workflow from the default branch and watch it complete.
4. Watch the repo's required CI/deploy workflows for the merge commit.
5. Inspect the production deployment/logs when relevant.
6. Smoke the changed routes in a real browser against production.
7. Finish with concise evidence: commit, runs, deploy, smoke result, and any caveats.
