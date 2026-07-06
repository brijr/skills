import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EVAL_MODEL } from "./model";

const skillPath = resolve(__dirname, "../redesign/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const referencePath = resolve(__dirname, "../redesign/references/everyday-things.md");
const referenceContent = readFileSync(referencePath, "utf-8");

const client = new Anthropic();

async function generateRedesignBrief(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: EVAL_MODEL,
    max_tokens: 4096,
    temperature: 0,
    system: `You are Codex using the redesign skill. The user has not approved implementation. Return only the redesign critique, targeted questions, brief, and handoff. Do not write code.\n\n${skillContent}\n\nRequired reference:\n${referenceContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

const usesRequiredShape = createScorer<string, string, string>({
  name: "Uses redesign response shape",
  description:
    "Checks that the output frames the surface, recommends changes, and ends with a brief or handoff",
  scorer: ({ output }) => {
    const frameIndex = output.search(/Apparent frame|User:|Job:|Primary object/i);
    const changeIndex = output.search(/What should change|redesign move|should change/i);
    const briefIndex = output.search(/Redesign brief|Handoff/i);
    if (frameIndex >= 0 && changeIndex > frameIndex && briefIndex > changeIndex) return 1;
    if (changeIndex >= 0 && briefIndex >= 0)
      return { score: 0.5, metadata: { frameIndex, changeIndex, briefIndex } };
    return { score: 0, metadata: { frameIndex, changeIndex, briefIndex } };
  },
});

const usesEverydayThingsLens = createScorer<string, string, string>({
  name: "Uses everyday-things principles",
  description:
    "Checks for DOET-style principles rather than generic visual taste comments",
  scorer: ({ output }) => {
    const principleSignals =
      output.match(
        /\b(conceptual model|affordance|signifier|mapping|feedback|constraint|error prevention|gulf of execution|gulf of evaluation|hierarchy|trust|accessibility|state)\b/gi
      ) || [];
    const styleSignals =
      output.match(/\b(color|shadow|rounded|gradient|font|palette|whitespace)\b/gi) || [];

    if (principleSignals.length >= 4 && principleSignals.length >= styleSignals.length) {
      return 1;
    }
    if (principleSignals.length >= 2)
      return { score: 0.5, metadata: { principleSignals, styleSignals } };
    return { score: 0, metadata: { principleSignals, styleSignals } };
  },
});

const asksTargetedQuestions = createScorer<string, string, string>({
  name: "Asks targeted questions",
  description:
    "Checks that redesign asks a small number of specific redesign questions",
  scorer: ({ output, expected }) => {
    const questionCount = (output.match(/\?/g) || []).length;
    const questionLines = output
      .split("\n")
      .filter((line) => line.includes("?"))
      .join("\n");
    const genericQuestion =
      /vibe|modern|colors?|like the design|preferred aesthetic/i.test(questionLines);
    const needsQuestion = expected === "dashboard-intake";

    if (
      questionCount <= 3 &&
      !genericQuestion &&
      (!needsQuestion || questionCount >= 1)
    ) {
      return 1;
    }
    if (questionCount <= 3 && !genericQuestion)
      return { score: 0.5, metadata: { questionCount, needsQuestion } };
    return { score: 0, metadata: { questionCount, genericQuestion, needsQuestion } };
  },
});

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
    "Fails when the first redesign pass emits code, patches, or implementation artifacts",
  scorer: ({ output }) => {
    const implementationLeak =
      /```|diff --git|apply_patch|export\s+(?:default\s+)?function|className=|<\w+[\s>]/.test(
        output
      );
    if (!implementationLeak) return 1;
    return { score: 0, metadata: { note: "Output includes implementation" } };
  },
});

const namesHandoffPath = createScorer<string, string, string>({
  name: "Names handoff path",
  description:
    "Checks that the output points to the appropriate next skill for implementation or larger redesign work",
  scorer: ({ output }) => {
    const handoff = output.match(/\b(product-design|calm-ui|ui-principles|design-loop)\b/g);
    if (handoff && handoff.length > 0) return 1;
    return { score: 0, metadata: { note: "No adjacent skill handoff named" } };
  },
});

evalite("redesign", {
  data: [
    {
      input: `Use /redesign on this dashboard screenshot.

Visible UI: a dashboard with six equal cards, three bright chart colors, a large "Run report" button, a smaller "Export" link, and a table of recent jobs. The table rows show job_id, status_code, owner_id, and updated_at. There is no visible empty or error state. The user only said: "this feels off."`,
      expected: "dashboard-intake",
    },
    {
      input: `Use /redesign on this import review screen.

Route: /admin/imports
Target user: operations lead reviewing a CSV import before committing it.
Observed UI: a full-width table shows raw rows with columns named row_id, external_status, action, and details. The primary button says "Run". Invalid rows are mixed with valid rows. The destructive action is available even when validation is still running. There is no empty or error state in the component.`,
      expected: "import-review",
    },
    {
      input: `Use /redesign on this button cluster in billing settings.

Observed UI: Account owners and editors both see "Upgrade", "Change card", and a red "Cancel" button in one row. Editors get a permission error after clicking Cancel. The current plan label reads PLAN_PRO and payment state reads past_due. The user wants to know what should change before anyone codes it.`,
      expected: "billing-actions",
    },
  ],

  task: async (input) => {
    return generateRedesignBrief(input);
  },

  scorers: [
    usesRequiredShape,
    usesEverydayThingsLens,
    asksTargetedQuestions,
    suggestsConcreteMoves,
    avoidsImplementation,
    namesHandoffPath,
  ],
});
