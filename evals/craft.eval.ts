import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load the skill as a system prompt
const skillPath = resolve(__dirname, "../craft/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8")
  // Strip YAML frontmatter
  .replace(/^---[\s\S]*?---\n/, "");

// Load the Tailwind reference implementation for context
const refPath = resolve(__dirname, "../craft/references/ds-tailwind.tsx");
const refContent = readFileSync(refPath, "utf-8");

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Task: ask Claude to generate a ds.tsx file, with the skill as system prompt
// ---------------------------------------------------------------------------

async function generateDS(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a frontend engineer creating a single-file design system (ds.tsx) for a React/Next.js project. Return ONLY the TSX code — no explanation, no markdown fences.\n\nHere is the design system skill:\n\n${skillContent}\n\nHere is a reference implementation for inspiration (adapt, don't copy verbatim):\n\n${refContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

// ---------------------------------------------------------------------------
// Scorers — one-file constraint
// ---------------------------------------------------------------------------

const hasCnExport = createScorer<string, string, string>({
  name: "Exports cn() utility",
  description: "Checks that the output exports a cn() function as the first utility",
  scorer: ({ output }) => {
    const hasCn = /export\s+function\s+cn\b/.test(output);
    if (hasCn) return 1;
    // Also accept arrow function export
    const hasArrowCn = /export\s+const\s+cn\s*=/.test(output);
    return hasArrowCn ? 1 : { score: 0, metadata: { note: "No cn() export found" } };
  },
});

const hasRequiredExports = createScorer<string, string, string>({
  name: "Has required layout exports",
  description:
    "Checks that the output exports Section, Container, Main, and Nav components",
  scorer: ({ output }) => {
    const required = ["Section", "Container", "Main", "Nav"];
    const missing = required.filter(
      (name) => !new RegExp(`export\\s+const\\s+${name}\\b`).test(output)
    );
    if (missing.length === 0) return 1;
    if (missing.length <= 1)
      return { score: 0.5, metadata: { missing } };
    return { score: 0, metadata: { missing } };
  },
});

const usesSemanticHTML = createScorer<string, string, string>({
  name: "Uses semantic HTML elements",
  description:
    "Checks that components render semantic elements (section, nav, main) not just divs",
  scorer: ({ output }) => {
    const semanticElements = ["<section", "<nav", "<main"];
    const found = semanticElements.filter((el) => output.includes(el));
    if (found.length >= 3) return 1;
    if (found.length >= 2)
      return { score: 0.5, metadata: { found } };
    return {
      score: 0,
      metadata: { found, note: "Components should use semantic HTML elements" },
    };
  },
});

// ---------------------------------------------------------------------------
// Scorers — anti-pattern suppression
// ---------------------------------------------------------------------------

const noProjectImports = createScorer<string, string, string>({
  name: "No project code imports",
  description:
    "Fails if ds.tsx imports from @/lib, @/hooks, @/actions, or other project directories",
  scorer: ({ output }) => {
    const violations = output.match(
      /import\s+.*\s+from\s+['"]@\/(lib|hooks|actions|components|app|types)\b/g
    );
    if (!violations || violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const noStateOrHooks = createScorer<string, string, string>({
  name: "No state or hooks",
  description:
    "Fails if ds.tsx uses useState, useEffect, useContext, useRef, or other React hooks",
  scorer: ({ output }) => {
    const hooks = output.match(
      /\b(useState|useEffect|useContext|useRef|useCallback|useMemo|useReducer|useLayoutEffect)\b/g
    );
    if (!hooks || hooks.length === 0) return 1;
    return { score: 0, metadata: { violations: hooks } };
  },
});

const noHardcodedColors = createScorer<string, string, string>({
  name: "No hardcoded colors",
  description:
    "Fails if the output uses hardcoded color values like bg-gray-*, bg-white, #hex, or rgb()",
  scorer: ({ output }) => {
    const hardcoded = output.match(
      /\b(bg-gray-\d+|bg-white|bg-black|text-gray-\d+|text-white|text-black|border-gray-\d+)\b|#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(/g
    );
    if (!hardcoded || hardcoded.length === 0) return 1;
    // Allow hex in CSS custom property fallback values (common in CSS variant)
    const realViolations = hardcoded.filter(
      (h) => !/^#/.test(h) || !output.includes(`var(--`)
    );
    if (realViolations.length === 0) return 1;
    return { score: 0, metadata: { violations: realViolations } };
  },
});

const noPropVariants = createScorer<string, string, string>({
  name: "No prop-driven variants",
  description:
    "Fails if components use size/variant/color props instead of className overrides",
  scorer: ({ output }) => {
    // Check for variant-style prop types in component definitions
    const variantProps = output.match(
      /\b(size|variant|color|theme)\s*[?:]?\s*['"]?(sm|md|lg|xl|primary|secondary|default|small|medium|large)['"]?/g
    );
    if (!variantProps || variantProps.length === 0) return 1;
    return { score: 0, metadata: { violations: variantProps } };
  },
});

const noBusinessLogic = createScorer<string, string, string>({
  name: "No business logic",
  description:
    "Fails if ds.tsx contains fetch calls, API endpoints, auth checks, or data handling",
  scorer: ({ output }) => {
    const violations = output.match(
      /\b(fetch\(|axios\.|useQuery|useSWR|getServerSession|requireUser|requireAuth|prisma\.|db\.)\b/g
    );
    if (!violations || violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

// ---------------------------------------------------------------------------
// Scorers — positive signal
// ---------------------------------------------------------------------------

const allComponentsAcceptClassName = createScorer<string, string, string>({
  name: "All components accept className",
  description:
    "Checks that every exported component accepts and uses a className prop via cn()",
  scorer: ({ output }) => {
    // Find all exported const components
    const exports = output.match(/export\s+const\s+(\w+)\s*=/g) || [];
    const componentNames = exports
      .map((e) => e.match(/export\s+const\s+(\w+)/)?.[1])
      .filter((name) => name && name !== "cn" && /^[A-Z]/.test(name));

    if (componentNames.length === 0)
      return { score: 0, metadata: { note: "No exported components found" } };

    // Check each component uses cn() with className
    let withCn = 0;
    for (const name of componentNames) {
      // Find the component's code block (rough heuristic)
      const pattern = new RegExp(
        `export\\s+const\\s+${name}[\\s\\S]*?(?=export\\s+const|$)`
      );
      const match = output.match(pattern);
      if (match && /cn\(/.test(match[0]) && /className/.test(match[0])) {
        withCn++;
      }
    }

    const ratio = withCn / componentNames.length;
    if (ratio >= 1) return 1;
    if (ratio >= 0.75)
      return { score: 0.5, metadata: { withCn, total: componentNames.length } };
    return {
      score: 0,
      metadata: { withCn, total: componentNames.length },
    };
  },
});

const hasJSDocComments = createScorer<string, string, string>({
  name: "Has JSDoc comments",
  description:
    "Checks that exported components have JSDoc comments for AI agent consumption",
  scorer: ({ output }) => {
    const jsdocs = output.match(/\/\*\*[\s\S]*?\*\//g) || [];
    const exports = output.match(/export\s+const\s+[A-Z]\w+/g) || [];

    if (exports.length === 0)
      return { score: 0, metadata: { note: "No exports found" } };

    // At least half the exports should have JSDoc
    const ratio = jsdocs.length / exports.length;
    if (ratio >= 0.75) return 1;
    if (ratio >= 0.5)
      return { score: 0.5, metadata: { jsdocs: jsdocs.length, exports: exports.length } };
    return {
      score: 0,
      metadata: { jsdocs: jsdocs.length, exports: exports.length },
    };
  },
});

const proseUsesDescendantSelectors = createScorer<string, string, string>({
  name: "Prose uses descendant selectors",
  description:
    "Checks that the Prose component styles children via descendant selectors, not individual className props",
  scorer: ({ output }) => {
    // Check for Tailwind descendant selectors [&_element] or CSS class-based prose styling
    const hasTailwindDescendants = /\[&_h[1-6]\]/.test(output);
    const hasCSSProseClass = /ds-prose|\.prose\s/.test(output);

    if (hasTailwindDescendants || hasCSSProseClass) return 1;

    // If there's a Prose component but no descendant selectors, that's a problem
    const hasProse = /export\s+const\s+Prose/.test(output);
    if (hasProse) {
      return {
        score: 0,
        metadata: {
          note: "Prose component exists but doesn't use descendant selectors",
        },
      };
    }

    // No Prose component at all — might be intentional for pure app UI projects
    return { score: 0.5, metadata: { note: "No Prose component found" } };
  },
});

const isUnderLineLimit = createScorer<string, string, string>({
  name: "Under ~300 line limit",
  description: "Checks that ds.tsx stays readable — under ~300 lines",
  scorer: ({ output }) => {
    const lines = output.split("\n").length;
    if (lines <= 300) return 1;
    if (lines <= 400)
      return { score: 0.5, metadata: { lines, note: "Getting long — audit Prose" } };
    return { score: 0, metadata: { lines } };
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("craft", {
  data: [
    {
      input:
        "Create a ds.tsx design system file (Tailwind variant) for a blog/content site built with Next.js and shadcn/ui. The site will display markdown articles, have a top navigation, and use a centered content layout. Include the Prose component with isArticle and isSpaced props.",
      expected: "blog-ds",
    },
    {
      input:
        "Create a ds.tsx design system file (Tailwind variant) for a SaaS dashboard application. The app has a sidebar navigation, multiple page sections, and displays some AI-generated summaries in markdown. Include layout primitives and a Prose component for the AI output areas.",
      expected: "dashboard-ds",
    },
    {
      input:
        "Create a ds.tsx design system file (Tailwind variant) for a documentation site. Pages have a narrow content column, a top nav, code examples, tables, and long-form prose. The max-width should be 48rem instead of the default. Include all layout primitives and a full Prose component.",
      expected: "docs-ds",
    },
  ],

  task: async (input) => {
    return generateDS(input);
  },

  scorers: [
    // One-file constraint
    hasCnExport,
    hasRequiredExports,
    usesSemanticHTML,
    // Anti-pattern suppression
    noProjectImports,
    noStateOrHooks,
    noHardcodedColors,
    noPropVariants,
    noBusinessLogic,
    // Positive signal
    allComponentsAcceptClassName,
    hasJSDocComments,
    proseUsesDescendantSelectors,
    isUnderLineLimit,
  ],
});
