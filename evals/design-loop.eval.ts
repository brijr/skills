import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load the skill as a system prompt
const skillPath = resolve(__dirname, "../design-loop/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8")
  // Strip YAML frontmatter
  .replace(/^---[\s\S]*?---\n/, "");

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Task: design-loop is a process skill, so the eval probes contract adherence:
// given a loop scenario, does the agent follow the procedure (bootstrap first,
// human gate, ratchet rule) instead of improvising?
// ---------------------------------------------------------------------------

async function runScenario(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    temperature: 0,
    system: `You are a coding agent with the following skill active. Answer with what you would do next and why, per the skill.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

// ---------------------------------------------------------------------------
// Per-scenario contracts, keyed by the case's `expected` label
// ---------------------------------------------------------------------------

const CONTRACTS: Record<
  string,
  { required: RegExp[]; forbidden: RegExp[] }
> = {
  "bootstrap-first": {
    // Must route to bootstrap (POV + constraint system), not start surface work
    required: [
      /bootstrap/i,
      /POV|point of view/i,
      /UI_RULES|constraint system|tokens\.json/i,
    ],
    forbidden: [/start (implementing|building) the (surface|screen)/i],
  },
  "human-gate": {
    // Must set needs-review and leave the done verdict to the human
    required: [/needs-review/i, /verdict|human|gate|user/i],
    forbidden: [/I (will|'ll) mark (it|the surface) (as )?done/i],
  },
  "ratchet-rule": {
    // Must refuse to relax the rule and flag the conflict instead
    required: [/(never|not|don't|do not|won't)[^.]{0,60}relax/i, /flag|gate|conflict|human/i],
    forbidden: [/relax the rule to (ship|pass)/i],
  },
};

const followsLoopContract = createScorer<string, string, string>({
  name: "Follows the loop contract",
  description:
    "Checks the response against the scenario's required behaviors and forbidden shortcuts",
  scorer: ({ output, expected }) => {
    const contract = expected ? CONTRACTS[expected] : undefined;
    if (!contract) return { score: 0, metadata: { note: `Unknown contract: ${expected}` } };
    const forbiddenHits = contract.forbidden.filter((re) => re.test(output));
    if (forbiddenHits.length > 0)
      return { score: 0, metadata: { forbidden: forbiddenHits.map(String) } };
    const hits = contract.required.filter((re) => re.test(output));
    const score = hits.length / contract.required.length;
    return score === 1
      ? 1
      : {
          score,
          metadata: {
            missing: contract.required
              .filter((re) => !re.test(output))
              .map(String),
          },
        };
  },
});

const readsStateFromDisk = createScorer<string, string, string>({
  name: "Grounds in the design/ state files",
  description:
    "Checks the response references the on-disk state (design/, BACKLOG, DECISIONS, UI_RULES) rather than improvising from memory",
  scorer: ({ output }) => {
    const refs = output.match(/design\/|BACKLOG|DECISIONS|UI_RULES|POV/g);
    const unique = new Set(refs || []);
    if (unique.size >= 2) return 1;
    if (unique.size === 1) return { score: 0.5, metadata: { found: [...unique] } };
    return { score: 0, metadata: { note: "No state-file references" } };
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("design-loop", {
  data: [
    {
      input:
        "The user typed /design-loop. You checked the repo: there is no design/ directory anywhere. What do you do?",
      expected: "bootstrap-first",
    },
    {
      input:
        "You finished implementing the Settings surface. The token lint is clean and the taste rubric scored 12/12. What happens to the surface's status in BACKLOG.md, and who decides it is done?",
      expected: "human-gate",
    },
    {
      input:
        "The Dashboard surface keeps failing the 'no arbitrary Tailwind values' rule from UI_RULES.md, and the user mentioned a deadline. Should you relax that rule so the surface passes?",
      expected: "ratchet-rule",
    },
  ],

  task: async (input) => {
    return runScenario(input);
  },

  scorers: [followsLoopContract, readsStateFromDisk],
});
