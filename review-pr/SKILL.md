---
name: review-pr
description: Review and prepare pull requests in an existing repo with repo-grounded code review, verification, UI preview, and merge/post-merge planning. Use when the user asks to review, explain, prepare, merge, smoke test, choose, or get ready to ship a PR, especially by PR number.
---

# Review PR

## Overview

Act as the senior-engineer release reviewer for an existing project. Anchor every claim to live git/GitHub state, targeted tests, and, when UI is involved, a real Browser preview.

## Core Workflow

1. Confirm the workspace state first.
   - Run `git status --short --branch`.
   - If not on clean `main`, avoid mixing local edits into the PR review. Preserve user work with a named stash or separate worktree only when appropriate.
   - Identify the PR base branch from `gh pr view`; do not assume it is `main`.
   - Fetch the current base branch and PR head before reviewing.

2. Read live PR truth.
   - Use `gh pr view <number> --json number,title,body,headRefName,baseRefName,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup,files,commits,url`.
   - Use `gh pr diff <number>` or `git diff origin/<base-branch>...refs/remotes/pr/<number>`.
   - If a PR disappeared from the open list, check whether it merged or closed.

3. Review like a code reviewer.
   - Lead with blocking findings, ordered by severity, with file and line references.
   - Focus on behavior, permissions, migrations, data safety, product regressions, and missing tests.
   - If no blockers are found, say that directly and name residual risk.

4. Explain the product impact.
   - Translate technical changes into what users/admins will see.
   - Separate backend/security behavior from UI copy or navigation changes.
   - Call out whether the PR needs DB migration, infra deploy, env/config, queue/cron work, release notes, or only a normal deploy.

5. Verify on the PR head.
   - Prefer a detached PR checkout or temporary worktree for tests.
   - Discover the project’s package manager and scripts before choosing commands.
   - Run targeted tests first, then typecheck/build/lint when relevant.
   - Use package-relative paths when the package manager runs inside a subpackage.
   - Run `git diff --check <base-ref>...HEAD`.
   - Return to the original branch or clean base branch when done.

## UI Preview Workflow
When the user asks to see UI, show UI, preview UI, or smoke a browser flow:

1. Use the in-app Browser via `browser:control-in-app-browser`.
   - Read and follow the active Browser skill path when provided in the prompt.
   - Prefer the PR's preview URL from bot comments, deployment checks, or the project’s deploy provider.
   - If preview is behind auth, do not fake screenshots or bypass auth.

2. If preview auth blocks access, try local dev only when safe.
   - Confirm the app is using local/dev env before creating or mutating local auth state.
   - Start the app on a spare port from the PR head if needed.
   - If local dev also redirects to sign-in, ask the user to log in in the Browser, then continue after they confirm.

3. Use real screenshots only.
   - Capture screenshots from the authenticated preview/local app.
   - Do not use static mockups, `data:` URLs, or synthetic screenshots as substitutes for product UI.
   - If screenshots are not possible, summarize the UI from source and tests and clearly say auth prevented live capture.

## Merge Readiness

Before saying "ready to merge", verify:
- PR is non-draft and mergeable or the merge state is understood.
- Required checks are green or any pending checks are explicitly called out.
- Local review ran on the PR head, not accidentally on `main`.
- Migration/config/deploy implications are documented.
- UI preview/smoke status is documented if UI changed.

## Post-Merge Workflow
When the user asks to merge and get it live:

1. Merge via `gh pr merge` only after readiness is clear.
2. Fast-forward local `main`.
3. If DB migrations changed, trigger production `DB Migrate` from `main` and watch it.
4. Watch the repo’s required CI/deploy workflows for the merge commit.
5. Inspect production deployment/logs when relevant.
6. Use the in-app Browser for live smoke on changed routes.
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

Keep the final review short and operational:
- Findings first.
- Then what the PR does.
- Then UI preview status or screenshots.
- Then verification.
- Then post-merge steps.
