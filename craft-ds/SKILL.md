---
name: craft-ds
description: Create and maintain a single-file design system (ds.tsx) for layout primitives and prose typography. Enforces semantic HTML, one-file constraint, cn() escape hatches, and the layout/content separation principle. Two variants — Tailwind and CSS. Use when the user asks to create a design system, add ds.tsx, set up layout primitives, build a typography system, or scaffold page structure. Do not use for component libraries, marketing page design, or shadcn/ui component customization.
---

# craft — single-file design system

This skill enforces a specific approach to building design systems: one file, semantic HTML, sensible defaults, escape hatches via `cn()`. It is not generic guidance — it is an opinionated constraint system for layout primitives and prose typography.

Inspired by [craft-ds](https://github.com/brijr/craft). Read every rule before generating `ds.tsx`. Every rule is testable — you should be able to look at the file and answer yes/no.

## Core Principle

**One file. Semantic HTML. Tailwind or CSS defaults. `cn()` for everything else.**

A design system is a contract between the codebase and every developer (human or AI) who touches it. The `ds.tsx` file is that contract. It provides:

- **Layout primitives** — structural composition for every page
- **Prose typography** — rendered content styling for markdown, articles, AI output
- **`cn()` utility** — the escape hatch that lets consumers override defaults without forking

The file is small enough to read in one sitting, powerful enough to structure an entire site.

## Two Variants

Every project gets one variant. Choose before generating.

| Variant | When to use | Dependencies |
|---------|-------------|-------------|
| **Tailwind** | Project already uses Tailwind CSS (most Next.js/shadcn projects) | `clsx`, `tailwind-merge` |
| **CSS** | No Tailwind, vanilla CSS, or framework-agnostic projects | `clsx` only (no tailwind-merge) |

Reference implementations live in `references/`:
- `references/ds-tailwind.tsx` — Tailwind variant
- `references/ds-css.tsx` — CSS variant (pairs with `ds.css`)
- `references/ds.css` — Stylesheet for CSS variant

These are starting points, not copy-paste templates. Adapt defaults to the project.

## 1. The One-File Constraint

The entire design system lives in a single `ds.tsx` file at `components/ds.tsx`.

### Rules

- **One file.** All layout primitives and prose live in `ds.tsx`. No splitting into `layout.tsx`, `typography.tsx`, `utils.tsx`.
- **`cn()` is the first export.** Every component uses it. Consumers use it to override.
- **Semantic HTML only.** Each component wraps exactly one semantic element: `<section>`, `<nav>`, `<main>`, `<article>`, `<div>` (for Container). No `<div>` soup.
- **Props are minimal.** `className`, `children`, `id`, `style`. Add component-specific props only when the component genuinely needs them (e.g., `isArticle` on Prose).
- **No business logic.** `ds.tsx` knows nothing about auth, data, routing, or state. It is pure layout and typography.
- **No dependencies on project code.** `ds.tsx` imports only from `clsx`, `tailwind-merge` (Tailwind variant), and React. Never from `@/lib`, `@/hooks`, or other project files.

## 2. Layout Primitives

These are the structural building blocks. Every page composes from these.

### Required Exports

| Export | Element | Purpose | Default behavior |
|--------|---------|---------|-----------------|
| `cn()` | — | Class merging utility | `twMerge(clsx(...))` or `clsx(...)` |
| `Section` | `<section>` | Semantic page section | Vertical padding, responsive |
| `Container` | `<div>` | Centered content wrapper | Max-width, horizontal padding |
| `Main` | `<main>` | Primary content area | Minimal — a semantic hook |
| `Nav` | `<nav>` | Navigation bar | Inner container for alignment |

### Optional Exports

| Export | Element | When to include |
|--------|---------|----------------|
| `Layout` | `<html>` | Only if the project needs a root HTML wrapper (Next.js root layout) |
| `Footer` | `<footer>` | Only if the project has a consistent footer pattern |
| `Aside` | `<aside>` | Only if the project has sidebar content |

### Rules

- **Every layout primitive accepts `className`.** This is non-negotiable. It's how consumers escape defaults.
- **Defaults are opinions, not requirements.** `max-w-5xl` is a starting point. The consumer overrides with `className="max-w-3xl"` — and `cn()` handles the merge.
- **Responsive by default.** Padding and spacing use responsive breakpoints (`p-4 sm:p-6` or equivalent CSS).
- **Composable, not nested.** `Section` doesn't contain `Container`. The consumer composes:

```tsx
<Section>
  <Container>
    {/* content */}
  </Container>
</Section>
```

- **No implicit children wrapping.** Components render children directly. No extra `<div>` wrappers inside unless the component needs them (Nav's inner container is the exception — it's structural).

## 3. Prose — The Content Layer

Prose is the typography system for rendered content. It styles all descendant HTML elements so markdown, MDX, and AI-generated content look good without per-element styling.

### When to Include Prose

| Project type | Include Prose? |
|-------------|---------------|
| Blog, docs, content site | Yes — it's the primary value |
| AI chat, AI-generated content | Yes — AI outputs markdown |
| Dashboard, admin panel | Optional — only if there's a rich-text display area |
| Pure app UI (forms, tables, modals) | No — use component composition |

### What Prose Styles (the core 80%)

Always include these descendant styles:

- **Headings** (h1–h6) — responsive sizes, tight tracking, balanced text
- **Paragraphs** — readable base size, pretty text wrapping
- **Links** — distinguishable from body text, hover state, not styled inside headings
- **Lists** (ul, ol) — proper indentation, custom bullet styling for unordered
- **Code** — inline code (bordered, background) vs. code blocks (pre > code, no double-styling)
- **Blockquotes** — left border, muted color, subtle background
- **Tables** — full-width, bordered, header background, alternating rows
- **Images/video** — max-width, auto height, rounded, border
- **Horizontal rules** — generous vertical margin
- **Strong/em** — weight and style

### What to Add Only When Needed

Do not include these by default. Add when the project uses them:

- `<kbd>` — keyboard shortcut styling
- `<abbr>` — abbreviation underline
- `<dl>/<dt>/<dd>` — definition lists
- `<details>/<summary>` — collapsible sections
- `<figure>/<figcaption>` — captioned media
- `<sub>/<sup>` — subscript/superscript

### Prose Props

- `isArticle` — renders as `<article>` instead of `<div>`, adds `max-w-prose` for reading width
- `isSpaced` — adds vertical spacing between children and heading margins (use for long-form content)
- Both default to `false`

### Rules

- **Prose is for content, not UI.** Never wrap app UI (forms, dashboards, settings) in Prose. Prose is for rendered text content.
- **Descendant selectors, not utility classes.** Prose styles work by targeting child elements (`[&_h1]` in Tailwind, `.prose h1` in CSS). The consumer writes plain HTML/markdown inside Prose — no classes needed on children.
- **Inline code ≠ code blocks.** Always distinguish `code:not(pre code)` from `pre > code`. Inline code gets background/border. Code blocks get the pre's styling.
- **Links skip headings.** Link styling uses `:not(h1 a, h2 a, ...)` so heading links don't get body-link treatment.
- **Color uses semantic tokens.** Use `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border` (Tailwind/shadcn) or CSS custom properties. Never hardcode colors.

## 4. Extension Rules

The design system will grow. These rules keep it clean.

- **New primitives go in `ds.tsx`.** If you need a `Hero` or `Grid` layout primitive, add it to the file. Don't create a separate file.
- **Stop at ~300 lines.** If `ds.tsx` exceeds ~300 lines, you're putting too much in it. Prose is the heaviest component — if the file is long, audit Prose for unnecessary descendant styles.
- **No component variants via props.** Don't add `size="sm" | "md" | "lg"` props. Use `className` overrides. The `cn()` utility exists for this.
- **No context, no state, no hooks.** `ds.tsx` components are pure. If you need state, the consumer provides it.
- **Keep it scannable.** Organize with comment headers (e.g., `// Layout Primitives`, `// Prose`) so the file reads top to bottom.

## 5. Shared Props Type

Both variants use the same props type:

```tsx
type DSProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
};
```

Extend per-component only when necessary:

- `Nav` adds `containerClassName?: string` for its inner container
- `Prose` adds `isArticle?: boolean`, `isSpaced?: boolean`, `dangerouslySetInnerHTML`

Do not create a universal mega-type with every optional prop. Each component destructures only what it uses.

## Anti-Patterns (Hard Stops)

Do not produce any of the following:

- **Multiple files** — splitting layout primitives across files defeats the one-file contract
- **Importing project code** — `ds.tsx` never imports from `@/lib`, `@/hooks`, `@/actions`
- **Prop-driven variants** — no `size`, `variant`, `color` props; use `className`
- **State or hooks** — no `useState`, `useEffect`, `useContext` inside `ds.tsx`
- **Hardcoded colors** — no `bg-gray-100`, `text-white`, `#333`; use semantic tokens
- **Wrapping Prose around UI** — Prose is for content, not forms/dashboards/settings
- **Styling individual elements inside Prose** — the whole point is descendant selectors; if you're adding classes to children inside Prose, you're doing it wrong
- **Duplicating shadcn** — don't recreate Button, Card, Dialog, etc. in `ds.tsx`; those are component-library concerns
- **Over-styling Main** — Main is a semantic hook, not a layout tool; it should have minimal or no default styling

## Workflow

When creating or updating `ds.tsx`:

1. **Choose variant** — Tailwind or CSS, based on the project
2. **Start with layout** — Section, Container, Main, Nav with project-appropriate defaults
3. **Decide on Prose** — Does this project need it? (content/AI = yes, pure app UI = no)
4. **Set defaults** — max-width, padding, spacing that fit the project's design
5. **Add Prose styles** — core 80% first, extras only when the project uses those elements
6. **Wire up** — import in layout.tsx/page.tsx, compose primitives
7. **Test overrides** — verify `className` overrides work via `cn()` merging
8. **Run self-review**

## Self-Review

Score 1–5 on each. Revise until all are 4+.

| Criterion | Question |
|-----------|----------|
| One file | Is the entire design system in a single `ds.tsx`? |
| Semantic | Does every component wrap a semantic HTML element? |
| Overridable | Can every default be overridden via `className`? |
| Pure | Is `ds.tsx` free of state, hooks, context, and project imports? |
| Readable | Can someone read the entire file in under 5 minutes? |
| Prose scoped | Is Prose used only for content, never for app UI? |
| Tokens | Are all colors semantic (no hardcoded values)? |
| Organized | Is the file organized with clear comment section headers? |
