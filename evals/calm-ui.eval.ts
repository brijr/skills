import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load the skill as a system prompt
const skillPath = resolve(__dirname, "../calm-ui/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8")
  // Strip YAML frontmatter
  .replace(/^---[\s\S]*?---\n/, "");

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Task: ask Claude to generate a React component, with the skill as system prompt
// ---------------------------------------------------------------------------

async function generateUI(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0,
    system: `You are a frontend engineer building UI in React, Next.js, TypeScript, and shadcn/ui. Return ONLY the TSX code for the component — no explanation, no markdown fences.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  const raw = block.type === "text" ? block.text : "";
  return raw.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "");
}

// ---------------------------------------------------------------------------
// Scorers — anti-pattern suppression
// ---------------------------------------------------------------------------

const noHardcodedColors = createScorer<string, string, string>({
  name: "No hardcoded colors",
  description:
    "Fails if the output uses bg-gray-*, bg-white, bg-black, text-gray-*, text-white, text-black instead of CSS variable classes",
  scorer: ({ output }) => {
    const hardcoded = output.match(
      /\b(bg-gray-\d+|bg-white|bg-black|text-gray-\d+|text-white|text-black|border-gray-\d+)\b/g
    );
    if (!hardcoded || hardcoded.length === 0) return 1;
    return {
      score: 0,
      metadata: { violations: hardcoded },
    };
  },
});

const noOversizedType = createScorer<string, string, string>({
  name: "No oversized typography",
  description:
    "Fails if text-2xl or larger is used (text-3xl, text-4xl, etc.) — product UI should stay within text-xs to text-xl",
  scorer: ({ output }) => {
    const oversized = output.match(/\btext-[2-9]xl\b/g);
    if (!oversized || oversized.length === 0) return 1;
    return {
      score: 0,
      metadata: { violations: oversized },
    };
  },
});

const noHeavyShadows = createScorer<string, string, string>({
  name: "No heavy shadows",
  description: "Fails if shadow-md, shadow-lg, shadow-xl, or shadow-2xl is used",
  scorer: ({ output }) => {
    const heavy = output.match(/\bshadow-(md|lg|xl|2xl)\b/g);
    if (!heavy || heavy.length === 0) return 1;
    return {
      score: 0,
      metadata: { violations: heavy },
    };
  },
});

const noOversizedRadius = createScorer<string, string, string>({
  name: "No oversized border radius",
  description:
    "Fails if rounded-xl, rounded-2xl, or rounded-full is used on containers (rounded-full on small icons/avatars is OK)",
  scorer: ({ output }) => {
    const oversized = output.match(/\brounded-(xl|2xl|3xl|full)\b/g);
    if (!oversized || oversized.length === 0) return 1;
    // rounded-full on a small avatar/icon is acceptable — check context
    const lines = output.split("\n");
    const realViolations = oversized.filter((match) => {
      if (match === "rounded-full") {
        // Allow rounded-full if it appears near avatar/icon context
        const line = lines.find((l) => l.includes(match));
        if (line && /avatar|icon|w-[4-9]|h-[4-9]|w-1[0-2]|h-1[0-2]/i.test(line)) {
          return false;
        }
      }
      return true;
    });
    if (realViolations.length === 0) return 1;
    return {
      score: 0,
      metadata: { violations: realViolations },
    };
  },
});

const noCardNesting = createScorer<string, string, string>({
  name: "No card-on-card nesting",
  description: "Fails if Card components are nested inside other Card components",
  scorer: ({ output }) => {
    // Simple heuristic: count Card opens/closes and check for nesting
    let depth = 0;
    let maxDepth = 0;
    const cardOpens = output.matchAll(/<Card[\s>]/g);
    const cardCloses = output.matchAll(/<\/Card>/g);

    // Build a simple depth tracker by scanning character positions
    const opens = [...output.matchAll(/<Card[\s>]/g)].map((m) => ({
      pos: m.index!,
      type: "open" as const,
    }));
    const closes = [...output.matchAll(/<\/Card>/g)].map((m) => ({
      pos: m.index!,
      type: "close" as const,
    }));
    const events = [...opens, ...closes].sort((a, b) => a.pos - b.pos);

    for (const e of events) {
      if (e.type === "open") {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else {
        depth--;
      }
    }

    return maxDepth <= 1 ? 1 : { score: 0, metadata: { maxCardDepth: maxDepth } };
  },
});

// ---------------------------------------------------------------------------
// Scorers — positive signal
// ---------------------------------------------------------------------------

const usesCSSVariables = createScorer<string, string, string>({
  name: "Uses CSS variable colors",
  description:
    "Checks that the output uses shadcn CSS variable classes (bg-background, text-foreground, bg-muted, text-muted-foreground, etc.)",
  scorer: ({ output }) => {
    const cssVarClasses = output.match(
      /\b(bg-background|text-foreground|bg-muted|text-muted-foreground|bg-card|border-border|bg-accent|text-accent-foreground|bg-primary|text-primary-foreground|bg-popover|bg-destructive)\b/g
    );
    // Should use at least a couple of these
    const unique = new Set(cssVarClasses || []);
    if (unique.size >= 3) return 1;
    if (unique.size >= 1) return { score: 0.5, metadata: { found: [...unique] } };
    return { score: 0, metadata: { found: [] } };
  },
});

const usesProperSpacing = createScorer<string, string, string>({
  name: "Uses structured spacing",
  description:
    "Checks that the output uses space-y-* or gap-* utilities for layout structure rather than ad-hoc margins",
  scorer: ({ output }) => {
    const spacingUtils = output.match(/\b(space-y-\d+|gap-\d+)\b/g);
    if (spacingUtils && spacingUtils.length >= 2) return 1;
    if (spacingUtils && spacingUtils.length >= 1)
      return { score: 0.5, metadata: { found: spacingUtils } };
    return { score: 0, metadata: { note: "No space-y or gap utilities found" } };
  },
});

const restrainedTypeScale = createScorer<string, string, string>({
  name: "Restrained type scale",
  description:
    "Checks that text sizes stay within the tight range (text-xs through text-xl) and measures the spread",
  scorer: ({ output }) => {
    const sizeMap: Record<string, number> = {
      "text-xs": 1,
      "text-sm": 2,
      "text-base": 3,
      "text-lg": 4,
      "text-xl": 5,
      "text-2xl": 6,
      "text-3xl": 7,
      "text-4xl": 8,
      "text-5xl": 9,
    };
    const sizes = output.match(/\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g) || [];
    const uniqueSizes = [...new Set(sizes)];
    const values = uniqueSizes.map((s) => sizeMap[s] || 0).filter(Boolean);

    if (values.length === 0) return { score: 0.5, metadata: { note: "No text sizes found" } };

    const max = Math.max(...values);
    const min = Math.min(...values);
    const spread = max - min;

    // Tight scale: spread of 0-3 is great, 4 is OK, 5+ is too wide
    if (max > 5) return { score: 0, metadata: { sizes: uniqueSizes, spread } };
    if (spread <= 3) return 1;
    return { score: 0.5, metadata: { sizes: uniqueSizes, spread } };
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("calm-ui", {
  data: [
    {
      input:
        "Build a settings page with three sections: user profile (avatar, name, email, bio), notification preferences (toggles for email, push, SMS), and a billing section showing current plan and payment method with a button to upgrade.",
      expected: "settings-page",
    },
    {
      input:
        "Build a data table component showing a list of projects. Columns: project name, status (active/archived/draft), last updated date, owner name. Include a search input above the table and pagination below it.",
      expected: "data-table",
    },
    {
      input:
        "Build a form for creating a new team member. Fields: full name, email, role (dropdown with Admin, Editor, Viewer), a permissions section with toggles for 'Can invite others', 'Can delete projects', 'Can manage billing'. Include cancel and save buttons.",
      expected: "team-member-form",
    },
  ],

  task: async (input) => {
    return generateUI(input);
  },

  scorers: [
    // Anti-pattern suppression
    noHardcodedColors,
    noOversizedType,
    noHeavyShadows,
    noOversizedRadius,
    noCardNesting,
    // Positive signal
    usesCSSVariables,
    usesProperSpacing,
    restrainedTypeScale,
  ],
});
