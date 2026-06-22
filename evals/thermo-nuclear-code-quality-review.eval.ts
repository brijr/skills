import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EVAL_MODEL } from "./model";

const skillPath = resolve(
  __dirname,
  "../thermo-nuclear-code-quality-review/SKILL.md"
);
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateReview(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: EVAL_MODEL,
    max_tokens: 4096,
    temperature: 0,
    system: `You are reviewing a current branch diff. Return only the review feedback.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

const leadsWithFindings = createScorer<string, string, string>({
  name: "Leads with findings",
  description:
    "Checks that the review starts with findings instead of a summary, praise, or process narration",
  scorer: ({ output }) => {
    const firstNonEmpty = output
      .split("\n")
      .find((line) => line.trim().length > 0)
      ?.trim();
    if (!firstNonEmpty) return { score: 0, metadata: { note: "No output" } };

    if (/^(summary|overall|looks good|great|i reviewed|here)/i.test(firstNonEmpty)) {
      return { score: 0, metadata: { firstNonEmpty } };
    }

    if (/finding|p[0-3]|blocker|structural|issue/i.test(firstNonEmpty)) {
      return 1;
    }

    return { score: 0.5, metadata: { firstNonEmpty } };
  },
});

const referencesFilesAndLines = createScorer<string, string, string>({
  name: "References files and lines",
  description: "Checks that findings are grounded in concrete file/line evidence",
  scorer: ({ output }) => {
    const references =
      output.match(/\b(?:src|app|packages|components|lib)\/[\w./-]+:\d+/g) ||
      [];
    if (references.length >= 2) return 1;
    if (references.length === 1)
      return { score: 0.5, metadata: { references } };
    return { score: 0, metadata: { note: "No file:line references found" } };
  },
});

const catchesStructuralProblems = createScorer<string, string, string>({
  name: "Catches structural problems",
  description:
    "Checks that feedback names maintainability structure rather than surface style",
  scorer: ({ output }) => {
    const signals = [
      /branching|conditional|special-case|spaghetti/i,
      /abstraction|wrapper|indirection|pass-through/i,
      /boundary|ownership|leak/i,
      /type|contract|any|unknown|optional/i,
      /decompose|split|module|file/i,
    ];
    const found = signals.filter((signal) => signal.test(output));
    if (found.length >= 3) return 1;
    if (found.length >= 2)
      return { score: 0.5, metadata: { found: found.map((f) => f.source) } };
    return { score: 0, metadata: { found: found.map((f) => f.source) } };
  },
});

const proposesSimplifyingDirection = createScorer<string, string, string>({
  name: "Proposes simplifying direction",
  description:
    "Checks that each major concern has a cleaner direction, not just complaint text",
  scorer: ({ output }) => {
    const remedySignals =
      output.match(
        /\b(can we|should|move|extract|delete|collapse|replace|model|dispatcher|policy|state machine|decompose|split|reuse)\b/gi
      ) || [];
    if (remedySignals.length >= 4) return 1;
    if (remedySignals.length >= 2)
      return { score: 0.5, metadata: { remedySignals } };
    return { score: 0, metadata: { remedySignals } };
  },
});

const doesNotApproveMessyDiff = createScorer<string, string, string>({
  name: "Does not approve messy diff",
  description:
    "Fails if the review approves or only asks for cosmetic cleanup on structurally messy examples",
  scorer: ({ output }) => {
    if (
      /\b(lgtm|ship it|looks good|no issues|nothing blocking)\b/i.test(output) ||
      /^\s*approved\b/im.test(output)
    ) {
      return { score: 0, metadata: { note: "Approved a messy diff" } };
    }
    if (
      /\b(nit|nitpick|formatting|rename|comment)\b/i.test(output) &&
      !/\bstructural|branching|abstraction|decompose|boundary\b/i.test(output)
    ) {
      return { score: 0, metadata: { note: "Cosmetic-only feedback" } };
    }
    return 1;
  },
});

evalite("thermo-nuclear-code-quality-review", {
  data: [
    {
      input: `Perform a thermo-nuclear review of this current branch diff. Use file:line references in findings.

src/notifications/dispatch.ts
12 export async function dispatchNotification(event: any, user: any) {
13   if (event.type === "trial_started") {
14     await sendEmail(user.email, "trial");
15   } else if (event.type === "trial_cancelled") {
16     await sendEmail(user.email, "cancelled");
17   } else if (event.type === "payment_failed") {
18     await sendEmail(user.email, "failed");
19   } else if (event.type === "payment_failed" && user.flags?.includes("vip")) {
20     await sendSlack("#vip", user.email);
21   }
22 }

src/app/admin/page.tsx
44 // file is now 1168 lines
45 function AdminPage() {
46   const mode = searchParams.mode || "users";
47   const isBilling = mode === "billing";
48   const isUsers = mode === "users";
49   const isAudit = mode === "audit";
50   // hundreds of lines of mode-specific rendering and mutations
51 }`,
      expected: "structural-review",
    },
    {
      input: `Perform a harsh maintainability review of this branch. Use file:line references in findings.

packages/importer/src/run.ts
8 type Row = Record<string, unknown>;
9 export async function runImport(rows: Row[], dryRun?: boolean, skipInvalid?: boolean) {
10   const created: any[] = [];
11   for (const row of rows) {
12     if ((row as any).kind === "lead") {
13       if (!dryRun) created.push(await createLead(row as any));
14     }
15     if ((row as any).kind === "contact") {
16       if (!dryRun) created.push(await createContact(row as any));
17     }
18     if ((row as any).kind === "matter") {
19       if (!dryRun) created.push(await createMatter(row as any));
20     }
21     if (!skipInvalid && !(row as any).email) throw new Error("bad row");
22   }
23   return created;
24 }`,
      expected: "type-boundary-review",
    },
  ],

  task: async (input) => {
    return generateReview(input);
  },

  scorers: [
    leadsWithFindings,
    referencesFilesAndLines,
    catchesStructuralProblems,
    proposesSimplifyingDirection,
    doesNotApproveMessyDiff,
  ],
});
