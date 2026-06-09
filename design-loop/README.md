# design-loop

A Claude Code skill that runs one iteration of the AI design-engineer loop on a single UI surface, then stops at a human review gate. Taste lives in your repo's `design/` files; this skill is the procedure that applies it.

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

If your repo has no `design/` directory yet, the skill walks you through bootstrapping one (generates the constraint system, then has you edit `UI_RULES.md` — the single highest-leverage step). After that:

```
/design-loop                 # advance the top backlog surface
/design-loop the settings page   # work a specific surface
```

## What it does, in order

1. Reads `design/{UI_RULES.md,tokens.json,PATTERNS.md,DECISIONS.md,BACKLOG.md}`
2. Picks a surface, marks it in-progress
3. Implements against the tokens (no arbitrary values)
4. Screenshots light/dark × desktop/mobile
5. Critiques: mechanical lint + 12-point taste rubric
6. Fixes and re-loops until clean
7. Promotes any reusable pattern into `PATTERNS.md`
8. Stops, shows you the screenshots, asks for a verdict — then logs it to `DECISIONS.md`

One surface per session. Git history is the audit trail.

## Dependencies

The screenshot step uses Playwright:

```bash
npm i -D playwright && npx playwright install chromium
```

If you'd rather drive the browser with Playwright MCP or `claude --chrome`, the skill will use that instead — it just needs four screenshots covering both themes and both breakpoints.
