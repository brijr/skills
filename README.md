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

## refactor-ui

A diagnose-then-edit skill for refactoring existing UI. Asks a few meaning-focused questions (not aesthetic ones), proposes a ranked plan, then edits the code. Works on images, component files, or both.

**Install:**

```
npx skills add brijr/skills --skill refactor-ui
```

**What it does:**

- Four-phase flow — observe (silent), diagnose and ask, propose ranked plan, edit
- Meaning-first questions — what the UI represents, signal vs. noise, what's locked, then aesthetic direction
- Tailors questions to the actual elements in the input — no generic "what do you want?"
- Defaults to restrained taste when no direction is given — primary action wins, one status pattern, human data replaces machine data
- Hard stops on aesthetic question stacking, scope creep, inventing new components, and before/after essays

**When it triggers:**

Any time you point at a specific component, screen, or pattern — via image, code, or both — and ask to refactor, improve, or clean it up.

**Browse:** [skills.sh/brijr/skills/refactor-ui](https://skills.sh/brijr/skills/refactor-ui)

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

## pragmatic-react

The same Pragmatic Programmer constraint system as `pragmatic`, tailored specifically to React development. Adds React-specific guidance on component extraction, state colocation, prop interfaces, hooks, context, and vertical-slice UI development.

**Install:**

```
npx skills add brijr/skills --skill pragmatic-react
```

**What it does:**

- ETC (Easy to Change) applied to components, state, and props
- Tracer bullets — render real data on screen end-to-end before building out
- Real DRY — don't extract shared components just because JSX looks similar
- Orthogonality — colocate state, keep components self-contained, props over context for local data
- Hard stops on premature component/hook extraction, prop explosion, context-as-global-state, and speculative generality

**When it triggers:**

Any time you build, implement, add, or scaffold a React component, page, hook, or feature.

**Browse:** [skills.sh/brijr/skills/pragmatic-react](https://skills.sh/brijr/skills/pragmatic-react)

## nextjs-arch

A clean Next.js App Router architecture skill based on a proven production structure. Enforces directory layout, server/client boundaries, data flow patterns, auth gating, server actions, and naming conventions.

**Install:**

```
npx skills add brijr/skills --skill nextjs-arch
```

**What it does:**

- Canonical directory structure — every file has exactly one correct home
- Strict server/client boundary — default to server, `"use client"` only when needed
- One data flow pattern — server fetches, props down, actions up, revalidate after mutation
- Auth gate once in layout, auth check in every server action
- Hard stops on client-side fetching, custom components in `ui/`, actions without auth, and API routes for mutations

**When it triggers:**

Any time you build, scaffold, or restructure routes, components, actions, or data layers in a Next.js App Router project.

**Browse:** [skills.sh/brijr/skills/nextjs-arch](https://skills.sh/brijr/skills/nextjs-arch)

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
