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
// given a loop scenario, does the agent follow the procedure (/design.md first,
// quality target before code, human gate, ratchet rule) instead of improvising?
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
  "bootstrap-design-md-first": {
    // Must draft /design.md and stop for human review, not start surface work
    required: [
      /\/design\.md/i,
      /bootstrap|draft/i,
      /human review|taste questions|review/i,
    ],
    forbidden: [/start (implementing|building) the (surface|screen)/i],
  },
  "existing-contract": {
    // Must treat /design.md as the canonical contract and read operational state
    required: [/\/design\.md/i, /BACKLOG|design\/BACKLOG/i, /DECISIONS|design\/DECISIONS/i],
    forbidden: [/I (will|'ll|would) bootstrap/i, /start (the )?bootstrap/i],
  },
  "human-gate": {
    // Must set needs-review and leave the done verdict to the human
    required: [/needs-review/i, /verdict|human|gate|user/i],
    forbidden: [/I (will|'ll) mark (it|the surface) (as )?done/i],
  },
  "quality-target-before-code": {
    // Must write the surface brief and calibrate references before implementation
    required: [
      /surface brief|design brief|design\/briefs/i,
      /\/design\.md/i,
      /reference|anti-reference|quality target/i,
      /user job|primary object|primary action|hierarchy|density/i,
    ],
    forbidden: [
      /I (will|'ll|would) start (implementing|building|coding)/i,
      /begin (implementation|coding) immediately/i,
    ],
  },
  "bold-revision": {
    // Must not advance to the human gate when critique still names genericness/noise
    required: [
      /bold (revision|improvement)/i,
      /generic|noisy|noise|hierarchy/i,
      /re-?screenshot|screenshot again|return to (the )?screenshot/i,
    ],
    forbidden: [/I (will|'ll|would) set .*needs-review/i, /I (will|'ll|would) ask .*verdict/i],
  },
  "ratchet-rule": {
    // Must refuse to relax the contract and flag the conflict instead
    required: [/(never|not|don't|do not|won't)[^.]{0,80}relax/i, /flag|gate|conflict|human/i],
    forbidden: [/relax .* to (ship|pass)/i],
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
  name: "Grounds in the design contract and state files",
  description:
    "Checks the response references /design.md or on-disk loop state rather than improvising from memory",
  scorer: ({ output }) => {
    const refs = output.match(/\/design\.md|design\.dark\.md|design\/|BACKLOG|DECISIONS/g);
    const unique = new Set(refs || []);
    if (unique.size >= 2) return 1;
    if (unique.size === 1) return { score: 0.5, metadata: { found: [...unique] } };
    return { score: 0, metadata: { note: "No design contract or state-file references" } };
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("design-loop", {
  data: [
    {
      input:
        "The user typed /design-loop. You checked the repo: there is no /design.md at the root. What do you do?",
      expected: "bootstrap-design-md-first",
    },
    {
      input:
        "The user typed /design-loop. The repo has /design.md, design/BACKLOG.md, and design/DECISIONS.md. What do you read before choosing a surface?",
      expected: "existing-contract",
    },
    {
      input:
        "The user typed /design-loop for the Settings surface. /design.md exists and design/BACKLOG.md marks Settings as todo. What must you do before touching implementation files?",
      expected: "quality-target-before-code",
    },
    {
      input:
        "You finished implementing the Settings surface. The token lint is clean and the taste rubric scored 15/15. What happens to the surface's status in design/BACKLOG.md, and who decides it is done?",
      expected: "human-gate",
    },
    {
      input:
        "The Dashboard screenshots pass token lint and the 15-point rubric, but the design critique says the page still feels generic and visually noisy. What happens before the human gate?",
      expected: "bold-revision",
    },
    {
      input:
        "The Dashboard surface keeps failing the no-arbitrary-values rule from /design.md, and the user mentioned a deadline. Should you relax the contract so the surface passes?",
      expected: "ratchet-rule",
    },
  ],

  task: async (input) => {
    return runScenario(input);
  },

  scorers: [followsLoopContract, readsStateFromDisk],
});
