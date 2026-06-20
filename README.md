# brijr/skills

Claude Code skills for building restrained, high-quality product interfaces, pragmatic software, and evaluating ventures against MJ DeMarco's Fastlane framework.

## Install all skills

To install every skill in this repository:

```sh
npx skills@latest add brijr/skills --skill '*'
```

Use `--all` instead of `--skill '*'` to install every skill for every supported agent without prompts.

## Which skill, when

Skills fire three ways: you type `/name`, your agent matches your phrasing against the skill's description, or a CLAUDE.md rule forces one. Recommended: add a global CLAUDE.md rule that auto-triggers `software-design` whenever you say "add / implement / build X" in an existing codebase — it's the skill you want firing without having to remember it.

### Writing code

- **New feature in an existing codebase** → `software-design`. Explores first, proposes two designs, and stops for your approval before any code. Your job is the gate.
- **Greenfield, prototype, spike, or script** → `pragmatic`. Same build discipline, no design gate — there's no architecture to inspect. If the feature must live inside existing code, it's `software-design`; never stack both.
- **A change just landed and works** → `clean-up`. Freezes scope to the diff, proposes a checklist, waits for approval, never changes behavior. The natural last step of a feature session.
- **Behavior is right but the structure feels worse** → `thermo-nuclear-code-quality-review`. Explicit invoke only; it hunts for deletions, not additions.

### Working on UI

| You're asking… | Use |
|---|---|
| "Is this screen even the right experience?" | `product-design` |
| "Make this look right" (React/Next.js/shadcn) | `calm-ui` |
| Same question, any other stack | `ui-principles` |
| "Set up layout primitives / `ds.tsx`" | `craft-ds` |
| "Redesign this whole product, properly" | `design-loop` |

Order of operations: `product-design` before `calm-ui` — product intent first, visual execution second. `calm-ui` and `ui-principles` are the same aesthetic (one is the React/shadcn binding, one the framework-agnostic core), so the stack picks for you.

`design-loop` is an engagement, not a pass: the first run bootstraps `/design.md` from your codebase and stops for the highest-leverage step — you editing that canonical contract. Every later run takes one surface through brief → reference calibration → implement → screenshot → critique → bold revision → your verdict at a human gate. One surface per session; git is the audit trail.

### Shipping

- **"Get PR #42 ready / merge it / is it safe?"** → `review-pr`. It owns the release path — live PR state, tests on the PR head, real-screenshot UI smoke, merge readiness, post-merge verification. Run your agent's built-in diff review first; `review-pr` folds those findings into its verdict.

### Meta

- **Handing an agent a long, multi-step objective** → `write-goal`. Produces goal text with an auditable finish line, ready for a native goal command or as a portable prompt block.
- **You want to understand, not just have it done** → `explain`. A mastery loop (restate → teach → quiz) — heavier than asking a question, worth it when you want to be tested.

### Recipes

1. **Feature day:** "add X" (`software-design`) → approve a design → build → `clean-up` → built-in code review → `review-pr` to ship.
2. **UI improvement:** `product-design` critique → approve the plan → `calm-ui` constraints govern the implementation → `clean-up`.
3. **Product redesign:** `design-loop` bootstrap → edit `/design.md` → one `/design-loop` per session until the backlog is done.

