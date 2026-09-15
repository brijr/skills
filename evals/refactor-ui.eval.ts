import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EVAL_MODEL } from "./model";

const skillPath = resolve(__dirname, "../refactor-ui/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateRefactorCritique(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: EVAL_MODEL,
    max_tokens: 4096,
    temperature: 0,
    system: `You are Codex using the refactor-ui skill. Follow the requested stage.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

const suggestsConcreteMoves = createScorer<string, string, string>({
  name: "Suggests concrete redesign moves",
  description:
    "Checks that recommendations name structural UI changes tied to observed evidence",
  scorer: ({ output }) => {
    const evidenceSignals = [
      /button|label|row|table|form|screen|dashboard|empty|loading|error|disabled|permission/i,
      /primary action|primary object|workflow|state|status|destructive|validation/i,
    ];
    const moveSignals =
      output.match(
        /\b(rename|group|separate|demote|promote|disable|defer|split|move|summarize|show|hide|explain|place|pair)\b/gi
      ) || [];
    const foundEvidence = evidenceSignals.filter((signal) => signal.test(output));

    if (foundEvidence.length >= 2 && moveSignals.length >= 4) return 1;
    if (foundEvidence.length >= 1 && moveSignals.length >= 2)
      return { score: 0.5, metadata: { moveSignals, foundEvidence: foundEvidence.map(String) } };
    return { score: 0, metadata: { moveSignals, foundEvidence: foundEvidence.map(String) } };
  },
});

const avoidsImplementation = createScorer<string, string, string>({
  name: "Avoids implementation",
  description:
    "Fails when a critique-only request emits code, patches, or implementation artifacts",
  scorer: ({ output }) => {
    const implementationLeak =
      /```|diff --git|apply_patch|export\s+(?:default\s+)?function|className=|<\w+[\s>]/.test(
        output
      );
    if (!implementationLeak) return 1;
    return { score: 0, metadata: { note: "Output includes implementation" } };
  },
});

evalite("refactor-ui", {
  data: [
    {
      input: `Use /refactor-ui to critique only (do not implement) this dashboard screenshot.

Visible UI: a dashboard with six equal cards, three bright chart colors, a large "Run report" button, a smaller "Export" link, and a table of recent jobs. The table rows show job_id, status_code, owner_id, and updated_at. There is no visible empty or error state. The user only said: "this feels off."`,
      expected: "dashboard-intake",
    },
    {
      input: `Use /refactor-ui to critique only (do not implement) this import review screen.

Route: /admin/imports
Target user: operations lead reviewing a CSV import before committing it.
Observed UI: a full-width table shows raw rows with columns named row_id, external_status, action, and details. The primary button says "Run". Invalid rows are mixed with valid rows. The destructive action is available even when validation is still running. There is no empty or error state in the component.`,
      expected: "import-review",
    },
    {
      input: `Use /refactor-ui to critique only (do not implement) this button cluster in billing settings.

Observed UI: Account owners and editors both see "Upgrade", "Change card", and a red "Cancel" button in one row. Editors get a permission error after clicking Cancel. The current plan label reads PLAN_PRO and payment state reads past_due. The user wants to know what should change before anyone codes it.`,
      expected: "billing-actions",
    },
  ],

  task: async (input) => {
    return generateRefactorCritique(input);
  },

  scorers: [
    suggestsConcreteMoves,
    avoidsImplementation,
  ],
});
