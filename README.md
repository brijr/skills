# brijr/skills

Claude Code skills for building restrained, high-quality product interfaces and pragmatic software.

## Install all skills

To install every skill in this repository:

```sh
npx skills@latest add brijr/skills --skill '*'
```

Use `--all` instead of `--skill '*'` to install every skill for every supported agent without prompts.

## calm-ui

An opinionated visual/interface system skill for React, Next.js, TypeScript, and shadcn/ui. Enforces a calm, restrained aesthetic influenced by Swiss, Japanese, Scandinavian, and German design traditions.

**Install:**

```
npx skills add brijr/skills --skill calm-ui
```

**What it does:**

- Applies restrained design constraints when building pages, components, forms, tables, and dashboards
- Hierarchy through spacing, weight, and alignment — not type size jumps
- Neutral-first color system with semantic accents
- Prevents generic SaaS dashboard energy and default shadcn styling
- Includes a prompt library for build, refinement, and critique workflows

**When it triggers:**

When you build, refine, or review the visual/interface layer of a React, Next.js, TypeScript, or shadcn/ui product. Use `product-design` first when the question is whether an existing screen or flow solves the right user problem; use `craft-ds` when creating `components/ds.tsx`.

**Browse:** [skills.sh/brijr/skills/calm-ui](https://skills.sh/brijr/skills/calm-ui)

## product-design

A product design critique and implementation skill for existing product experiences. Grounds in screenshots, routes, browser state, code, docs, and product context; critiques through *The Design of Everyday Things* and UX principles; proposes a concrete implementation plan; then waits for approval before editing.

**Install:**

```
npx skills add brijr/skills --skill product-design
```

**What it does:**

- Grounds in the actual product context before critiquing
- Identifies user, job-to-be-done, primary action, workflow state, and product promise
- Uses DOET and UX principles — conceptual model, affordances, feedback, mapping, constraints, hierarchy, trust, and accessibility
- Produces prioritized product findings tied to visible UI, code, or docs
- Proposes concrete implementation changes and waits for approval before editing

**When it triggers:**

When you write `/product-design`, ask for a product design critique, UX critique, DOET review, critique-and-implement pass, or want to improve a screen, route, dashboard, form, onboarding flow, workflow, or product experience. It owns product intent and critique; use `calm-ui` for visual execution constraints and `craft-ds` only when the approved plan needs `components/ds.tsx`.

**Browse:** [skills.sh/brijr/skills/product-design](https://skills.sh/brijr/skills/product-design)

## pragmatic

An opinionated greenfield/prototype feature development skill based on *The Pragmatic Programmer* by Andy Hunt and Dave Thomas. Enforces ETC, real DRY, tracer bullets, orthogonality, and broken windows discipline when there is no existing-codebase design gate.

**Install:**

```
npx skills add brijr/skills --skill pragmatic
```

**What it does:**

- ETC (Easy to Change) as the north star for every decision
- Tracer bullets — build thin end-to-end slices before filling in details
- Real DRY — unify knowledge, not code that happens to look similar
- Orthogonality — changes in one area don't ripple into others
- Hard stops on premature abstraction, big-bang builds, copy-paste velocity, and hacky fixes

**When it triggers:**

When you want pragmatic build discipline for a standalone feature, throwaway prototype, spike, script, endpoint, module, or system. For feature work inside an existing codebase, use `software-design`.

**Browse:** [skills.sh/brijr/skills/pragmatic](https://skills.sh/brijr/skills/pragmatic)

## software-design

A feature design and implementation skill for existing codebases. Based on *A Philosophy of Software Design*, with Pragmatic Programmer build discipline and conditional React/Next.js App Router constraints.

**Install:**

```
npx skills add brijr/skills --skill software-design
```

**What it does:**

- Explores the existing codebase silently before saying anything
- Frames the complexity a feature introduces — new state, failure modes, cross-layer dependencies
- Proposes two genuinely different module designs with concrete interfaces, information hiding analysis, and red flag checks
- Hard gate before implementation — no code until the design is approved
- Builds to the agreed interface with tracer bullets, real DRY, orthogonality, and good-enough stopping
- Applies React guidance for data-to-pixels slices, state colocation, props over context, and clean prop interfaces
- Applies Next.js App Router guidance for server/client boundaries, props down/actions up, auth/Zod/revalidation, and route/file placement

**When it triggers:**

Any time you add, implement, build, or scaffold a new feature, endpoint, module, route, component, hook, or system in an existing codebase. This is the canonical existing-codebase feature skill; use `pragmatic` only for greenfield/prototype work with no architecture to inspect. Auto-triggers via a global CLAUDE.md instruction — no manual invocation needed.

**Browse:** [skills.sh/brijr/skills/software-design](https://skills.sh/brijr/skills/software-design)

---

## write-goal

A goal-writing skill for AI coding agents. Turns a rough objective into either a native `/goal` command or a portable agent goal block with a measurable outcome, verification surface, constraints, boundaries, iteration policy, and blocked stop condition. For codebase goals, it does a lightweight read-only repo pass first so the goal can name real files, modules, and commands.

**Install:**

```
npx skills add brijr/skills --skill write-goal
```

**What it does:**

- Drafts compact, reviewable goals from plain-language objectives
- Outputs Codex `/goal ...` commands when appropriate, or portable `Goal:` blocks for other agents
- Inspects repo context for codebase tasks before drafting
- Decides when a Goal is appropriate versus when a normal prompt is better
- Adds auditable completion criteria — tests, benchmarks, reports, artifacts, or source evidence
- Preserves constraints and defines what the agent should report if blocked
- Avoids lifecycle actions — it writes goal text for the user to review

**When it triggers:**

When you write `/write-goal`, ask to draft or tighten an agent goal, or say "turn this into a goal" or "turn this into a /goal".

**Browse:** [skills.sh/brijr/skills/write-goal](https://skills.sh/brijr/skills/write-goal)

---

## explain

A teaching-for-mastery skill for AI coding sessions, files, bugs, PRs, design decisions, or broader concepts. It guides the agent to incrementally explain the target, problem, solution, tradeoffs, edge cases, and impact, while keeping a running Markdown checklist and verifying understanding before moving on.

**Install:**

```
npx skills add brijr/skills --skill explain
```

**What it does:**

- Asks the human to restate their understanding before each teaching stage
- Teaches incrementally across target, problem/concept, solution, and broader context
- Keeps a running Markdown doc with checklist items, gaps, questions, quiz results, and mastery evidence
- Uses open-ended or multiple choice questions to verify understanding
- Supports ELI5, ELI14, and ELII explanation modes without dropping the mastery workflow

**When it triggers:**

When you write `/explain`, `/ explain`, "please explain this to me", ask to understand something deeply or more broadly, request ELI5/ELI14/ELII, or want to be quizzed on the problem, solution, tradeoffs, edge cases, and impact.

**Browse:** [skills.sh/brijr/skills/explain](https://skills.sh/brijr/skills/explain)

---

## clean-up

A behavior-preserving fit-and-finish skill. After you finish a fix or feature, it makes the change *belong* — conforming it to the conventions of the code around it and tying off loose ends, scoped strictly to the recent diff and the files it touched.

**Install:**

```
npx skills add brijr/skills --skill clean-up
```

**What it does:**

- Pins the blast radius from `git diff` and freezes scope to the diff + touched files
- Learns local conventions from the neighbors of each changed file (not a global style guide)
- Proposes a categorized findings checklist — loose ends, convention mismatches, duplication, misplacement
- Hard gate before applying — nothing changes until the checklist is approved
- Discovers and runs the project's typecheck/lint/tests as the final gate, reports green or red
- Never changes behavior — findings that would are flagged, not applied

**When it triggers:**

Right after you finish a change and want it integrated cleanly — "clean this up", "make it fit", "tie off loose ends". Not for greenfield code, strict structural review of unrelated code (use `thermo-nuclear-code-quality-review`), product/UX rework of pre-existing screens or flows (use `product-design`), or unfinished work.

**Browse:** [skills.sh/brijr/skills/clean-up](https://skills.sh/brijr/skills/clean-up)

---

## review-pr

A senior-engineer release review skill for pull requests. Grounds review, explanation, verification, UI preview, merge readiness, and post-merge planning in live git/GitHub state, targeted tests, and real browser smoke when UI is involved.

**Install:**

```
npx skills add brijr/skills --skill review-pr
```

**What it does:**

- Confirms local workspace, PR base/head, and live GitHub state before reviewing
- Leads with blocking code review findings tied to file and line evidence
- Explains product impact, deploy implications, migrations, env/config, queues, cron, and release-note needs
- Verifies on the PR head with targeted tests, diff checks, and package-aware commands
- Uses real preview/local browser smoke for UI flows and reports auth blockers plainly
- Documents merge readiness and post-merge production verification steps

**When it triggers:**

When you ask to review, explain, prepare, merge, smoke test, choose, or get ready to ship a pull request, especially by PR number.

**Browse:** [skills.sh/brijr/skills/review-pr](https://skills.sh/brijr/skills/review-pr)

---

## thermo-nuclear-code-quality-review

An extremely strict maintainability review skill for current-branch changes, based on Cursor's version. It pushes hard on structural simplification, abstraction quality, spaghetti-condition growth, file-size sprawl, type boundaries, and architectural drift.

**Install:**

```
npx skills add brijr/skills --skill thermo-nuclear-code-quality-review
```

**What it does:**

- Looks for "code judo" moves that delete branches, helpers, modes, layers, or concepts
- Treats files crossing 1000 lines, ad-hoc conditionals, feature leakage, thin wrappers, and cast-heavy contracts as serious smells
- Prioritizes structural regressions and missed simplifications over cosmetic comments
- Requires explicit, actionable feedback when the implementation makes the codebase harder to reason about

**When it triggers:**

When you ask for a thermo-nuclear code quality review, thermonuclear review, deep code quality audit, especially harsh maintainability review, or structural PR review.

**Browse:** [skills.sh/brijr/skills/thermo-nuclear-code-quality-review](https://skills.sh/brijr/skills/thermo-nuclear-code-quality-review)

---

## craft-ds

A single-file design system skill inspired by [craft-ds](https://github.com/brijr/craft). Enforces the one-file constraint, semantic HTML primitives, `cn()` escape hatches, and the layout/content separation principle. Two variants — Tailwind and CSS.

**Install:**

```
npx skills add brijr/skills --skill craft-ds
```

**What it does:**

- One-file design system contract — all layout primitives and prose typography in `components/ds.tsx`
- Semantic HTML wrappers (Section, Container, Main, Nav) with sensible defaults
- Prose typography system for markdown, articles, and AI-generated content
- Two variants: Tailwind (clsx + tailwind-merge) and CSS (clsx + ds.css)
- Extension rules to keep the file clean as it grows
- Hard stops on multi-file splitting, prop-driven variants, state in primitives, and hardcoded colors

**When it triggers:**

Any time you create or maintain `components/ds.tsx`, set up layout primitives, or build a prose typography system. Use `calm-ui` for shadcn/component visual refinement and `product-design` for product/UX critique of an existing experience.

**Browse:** [skills.sh/brijr/skills/craft-ds](https://skills.sh/brijr/skills/craft-ds)

---

## design-loop

An AI design-engineer loop skill. Runs one iteration on one UI surface — implement against the project's constraint system, screenshot, critique, fix until clean, promote reusable patterns — then stops at a human review gate. Taste lives in your repo's `design/` files; the skill is the procedure that applies it.

**Install:**

```
npx skills add brijr/skills --skill design-loop
```

**What it does:**

- Reads `design/{UI_RULES.md,tokens.json,PATTERNS.md,DECISIONS.md,BACKLOG.md}` and picks the top backlog surface
- Implements with token values only — a bundled lint script fails any arbitrary value, off-scale spacing, or non-token color
- Screenshots light/dark at desktop and mobile widths, then critiques against a 12-point taste rubric
- Loops fix → re-screenshot → re-critique until clean, never relaxing a rule to pass
- Promotes reusable components into `PATTERNS.md` so the system compounds
- Stops at a human gate and logs the verdict verbatim to `DECISIONS.md`

**When it triggers:**

When you write `/design-loop`, ask to run the design loop, redesign a screen against the system, or advance work tracked in `UI_RULES.md`, `tokens.json`, `PATTERNS.md`, `DECISIONS.md`, or `BACKLOG.md`. One surface per session — the git history becomes the audit trail.

**Browse:** [skills.sh/brijr/skills/design-loop](https://skills.sh/brijr/skills/design-loop)