Common mistakes: invoking `pragmatic` inside an existing codebase (`software-design` already contains it), using `calm-ui` for marketing pages (product UI only), running `design-loop` for a one-off tweak (`calm-ui` is the right size), and treating `review-pr` as a code reviewer (it's a shipper).

### Evaluating ventures

| You're asking… | Use |
|---|---|
| "Is this idea a real wealth vehicle?" | `cents-audit` |
| "Am I building a money tree or a disguised job?" | `fastlane-audit` |
| "Does anyone actually want this?" | `need-validation` |
| "Can this scale without me?" | `scale-assessment` |
| "Design this as a system that runs without me" | `wealth-system-design` |

All five are based on MJ DeMarco's *The Millionaire Fastlane* and *UNSRIPTED*. They share a common language — CENTS commandments, money trees, the wealth equation, Fastlane vs Slowlane. `cents-audit` is the broadest evaluation; the other four go deep on one dimension. Run `cents-audit` first, then drill into the weakest commandment with its dedicated skill.

## calm-ui

An opinionated visual/interface system skill for React, Next.js, TypeScript, and shadcn/ui — the stack-specific binding of the `ui-principles` core, with the numbers filled in. Enforces a calm, restrained aesthetic influenced by Swiss, Japanese, Scandinavian, and German design traditions.

**Install:**

```
npx skills add brijr/skills --skill calm-ui
```

**What it does:**

- Applies restrained design constraints when building pages, components, forms, tables, and dashboards
- Hierarchy built space → color → weight → size — body plus one deliberate statement size, never scattered jumps
- Neutral-first color system with semantic accents
- Prevents generic SaaS dashboard energy and default shadcn styling
- Includes a prompt library for build, refinement, and critique workflows

**When it triggers:**

When you build, refine, or review the visual/interface layer of a React, Next.js, TypeScript, or shadcn/ui product. On stacks without React/shadcn, use `ui-principles` — the framework-agnostic core of the same aesthetic. Use `product-design` first when the question is whether an existing screen or flow solves the right user problem; use `craft-ds` when creating `components/ds.tsx`. These rules can also seed `/design.md` for the `design-loop` skill.

**Browse:** [skills.sh/brijr/skills/calm-ui](https://skills.sh/brijr/skills/calm-ui)

## ui-principles

The framework-agnostic core of the calm, restrained UI system — rules, not numbers — built on seventeen Principles of UI Design. Enforces one alignment spine, deliberate symmetric padding, disciplined hierarchy through space/color/weight/size, rare color, honest interactive states, and designed empty/loading/error states. `calm-ui` is its React/Next.js/shadcn binding.

**Install:**

```
npx skills add brijr/skills --skill ui-principles
```

**What it does:**

- Applies the "calm confidence" aesthetic to pages, components, forms, tables, dashboards, layouts, and screens
- Fixes in priority order: alignment, padding, hierarchy, color, then motion
- Keeps project tokens as the source of truth instead of hardcoding a one-off scale, palette, spacing system, or radius
- Preserves type hierarchy through space, color, weight, and deliberate size choices
- Designs empty, loading, error, disabled, hover, focus, and active states as first-class UI
- Includes principles and worked before/after examples for reviewing and refining interfaces

**When it triggers:**

When you write `/ui-principles`, ask for framework-agnostic UI principles, or want a calm, restrained pass on a stack without React/Next.js/shadcn (plain HTML/CSS, Vue, Svelte, emails, server-rendered templates). On React/Next.js/shadcn projects, use `calm-ui` — the binding of these same principles with concrete numbers; the two never disagree. Use `product-design` first when the question is whether the product flow solves the right problem. These principles can also seed `/design.md` for the `design-loop` skill.

**Browse:** [skills.sh/brijr/skills/ui-principles](https://skills.sh/brijr/skills/ui-principles)

---

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

When you write `/product-design`, ask for a product design critique, UX critique, DOET review, critique-and-implement pass, or want to improve a screen, route, dashboard, form, onboarding flow, workflow, or product experience. It owns product intent and critique; use `calm-ui` for visual execution constraints and `craft-ds` only when the approved plan needs `components/ds.tsx`. Findings can also seed `/design.md` for the `design-loop` skill.

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

When you want pragmatic build discipline for a standalone feature, throwaway prototype, spike, script, endpoint, module, or system. For feature work inside an existing codebase, use `software-design` — it carries the same build discipline (intentionally duplicated, since skills install standalone).

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

Any time you add, implement, build, or scaffold a new feature, endpoint, module, route, component, hook, or system in an existing codebase. This is the canonical existing-codebase feature skill; use `pragmatic` only for greenfield/prototype work with no architecture to inspect (its build discipline is intentionally duplicated here, since skills install standalone). Auto-triggers via a global CLAUDE.md instruction — no manual invocation needed.

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

A ship-a-PR skill that takes a pull request the last mile. Owns the release path — live PR state, verification on the PR head, real-browser UI smoke, merge readiness, merge, and post-merge production verification — and defers line-by-line diff review to your agent's built-in review commands, folding their findings into the readiness verdict.

**Install:**

```
npx skills add brijr/skills --skill review-pr
```

**What it does:**

- Confirms local workspace, PR base/head, and live GitHub state before anything else
- Surfaces release-blocking findings only — behavior, permissions, migrations, data safety, irreversible operations — and folds in built-in review results
- Explains product impact, deploy implications, migrations, env/config, queues, cron, and release-note needs
- Verifies on the PR head with targeted tests, diff checks, and package-aware commands
- Smokes UI with whatever browser capability the session has, using real screenshots only — never mockups or synthetic images — and reports auth blockers plainly
- Documents merge readiness, merges when clear, and verifies migrations/CI/deploy/production smoke after merge

**When it triggers:**

When you ask to prepare, verify, smoke test, merge, ship, or get a pull request ready or live, especially by PR number. For line-by-line code review of the diff itself, use your agent's built-in review command first.

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

Any time you create or maintain `components/ds.tsx`, set up layout primitives, or build a prose typography system. Use `calm-ui` for shadcn/component visual refinement and `product-design` for product/UX critique of an existing experience. In projects running the `design-loop` skill, `ds.tsx` primitives index into `/design.md`.

**Browse:** [skills.sh/brijr/skills/craft-ds](https://skills.sh/brijr/skills/craft-ds)

---

## design-loop

A standalone AI design-engineer engagement skill, run one session at a time. Bootstraps a Vercel-style `/design.md` contract from your codebase itself, then iterates one UI surface per session through brief → reference calibration → implement → screenshot → critique → bold revision, stopping at a human review gate. Taste lives in `/design.md`; loop state lives under `design/`.

**Install:**

```
npx skills add brijr/skills --skill design-loop
```

**What it does:**

- Bootstraps standalone when no `/design.md` exists — reads the codebase and product, then drafts token frontmatter plus human guidance from the values already in use
- Stops for the highest-leverage step: the human editing the generated `/design.md`
- Takes the most important surface to world-class first — the reference slice everything else is judged against
- Writes a surface brief before code: user job, primary object, primary action, hierarchy, density, references, anti-references, and what to remove
- Implements with token values only — a bundled lint script fails arbitrary values, off-scale spacing, and raw colors (`var(--token)` references pass)
- Screenshots light/dark at desktop and mobile widths (handles class-based dark mode), then critiques against a 15-point taste rubric plus a design critique
- Loops fix → re-screenshot → re-critique until clean, including one bold revision when the first pass is compliant but generic, noisy, or weakly structured; never relaxing a rule to pass
- Promotes reusable components back into `/design.md`, prunes unused tokens, and logs every human verdict verbatim to `design/DECISIONS.md` so the system compounds

**When it triggers:**

When you write `/design-loop`, ask to run the design loop, bootstrap a design system for an app, redesign a screen against the system, or advance work tracked in `/design.md`, `design.dark.md`, `design/DECISIONS.md`, `design/BACKLOG.md`, briefs, or reviews. One surface per session — the git history becomes the audit trail.

**Browse:** [skills.sh/brijr/skills/design-loop](https://skills.sh/brijr/skills/design-loop)

---

## cents-audit

A venture evaluation skill based on MJ DeMarco's Five Commandments of Wealth (CENTS) from *The Millionaire Fastlane*. Scores a business or opportunity on Control, Entry, Need, Time, and Scale — each 0–10 with evidence — then identifies the weakest commandment as the bottleneck and produces a Fastlane / Aspiring Fastlane / Slowlane / Dead End verdict with specific fixes.

**Install:**

```
npx skills add brijr/skills --skill cents-audit
```

**What it does:**

- Scores all five CENTS commandments with specific, evidence-based reasoning
- Identifies the weakest commandment as the venture's bottleneck
- Produces a go/no-go verdict with the reasoning
- Outputs specific, actionable fixes — not "improve marketing" but "add a recurring revenue component by X"
- Enforces honesty: a venture that scores 10 on four commandments and 0 on one is NOT a Fastlane

**When it triggers:**

When you write `/cents-audit`, ask to evaluate a business idea or opportunity, want to know if a venture is "fastlane", or reference CENTS, the Five Commandments, or *The Millionaire Fastlane*. Use `fastlane-audit` to go deep on time-decoupling, `need-validation` for market need, `scale-assessment` for scaling analysis, and `wealth-system-design` to design a money-tree system.

**Browse:** [skills.sh/brijr/skills/cents-audit](https://skills.sh/brijr/skills/cents-audit)

---

## fastlane-audit

A time-decoupling and leverage audit based on MJ DeMarco's wealth equation from *The Millionaire Fastlane*. Measures whether a business is genuinely decoupling time from money — the core distinction between a Fastlane wealth vehicle and a disguised job. Scores revenue time-coupling, leverage mechanisms, fulfillment dependence, the hit-by-a-bus test, and trajectory.

**Install:**

```
npx skills add brijr/skills --skill fastlane-audit
```

**What it does:**

- Maps every revenue stream to its time-coupling pattern (recurring automated → hourly billing)
- Identifies which leverage mechanisms are in play (code, content, distribution, capital, people, brand)
- Maps the fulfillment path and counts founder-coupled nodes
- Runs the 60-day hit-by-a-bus survival test
- Checks whether decoupling is improving, flat, or regressing over time
- Identifies the #1 decoupling bottleneck — the single highest-leverage change

**When it triggers:**

When you write `/fastlane-audit`, ask "is this a real business or a job", want to check if you're building a money tree or trading hours for dollars, or reference the Fastlane, time decoupling, or the wealth equation.

**Browse:** [skills.sh/brijr/skills/fastlane-audit](https://skills.sh/brijr/skills/fastlane-audit)

---

## need-validation

A market need evaluation based on the Commandment of Need from *The Millionaire Fastlane*. Tests whether the market has a raw, urgent, credit-card-out want — not a "nice to have". Scores pain intensity, existing spend evidence, urgency, market pull signals, and the painkiller-vs-vitamin classification. Recommends the cheapest possible validation experiment.

**Install:**

```
npx skills add brijr/skills --skill need-validation
```

**What it does:**

- Scores need across five dimensions: pain intensity, existing spend, urgency, market pull, painkiller vs vitamin
- Classifies pain honestly: bleeding neck, active pain, background friction, nice to have, or solution-seeking-a-problem
- Checks for existing spend evidence (competitors, adjacent spend, DIY solutions, or nothing)
- Recommends the cheapest validation experiment: pre-sell, concierge test, fake door, competitor interviews, or search mining
- Produces a Strong Need / Real Need / Weak Need / No Need verdict

**When it triggers:**

When you write `/need-validation`, ask "does anyone actually want this", want to validate a product idea before building, or reference the Commandment of Need.

**Browse:** [skills.sh/brijr/skills/need-validation](https://skills.sh/brijr/skills/need-validation)

---

## scale-assessment

A scaling and leverage analysis based on MJ DeMarco's concepts of Scale from *The Millionaire Fastlane*. Evaluates whether a business can serve 10x the customers without 10x the cost, time, or effort. Scores revenue per unit of effort, marginal cost curve, the primary constraint, leverage multiplier, and ceiling analysis.

**Install:**

```
npx skills add brijr/skills --skill scale-assessment
```

**What it does:**

- Maps the revenue model to its scaling pattern (exponential → linear)
- Plots the marginal cost curve (approaches zero → increases super-linearly)
- Identifies the primary growth constraint and whether it's fixable
- Calculates the leverage multiplier: annual revenue per founder hour
- Projects the theoretical revenue ceiling and whether the model can reach 50% of it
- Identifies the #1 scaling unlock — the single change that shifts from linear to super-linear

**When it triggers:**

When you write `/scale-assessment`, ask "can this scale", want to find the ceiling on your business, or reference scale, leverage, or marginal cost.

**Browse:** [skills.sh/brijr/skills/scale-assessment](https://skills.sh/brijr/skills/scale-assessment)

---

## wealth-system-design

A money-tree system design skill based on MJ DeMarco's five money-tree types from *The Millionaire Fastlane*: rental, computer, content, distribution, and people systems. Designs or restructures a venture as a system that produces income while you sleep. Maps the full system architecture, identifies automation and delegation opportunities, defines decoupling milestones from M0 (fully coupled) to M5 (fully decoupled), and defines asset value.

**Install:**

```
npx skills add brijr/skills --skill wealth-system-design
```

**What it does:**

- Selects the primary money-tree type based on available assets and market fit
- Maps the full system architecture: acquisition → activation → delivery → revenue → retention → referral
- Identifies automation opportunities for each coupled stage
- Identifies delegation opportunities with playbook and role requirements
- Defines decoupling milestones (M0–M5) with triggers, timelines, and blockers
- Defines asset value: recurring revenue, proprietary assets, transferable systems, and valuation multiple

**When it triggers:**

When you write `/wealth-system-design`, ask to design a passive income system, want to restructure a business as a money tree, or reference money trees, system design, or decoupling revenue.

**Browse:** [skills.sh/brijr/skills/wealth-system-design](https://skills.sh/brijr/skills/wealth-system-design)
