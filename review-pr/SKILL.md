---
name: review-pr
description: Take a pull request the last mile — workspace-safe checkout, live PR state, release-blocking findings, verification on the PR head, real-browser UI smoke, merge readiness, merge, and post-merge production verification. Use when the user asks to prepare, verify, smoke test, merge, ship, or get a PR ready or live, especially by PR number. For line-by-line code review of the diff itself, prefer the agent's built-in review commands and fold their findings into this skill's readiness verdict; this skill owns everything around that review.
---

# Review PR — take a pull request the last mile

Act as the senior engineer who ships the PR, not just reads it. Anchor every claim to live git/GitHub state, targeted tests run on the PR head, and — when UI changed — a real browser smoke with real screenshots.

This skill does **not** replace line-by-line diff review. When the user wants a code review of the changes themselves, run the agent's built-in review tooling (e.g. `/code-review`) and merge its findings into the readiness verdict below. What this skill owns is the release path: live state, verification, smoke evidence, merge readiness, and what happens after merge.

## Core Workflow

1. Confirm the workspace state first.
   - Run `git status --short --branch`.
   - Do not mix local edits into the PR verification. Preserve user work with a named stash or separate worktree only when appropriate.
   - Identify the PR base branch from `gh pr view`; do not assume it is `main`.
   - Fetch the current base branch and PR head before anything else.

2. Read live PR truth.
   - Use `gh pr view <number> --json number,title,body,headRefName,baseRefName,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup,files,commits,url`.
   - Use `gh pr diff <number>` or `git diff origin/<base-branch>...refs/remotes/pr/<number>`.
   - If a PR disappeared from the open list, check whether it merged or closed.

3. Surface release-blocking findings only.
   - This pass is a release gate, not a style review: behavior changes, permissions, migrations, data safety, irreversible operations, product regressions, and missing tests on risky paths.
   - For full line-by-line review, run the built-in review command and fold its findings in here.
   - Lead with blockers ordered by severity, with file and line references. If there are none, say that directly and name the residual risk.

4. Explain the product impact.
   - Translate technical changes into what users/admins will see.
   - Separate backend/security behavior from UI copy or navigation changes.
   - Call out whether the PR needs DB migration, infra deploy, env/config, queue/cron work, release notes, or only a normal deploy.

5. Verify on the PR head.
   - Prefer a detached PR checkout or temporary worktree for tests.
   - Discover the project's package manager and scripts before choosing commands.
   - Run targeted tests first, then typecheck/build/lint when relevant.
   - Use package-relative paths when the package manager runs inside a subpackage.
   - Run `git diff --check <base-ref>...HEAD`.
   - Return to the original branch or clean base branch when done.

## UI Smoke — real screenshots only

When the PR touches UI, or the user asks to see it:

1. Use whatever browser capability the session actually has — an in-app or IDE browser, Claude in Chrome, a Playwright MCP server, or a locally driven browser. If the session has none, say so plainly instead of improvising.
   - Prefer the PR's preview URL from bot comments, deployment checks, or the project's deploy provider.
   - If the preview is behind auth, do not fake screenshots or bypass auth.

2. If preview auth blocks access, try local dev only when safe.
   - Confirm the app is using a local/dev env before creating or mutating local auth state.
   - Start the app on a spare port from the PR head if needed.
   - If local dev also redirects to sign-in, ask the user to log in in the browser, then continue after they confirm.

3. Capture only real evidence.
   - Screenshots come from the authenticated preview or local app — never static mockups, `data:` URLs, or synthetic images standing in for product UI.
   - If screenshots are not possible, summarize the UI from source and tests and state clearly that auth or tooling prevented live capture.

## Merge Readiness

Before saying "ready to merge", verify:
- PR is non-draft and mergeable, or the merge state is understood.
- Required checks are green, or any pending checks are explicitly called out.
- Verification ran on the PR head, not accidentally on `main`.
- Migration/config/deploy implications are documented.
- UI smoke status is documented if UI changed.

## Post-Merge Workflow

When the user asks to merge and get it live:

1. Merge via `gh pr merge` only after readiness is clear.
2. Fast-forward local `main`.
3. If DB migrations changed, trigger the project's production migration workflow from the default branch and watch it complete.
4. Watch the repo's required CI/deploy workflows for the merge commit.
5. Inspect the production deployment/logs when relevant.
6. Smoke the changed routes in a real browser against production.
7. Finish with concise evidence: commit, runs, deploy, smoke result, and any caveats.

## Useful Commands

```sh
git status --short --branch
gh pr list --state open --json number,title,headRefName,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup,url
gh pr view <number> --json number,title,body,headRefName,baseRefName,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup,files,commits,url
git fetch origin pull/<number>/head:refs/remotes/pr/<number>
git diff --stat origin/<base-branch>...refs/remotes/pr/<number>
git diff --check origin/<base-branch>...HEAD
```

## Response Shape

Keep the final report short and operational:
- Release-blocking findings first (including any folded in from the built-in review).
- Then what the PR does and its product/deploy impact.
- Then verification results from the PR head.
- Then UI smoke status or screenshots.
- Then merge readiness and post-merge steps.
