import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../write-goal/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateGoal(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    temperature: 0,
    system: `You are Codex using the write-goal skill. Produce only the final answer to the user.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

const hasConcreteGoalShape = createScorer<string, string, string>({
  name: "Concrete goal shape",
  description:
    "Checks that the output contains either a native /goal command or portable Goal block",
  scorer: ({ input, output }) => {
    const expectsCodex = /Codex|\/goal|native goal/i.test(input);
    if (expectsCodex && /\/goal\b/.test(output)) return 1;
    if (!expectsCodex && /\bGoal:\s*\n/i.test(output)) return 1;
    return {
      score: 0,
      metadata: { expectsCodex, note: "Missing expected goal shape" },
    };
  },
});

const coversSixGoalFields = createScorer<string, string, string>({
  name: "Covers six goal fields",
  description:
    "Checks for outcome, verification, constraints, boundaries, iteration policy, and blocked stop condition",
  scorer: ({ output }) => {
    const checks = {
      outcome: /\b(goal|end state|produce|make|add|reduce|fix)\b/i.test(output),
      verification: /\bverified by|verification|tests?|benchmark|artifact|evidence|command\b/i.test(
        output
      ),
      constraints: /\bpreserve|while keeping|without changing|constraints?\b/i.test(
        output
      ),
      boundaries: /\buse\b.*\b(repo|files?|modules?|package|directory|only)\b/i.test(
        output
      ),
      iteration: /\bbetween iterations|after each attempt|next best|prioritize\b/i.test(
        output
      ),
      blocked: /\bif blocked|if .* cannot|stop with\b/i.test(output),
    };
    const passed = Object.entries(checks)
      .filter(([, ok]) => ok)
      .map(([name]) => name);
    if (passed.length === 6) return 1;
    if (passed.length >= 4) return { score: 0.5, metadata: { passed } };
    return { score: 0, metadata: { passed } };
  },
});

const groundsCodebaseGoals = createScorer<string, string, string>({
  name: "Grounds codebase goals",
  description:
    "Checks that repo-dependent goals include real context checked and repo nouns",
  scorer: ({ input, output }) => {
    if (!/repo|codebase|package\.json|tests?|route|module|file/i.test(input)) {
      return 1;
    }

    const hasContextChecked = /Context checked:/i.test(output);
    const repoNouns =
      output.match(
        /\b(package\.json|pnpm|vitest|evals\/|src\/|app\/|README\.md|tsconfig)\b/g
      ) || [];

    if (hasContextChecked && repoNouns.length >= 2) return 1;
    if (hasContextChecked || repoNouns.length >= 2)
      return { score: 0.5, metadata: { hasContextChecked, repoNouns } };
    return { score: 0, metadata: { hasContextChecked, repoNouns } };
  },
});

const avoidsLifecycleActions = createScorer<string, string, string>({
  name: "Avoids lifecycle actions",
  description:
    "Fails if write-goal claims to create, activate, complete, or update the goal",
  scorer: ({ output }) => {
    const violations =
      output.match(
        /\b(I created|I've created|activated|started the goal|marked .*complete|update_goal|create_goal|goal is now active)\b/gi
      ) || [];
    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const asksAtMostTwoQuestions = createScorer<string, string, string>({
  name: "Asks at most two questions",
  description: "Checks that missing information is handled with restraint",
  scorer: ({ output }) => {
    const questionCount = (output.match(/\?/g) || []).length;
    if (questionCount <= 2) return 1;
    return { score: 0, metadata: { questionCount } };
  },
});

evalite("write-goal", {
  data: [
    {
      input:
        "Use /write-goal for Codex: make the checkout benchmark faster in this repo. Context: package.json has scripts test, benchmark:checkout, and lint; the code lives in src/checkout and tests live in src/checkout/*.test.ts.",
      expected: "codex-goal",
    },
    {
      input:
        "Turn this into a portable goal for another coding agent: audit the CSV importer in this codebase and make flaky row validation reliable. Relevant files are packages/importer/src/run.ts and packages/importer/src/run.test.ts.",
      expected: "portable-goal",
    },
    {
      input:
        "Draft a native Codex goal to add eval coverage for a skills repo. It should touch evals/*.eval.ts, package.json scripts, and the target */SKILL.md prompts only if the eval exposes a prompt bug.",
      expected: "repo-aware-codex-goal",
    },
  ],

  task: async (input) => {
    return generateGoal(input);
  },

  scorers: [
    hasConcreteGoalShape,
    coversSixGoalFields,
    groundsCodebaseGoals,
    avoidsLifecycleActions,
    asksAtMostTwoQuestions,
  ],
});
