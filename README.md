# brijr/skills

Claude Code skills for building restrained, high-quality product interfaces and pragmatic software.

## calm-ui

An opinionated design system skill for React, Next.js, TypeScript, and shadcn/ui. Enforces a calm, restrained aesthetic influenced by Swiss, Japanese, Scandinavian, and German design traditions.

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

Any time you build, refine, critique, or review UI in a shadcn/ui project.

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

When you write `/product-design`, ask for a product design critique, UX critique, DOET review, critique-and-implement pass, or want to improve a screen, route, dashboard, form, onboarding flow, workflow, or product experience.

**Browse:** [skills.sh/brijr/skills/product-design](https://skills.sh/brijr/skills/product-design)

## pragmatic

An opinionated feature development skill based on *The Pragmatic Programmer* by Andy Hunt and Dave Thomas. Enforces ETC, real DRY, tracer bullets, orthogonality, and broken windows discipline.

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

Any time you build, implement, add, or scaffold a new feature.

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

Any time you add, implement, build, or scaffold a new feature, endpoint, module, route, component, hook, or system in an existing codebase. Auto-triggers via a global CLAUDE.md instruction — no manual invocation needed.

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

Right after you finish a change and want it integrated cleanly — "clean this up", "make it fit", "tie off loose ends". Not for greenfield code, general quality passes on unrelated code (use `simplify`), product/UX rework of pre-existing screens or flows (use `product-design`), or unfinished work.

**Browse:** [skills.sh/brijr/skills/clean-up](https://skills.sh/brijr/skills/clean-up)

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

Any time you create a design system, add `ds.tsx`, set up layout primitives, or build a typography system.

**Browse:** [skills.sh/brijr/skills/craft-ds](https://skills.sh/brijr/skills/craft-ds)
