# design-loop

A Claude Code skill that runs a complete design-engineering engagement, one session at a time — fully standalone. It bootstraps a constraint system from your codebase itself, then iterates one UI surface per session through an implement → screenshot → critique → fix loop that stops at a human review gate. Taste lives in your repo's `design/` files; this skill is the procedure that creates and applies them.

## The arc

1. **Read before writing** — reads the codebase and product, writes a short point of view (`design/POV.md`)
2. **Constraint system before screens** — derives `tokens.json`, `UI_RULES.md`, and `PATTERNS.md` from the values already in your code, wired into the Tailwind theme so the scale is enforced, not suggested
3. **One vertical slice to world-class** — the most important surface goes all the way and becomes the reference implementation
4. **Systematize outward** — the loop: one surface per session, patterns promoted into the library, unused tokens pruned, every verdict logged
5. **Make yourself replaceable** — the rules, rubric, patterns, and decisions live in files; the constraint system is the deliverable

## Install

Drop the `design-loop/` folder into your skills directory:

```bash
# project-scoped (recommended — versioned with the repo, shared with the team)
cp -r design-loop /path/to/your-project/.claude/skills/

# or global (available in every project)
cp -r design-loop ~/.claude/skills/
```

The directory name `design-loop` becomes the `/design-loop` command. Restart Claude Code or run `/context` to confirm it loaded.

## First run

If your repo has no `design/` directory yet, the skill bootstraps one itself — no other skill required. It reads your codebase and product, writes `POV.md`, derives the constraint system from the values already in use, and stops for the single highest-leverage step: you editing the generated `UI_RULES.md`. After that:

```
/design-loop                 # advance the top backlog surface
/design-loop the settings page   # work a specific surface
```

## What one iteration does, in order

1. Reads `design/{POV.md,UI_RULES.md,tokens.json,PATTERNS.md,DECISIONS.md,BACKLOG.md}`
2. Picks a surface, marks it in-progress
3. Implements against the tokens (no arbitrary values; `var(--token)` references are fine)
4. Screenshots light/dark × desktop/mobile (handles class-based dark mode and next-themes)
5. Critiques: mechanical token lint + 12-point taste rubric
6. Fixes and re-loops until clean — never relaxing a rule to pass
7. Promotes reusable patterns into `PATTERNS.md`, proposes pruning unused ones
8. Stops, shows you the screenshots, asks for a verdict — then logs it verbatim to `DECISIONS.md`

One surface per session. Git history is the audit trail.

## Dependencies

The screenshot step uses Playwright:

```bash
npm i -D playwright && npx playwright install chromium
```

If you'd rather drive the browser with Playwright MCP or `claude --chrome` (useful when surfaces are behind auth), the skill will use that instead — it just needs four screenshots covering both themes and both breakpoints.
