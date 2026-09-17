# calm-ui

A skill that refines React, Next.js, and shadcn/ui interfaces into a calm, restrained visual language — quiet surfaces, disciplined typography, semantic color. It is an opinionated constraint system, not generic advice: most rules guide review, while type scale ceilings, radius, shadow, spacing tokens, and CSS variable usage are hard limits.

The aesthetic draws from Swiss, Japanese, Scandinavian, and German design traditions. The result should feel authored, not templated — human, not corporate; quiet, not busy.

## When to use it

Use `calm-ui` when the requested direction calls for calm visual styling: refining an existing screen, building a new page or component in the restrained language, or running a critique pass. Focused corrections proceed directly — a styling request needs no product critique or another skill first.

For non-React stacks, the sibling skill `ui-principles` carries the same aesthetic as framework-agnostic rules. The two never disagree.

## Install

Drop the `calm-ui/` folder into your skills directory:

```bash
# project-scoped (recommended — versioned with the repo, shared with the team)
cp -r calm-ui /path/to/your-project/.claude/skills/

# or global (available in every project)
cp -r calm-ui ~/.claude/skills/
```

Other agents can use the [Agent Skills format](https://agentskills.io/specification), but discovery directories differ — follow your agent's instructions. Keep the `references/` folder next to `SKILL.md`.

## How to use it well

Name the direction and scope. The skill inspects the relevant component and its defaults, makes the authorized change, and visually checks the result:

```text
/calm-ui                      # refine the current screen toward the calm language
/calm-ui this settings page   # work a specific surface
```

For broader visual work, establish hierarchy and the applicable design reference before implementation. Behavior, permissions, and existing interactions are preserved — this skill changes styling, not product decisions.

## What's inside

```text
calm-ui/
├── SKILL.md                       Activation, boundaries, workflow
└── references/
    ├── visual-details.md          Full constraint system: tokens, hard limits,
    │                              default-vs-refined shadcn examples, dark mode,
    │                              responsive rules, pre-ship checklist
    ├── prompt-library.md          Copy-paste prompts for builds, refinement
    │                              passes, critiques, and one-liner injections
    └── system-prompt.md           Portable condensed rules for pasting into a
                                   CLAUDE.md in another project
```

## Core constraints

- Hierarchy escalates space → color → weight → size; body plus one deliberate statement size, never scattered sizes.
- Only shadcn CSS-variable color classes — no hardcoded `bg-gray-*` or `bg-white`, which break dark mode.
- Type scale `text-xs`–`text-lg` in product UI (`text-xl` for page titles only); `shadow-sm` or none; `--radius` at `0.375rem`–`0.5rem`.
- Neutral surfaces carry the design; accent color is used sparingly, for meaning.
- Never ship default-looking shadcn components.
