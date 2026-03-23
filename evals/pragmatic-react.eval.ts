import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../pragmatic-react/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateReact(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0,
    system: `You are a senior React/TypeScript engineer. Return ONLY the TSX code — no explanation, no markdown fences. Build features as complete vertical slices.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  const raw = block.type === "text" ? block.text : "";
  return raw.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "");
}

// ---------------------------------------------------------------------------
// Scorers — anti-pattern suppression
// ---------------------------------------------------------------------------

const noPrematureComponentExtraction = createScorer<string, string, string>({
  name: "No premature component extraction",
  description:
    "Fails if the output creates shared/generic wrapper components used only once",
  scorer: ({ output }) => {
    // Find component definitions
    const componentDefs = [
      ...output.matchAll(
        /(?:function|const)\s+([A-Z]\w+)\s*(?:=\s*(?:\([^)]*\)|[^=])*=>|\()/g
      ),
    ].map((m) => m[1]);

    // Find component usages (JSX tags)
    const violations: string[] = [];
    for (const name of componentDefs) {
      const usages = (
        output.match(new RegExp(`<${name}[\\s/>]`, "g")) || []
      ).length;
      // If defined but used only once, it's premature extraction
      // (unless it's the root/exported component)
      if (usages <= 1) {
        const isExported = new RegExp(
          `export\\s+(?:default\\s+)?(?:function|const)\\s+${name}`
        ).test(output);
        if (!isExported) {
          violations.push(`${name} defined but used only ${usages} time(s)`);
        }
      }
    }

    if (violations.length === 0) return 1;
    if (violations.length <= 1)
      return { score: 0.5, metadata: { violations } };
    return { score: 0, metadata: { violations } };
  },
});

const noPropExplosion = createScorer<string, string, string>({
  name: "No prop explosion",
  description:
    "Fails if any component has more than 12 props in its interface/type",
  scorer: ({ output }) => {
    // Match prop type definitions
    const propTypes = [
      ...output.matchAll(
        /(?:type|interface)\s+\w+Props\s*(?:=\s*\{|{)([\s\S]*?)\}/g
      ),
    ];

    const violations: string[] = [];
    for (const match of propTypes) {
      const body = match[1];
      // Count semicolons or line-separated props
      const propCount = (body.match(/\w+\s*[?:]?\s*:/g) || []).length;
      if (propCount > 12) {
        violations.push(`Props type with ${propCount} props`);
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const noContextAsGlobalState = createScorer<string, string, string>({
  name: "No context as global state",
  description:
    "Fails if React context is used to store frequently-changing state like form values, lists, or UI state",
  scorer: ({ output }) => {
    // Check for context creation
    const hasContext = /createContext/.test(output);
    if (!hasContext) return 1;

    // Check what's in the context value
    const contextValues = [
      ...output.matchAll(/value=\{\{?([\s\S]*?)\}?\}/g),
    ];
    const violations: string[] = [];

    for (const match of contextValues) {
      const value = match[1];
      // Frequently-changing state patterns
      if (/\bset\w+\b/.test(value) && /\bitems\b|\blist\b|\bdata\b/i.test(value)) {
        violations.push("Context providing frequently-changing state + setters");
      }
      // Counting the number of values in context
      const valueCount = (value.match(/\w+,/g) || []).length + 1;
      if (valueCount > 5) {
        violations.push(`Context with ${valueCount} values — likely doing too much`);
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0.5, metadata: { violations } };
  },
});

const noOverOptimization = createScorer<string, string, string>({
  name: "No premature optimization",
  description:
    "Warns if useMemo, useCallback, or React.memo are used without an obvious performance reason",
  scorer: ({ output }) => {
    const memoUses = (output.match(/\buseMemo\b/g) || []).length;
    const callbackUses = (output.match(/\buseCallback\b/g) || []).length;
    const memoWraps = (output.match(/\bReact\.memo\b|\bmemo\(/g) || []).length;
    const total = memoUses + callbackUses + memoWraps;

    // A couple is fine (debounce, expensive computation), excessive is suspect
    if (total === 0) return 1;
    if (total <= 2) return 1;
    if (total <= 4) return { score: 0.5, metadata: { count: total } };
    return {
      score: 0,
      metadata: {
        note: `${total} memoization calls — likely premature optimization`,
        useMemo: memoUses,
        useCallback: callbackUses,
        reactMemo: memoWraps,
      },
    };
  },
});

const noSpeculativeProps = createScorer<string, string, string>({
  name: "No speculative props",
  description:
    "Fails if components include variant/size/color/renderX/as props that weren't asked for",
  scorer: ({ input, output }) => {
    const speculativeProps = [
      /\bvariant\s*[?:]/,
      /\bsize\s*[?:].*(?:sm|md|lg|xl)/,
      /\brenderHeader\b/,
      /\brenderFooter\b/,
      /\brenderItem\b/,
      /\bas\s*[?:]\s*React\.ElementType/,
    ];

    const violations = speculativeProps
      .filter((p) => p.test(output))
      .filter((p) => !p.test(input)); // Don't flag if the input asked for it

    if (violations.length === 0) return 1;
    return {
      score: 0,
      metadata: { violations: violations.map((v) => v.source) },
    };
  },
});

// ---------------------------------------------------------------------------
// Scorers — positive signal
// ---------------------------------------------------------------------------

const stateIsColocated = createScorer<string, string, string>({
  name: "State is colocated",
  description:
    "Checks that useState calls appear close to where the state is consumed, not hoisted to a top-level provider",
  scorer: ({ output }) => {
    const stateHooks = (output.match(/\buseState\b|\buseReducer\b/g) || []).length;
    const contextProviders = (output.match(/<\w+Provider/g) || []).length;

    if (stateHooks === 0) return 1; // No state management needed — that's fine

    // If there are more providers than state hooks, state is likely over-lifted
    if (contextProviders > stateHooks) {
      return {
        score: 0.5,
        metadata: {
          note: "More context providers than state hooks — state may be over-lifted",
        },
      };
    }
    return 1;
  },
});

const hasCleanPropInterfaces = createScorer<string, string, string>({
  name: "Clean prop interfaces",
  description:
    "Checks that component props are typed with focused, minimal interfaces",
  scorer: ({ output }) => {
    // Check if props are typed — inline destructured types, type aliases, or interfaces
    const hasTypes =
      /:\s*\{[^}]+\}|Props\b|interface\s+\w+|type\s+\w+/.test(output);
    // Also check for inline destructured params with type annotations
    const hasInlineTypes = /\(\s*\{[^}]+\}\s*:\s*\{/.test(output);
    if (!hasTypes && !hasInlineTypes && output.includes("function")) {
      return {
        score: 0.5,
        metadata: { note: "Components may be missing prop types" },
      };
    }
    return 1;
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("pragmatic-react", {
  data: [
    {
      input:
        "Build a task list feature where users can add tasks with a title and due date, mark them as complete, and filter by status (all, active, completed). Include the state management and the full UI.",
      expected: "task-list",
    },
    {
      input:
        "Build a multi-step form with three steps: personal info (name, email), preferences (theme toggle, notification frequency dropdown), and review/confirm. Users should be able to go back and forth between steps. Include the step navigation and form state.",
      expected: "multi-step-form",
    },
    {
      input:
        "Build a search interface that fetches results from an API endpoint as the user types (debounced), shows loading and empty states, and displays results as a list with title and description. Include error handling.",
      expected: "search-interface",
    },
  ],

  task: async (input) => {
    return generateReact(input);
  },

  scorers: [
    noPrematureComponentExtraction,
    noPropExplosion,
    noContextAsGlobalState,
    noOverOptimization,
    noSpeculativeProps,
    stateIsColocated,
    hasCleanPropInterfaces,
  ],
});
