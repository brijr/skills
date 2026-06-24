# design-loop

A Claude Code skill that runs a complete design-engineering engagement, one session at a time — fully standalone. It bootstraps a Vercel-style `/design.md` contract from your codebase itself, then iterates one UI surface per session through brief → reference calibration → implement → screenshot → critique → bold revision → human review. Taste lives in `/design.md`; operational loop state lives under `design/`.

## The arc

1. **Read before writing** — reads the codebase, product, and current UI values
2. **Contract before screens** — drafts `/design.md` with token frontmatter and human guidance
3. **Quality target before code** — every surface gets a brief: user job, primary object, hierarchy, density, references, anti-references, and what to remove
4. **One vertical slice to world-class** — the most important surface goes all the way and becomes the reference implementation
5. **Systematize outward** — one surface per session, patterns promoted into `/design.md`, unused tokens pruned, every verdict logged
6. **Make yourself replaceable** — the contract, rubric, decisions, briefs, and reviews live in files

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

If your repo has no `/design.md` yet, the skill bootstraps one itself — no other skill required. It reads your codebase and product, drafts token frontmatter plus Markdown guidance, creates `design/BACKLOG.md` and `design/DECISIONS.md`, asks targeted taste questions, and stops for the single highest-leverage step: you editing `/design.md`. After that:

```text
/design-loop                    # advance the top backlog surface
/design-loop the settings page  # work a specific surface
```

## How to use it well

Treat bootstrap as contract drafting, not setup busywork. Review the generated
`/design.md`, correct the product assumptions, and answer the taste questions
with concrete references and anti-references: density, color usage, elevation,
and what the product should absolutely not feel like.

Review `design/BACKLOG.md` before the first iteration. The skill infers
surfaces from routes, navigation, component structure, and product flows, but it
cannot reliably know hidden business priority or every state-only surface. Add
or reorder auth states, onboarding, modals, empty/error states, admin-only
screens, mobile-only flows, and anything users live in that the code does not
make obvious.

Run one surface per session. Let `/design-loop` advance the top backlog item
when the queue is right, or name a surface directly when priority matters. Make
the surface renderable before the screenshot step: provide local data, auth, a
target URL, or browser access for flows behind login.

At the human gate, give verdicts that can become durable rules. "Approved, but
all settings section headers should use weight 500" is more useful than "looks
better." General verdicts get logged to `design/DECISIONS.md` and should be
promoted back into `/design.md` so the next surface starts smarter.

When running in Codex with the Browser plugin available, the skill should open
the final reviewed surface in the in-app Browser, make it visible, and leave it
there while it asks for your verdict. The screenshots and review artifact still
matter; the Browser page is the live review surface.

## What one iteration does, in order

1. Reads `/design.md`, optional `/design.dark.md`, `design/BACKLOG.md`, and `design/DECISIONS.md`
2. Picks a surface, marks it in-progress
3. Writes `design/briefs/<surface>-<timestamp>.md` with the quality target and references
4. Implements against the contract and the brief (no arbitrary values; `var(--token)` references are fine)
5. Screenshots light/dark × desktop/mobile (handles class-based dark mode and next-themes)
6. Critiques: mechanical token lint + 15-point taste rubric + design critique
7. Makes one bold revision when the first pass is compliant but generic, noisy, or weakly structured
8. Promotes reusable patterns into `/design.md`, proposes pruning unused ones
9. Stops, opens the review page in Codex Browser when available, shows you the screenshots, asks for a verdict — then logs it verbatim to `design/DECISIONS.md`

One surface per session. Git history is the audit trail.

## Dependencies

The screenshot step uses Playwright:

```bash
npm i -D playwright && npx playwright install chromium
```

In Codex, the Browser plugin is preferred for authenticated or user-visible
review flows, and the final review page should be left open there at the human
gate. If you'd rather drive the browser with Playwright MCP or `claude
--chrome`, the skill can use that instead — it just needs four screenshots
covering both themes and both breakpoints.
