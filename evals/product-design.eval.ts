import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../product-design/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateProductPlan(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0,
    system: `You are Codex using the product-design skill. The user has not approved implementation yet. Return only the critique and implementation plan.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

const usesRequiredSections = createScorer<string, string, string>({
  name: "Uses required sections",
  description:
    "Checks that product-design outputs critique before implementation plan",
  scorer: ({ output }) => {
    const critiqueIndex = output.search(/\*\*Product critique\*\*|Product critique/i);
    const planIndex = output.search(/\*\*Implementation plan\*\*|Implementation plan/i);
    if (critiqueIndex >= 0 && planIndex > critiqueIndex) return 1;
    if (critiqueIndex >= 0 || planIndex >= 0)
      return { score: 0.5, metadata: { critiqueIndex, planIndex } };
    return { score: 0, metadata: { critiqueIndex, planIndex } };
  },
});

const groundsInProductEvidence = createScorer<string, string, string>({
  name: "Grounds in product evidence",
  description:
    "Checks that findings refer to observed UI/code/context and product workflow, not vague taste",
  scorer: ({ output }) => {
    const evidenceSignals = [
      /route|screen|component|table|form|dashboard|workflow/i,
      /user|role|job-to-be-done|primary action|whose turn/i,
      /state|status|empty|loading|error|permission|read-only/i,
      /copy|label|affordance|feedback|consequence|trust/i,
    ];
    const found = evidenceSignals.filter((signal) => signal.test(output));
    if (found.length >= 3) return 1;
    if (found.length >= 2)
      return { score: 0.5, metadata: { found: found.map((f) => f.source) } };
    return { score: 0, metadata: { found: found.map((f) => f.source) } };
  },
});

const prioritizesProductOverAesthetics = createScorer<string, string, string>({
  name: "Prioritizes product over aesthetics",
  description:
    "Fails when the critique is dominated by styling language instead of UX/product principles",
  scorer: ({ output }) => {
    const productSignals =
      output.match(
        /\b(conceptual model|affordance|feedback|mapping|constraint|gulf|hierarchy|trust|accessibility|primary action|workflow|state)\b/gi
      ) || [];
    const styleSignals =
      output.match(/\b(color|shadow|rounded|spacing|gradient|font|palette)\b/gi) ||
      [];

    if (productSignals.length >= 3 && styleSignals.length <= productSignals.length) {
      return 1;
    }
    if (productSignals.length >= 2)
      return {
        score: 0.5,
        metadata: { productSignals, styleSignals },
      };
    return { score: 0, metadata: { productSignals, styleSignals } };
  },
});

const waitsForApproval = createScorer<string, string, string>({
  name: "Waits for approval",
  description:
    "Checks that the response does not implement before approval and explicitly preserves the gate",
  scorer: ({ output }) => {
    const implementationLeak =
      /```|diff --git|apply_patch|export\s+(?:default\s+)?function|className=|<\w+[\s>]/.test(
        output
      );
    if (implementationLeak) {
      return { score: 0, metadata: { note: "Output includes implementation" } };
    }

    if (/approve|approval|before editing|after approval|if you approve/i.test(output)) {
      return 1;
    }

    return { score: 0.5, metadata: { note: "No explicit approval gate" } };
  },
});

const questionsAreLimited = createScorer<string, string, string>({
  name: "Questions are limited",
  description: "Checks that product-design asks only a small number of questions",
  scorer: ({ output }) => {
    const questionCount = (output.match(/\?/g) || []).length;
    if (questionCount <= 3) return 1;
    return { score: 0, metadata: { questionCount } };
  },
});

evalite("product-design", {
  data: [
    {
      input: `Use /product-design on this existing product screen.

Route: /admin/imports
Target user: operations lead reviewing a CSV import before committing it.
Observed UI: a full-width table shows raw rows with columns named row_id, external_status, action, and details. The primary button says "Run". Invalid rows are mixed with valid rows. The destructive action is available even when validation is still running. There is no empty or error state in the component.
Relevant component: app/admin/imports/import-review.tsx`,
      expected: "import-review-plan",
    },
    {
      input: `Run a product design critique for the billing settings workflow.

Route: /settings/billing
Observed state: account owners see current plan, invoices, payment method, and a red "Cancel" button above the upgrade CTA. Editors can also see the cancel button but get an API permission error after clicking. The copy uses raw enum labels like PLAN_PRO and past_due.
Goal: make the workflow safer and easier to understand before implementation.`,
      expected: "billing-workflow-plan",
    },
  ],

  task: async (input) => {
    return generateProductPlan(input);
  },

  scorers: [
    usesRequiredSections,
    groundsInProductEvidence,
    prioritizesProductOverAesthetics,
    waitsForApproval,
    questionsAreLimited,
  ],
});
