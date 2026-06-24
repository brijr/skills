---
name: what-shipped
description: Summarize recent merged, deployed, or shipped work from the current repository into a clear team update. Use when the user asks what shipped, what merged today/yesterday/this week, what changed recently, or for a non-technical update, release note, changelog summary, stakeholder recap, or customer-facing/internal team announcement based on recent PRs or commits.
---

# What Shipped

Create a plain-language shipping summary from live repo truth. Do not rely on memory alone when git, GitHub, deploy, or tracker state can be checked.

## Workflow

1. Establish scope.
   - Use the user's requested window exactly when provided: today, yesterday, this week, since last update, last N PRs, a release branch, or a commit range.
   - For relative dates, use the current local date/time and state the exact date range if the answer could be ambiguous.
   - If the user says "today" after midnight and recent work crossed midnight, inspect both local `git log --since` and merged PR timestamps so the summary reflects the practical working window.

2. Verify repository state.
   - Run `git status --short --branch` to avoid confusing dirty local work with shipped work.
   - Identify the default branch from `gh repo view --json defaultBranchRef` or recent `origin/HEAD`.
   - Refresh the default branch with `git fetch origin <branch>` when safe.

3. Pull merge truth.
   - Prefer GitHub PR data when available:
     - `gh pr list --state merged --limit 30 --json number,title,mergedAt,mergeCommit,url,headRefName`
     - `gh pr view <number> --json number,title,body,files,mergedAt,mergeCommit,url`
   - Cross-check with git history:
     - `git log --oneline --decorate --since='<date>' origin/<default-branch>`
     - Use `--grep='#<number>'` or merge commit hashes when matching PRs to commits.
   - If GitHub is unavailable, summarize from git commit messages and changed paths, clearly saying that PR metadata was not available.

4. Determine whether it actually shipped.
   - Treat "merged" and "live" as different states.
   - If the user asks what shipped/live/deployed, check CI/deploy status when the repo exposes it through `gh run list`, deployment checks, Vercel/Render/Cloudflare tools, or existing project commands.
   - If deploy status cannot be verified, say "merged; deploy not verified" instead of calling it live.

5. Translate for non-technical readers.
   - Group changes by user-visible theme, not by file or subsystem.
   - Explain who benefits and what they can now do or will notice.
   - Avoid implementation details, branch names, test command noise, and internal acronyms unless the audience already uses them.
   - Keep separate sections for product changes, reliability/admin improvements, and follow-up notes only when that helps scanning.

6. Preserve important caveats.
   - Mention required migrations, manual admin steps, feature flags, environment/config changes, or known limitations.
   - Do not expose secrets, sensitive customer data, private URLs with tokens, or noisy CI logs.
   - If there were no user-facing changes, say that directly and summarize the operational value.

## Output Shape

For a quick team update, use:

```md
Here is what shipped today:

1. **Short product theme**
Plain-language explanation of the user/admin benefit.

2. **Short product theme**
Plain-language explanation of the user/admin benefit.

Everything above is merged and deployed. Any caveats or follow-up notes go here.
```

For an internal release note, include:

- Date range checked
- PR numbers and links
- Status: merged, deployed, smoke-tested, or deploy not verified
- Non-technical summary
- Follow-up actions or caveats

## Quality Bar

- Verify first, then summarize.
- Prefer exact PR titles and merge timestamps over guesses.
- State whether deploy and smoke checks were verified.
- Keep the final update concise enough to paste into Slack.
- If the user asks for "what we merged today", include merged-but-not-live work; if they ask "what shipped", include only work confirmed deployed or explicitly label uncertain items.
