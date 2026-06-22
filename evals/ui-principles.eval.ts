import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EVAL_MODEL } from "./model";

// Load the skill as a system prompt
const skillPath = resolve(__dirname, "../ui-principles/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8")
  // Strip YAML frontmatter
  .replace(/^---[\s\S]*?---\n/, "");

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Task: generate UI with the skill as system prompt. The skill is framework-
// agnostic ("rules, not numbers"), so the harness supplies a project with
// semantic tokens for the rules to bind to.
// ---------------------------------------------------------------------------

async function generateUI(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: EVAL_MODEL,
    max_tokens: 4096,
    temperature: 0,
    system: `You are a frontend engineer building product UI in React with Tailwind CSS. The project defines semantic color tokens as CSS-variable classes (bg-background, text-foreground, bg-muted, text-muted-foreground, bg-card, border-border, bg-primary, text-primary-foreground). Return ONLY the TSX code for the component — no explanation, no markdown fences.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  const raw = block.type === "text" ? block.text : "";
  return raw.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "");
}

// ---------------------------------------------------------------------------
// Scorers — each asserts a hard rule from the skill
// ---------------------------------------------------------------------------

// "Weight is two steps — normal and medium, medium the ceiling."
const weightCeiling = createScorer<string, string, string>({
  name: "Weight ceiling is medium",
  description:
    "Fails if font-semibold, font-bold, font-extrabold, or font-black is used — weight is two steps, medium the ceiling",
  scorer: ({ output }) => {
    const heavy = output.match(/\bfont-(semibold|bold|extrabold|black)\b/g);
    if (!heavy || heavy.length === 0) return 1;
    return { score: 0, metadata: { violations: heavy } };
  },
});

// "Never all-caps with positive letter-spacing."
const noAllCapsTracking = createScorer<string, string, string>({
  name: "No all-caps with positive tracking",
  description:
    "Fails if uppercase is combined with tracking-wide/wider/widest on the same element",
  scorer: ({ output }) => {
    const lines = output.split("\n");
    const violations = lines.filter(
      (l) => /\buppercase\b/.test(l) && /\btracking-(wide|wider|widest)\b/.test(l)
    );
    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations: violations.map((l) => l.trim()) } };
  },
});

// "Transitions affect color/background only. Never opacity, transform, scale, or shadow on hover."
const colorOnlyHover = createScorer<string, string, string>({
  name: "Hover transitions are color/background only",
  description:
    "Fails on hover:scale-*, hover:shadow-*, hover:opacity-*, hover:translate-*, or transition-transform",
  scorer: ({ output }) => {
    const violations = output.match(
      /\b(hover:-?scale-[\w.]+|hover:shadow-\w+|hover:opacity-\d+|hover:-?translate-[\w.]+|transition-transform)\b/g
    );
    if (!violations || violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

// "One corner radius across the whole surface."
const oneRadius = createScorer<string, string, string>({
  name: "One corner radius",
  description:
    "Checks that at most one named radius step is used across the surface (rounded-full on avatars/icons is exempt)",
  scorer: ({ output }) => {
    const radii = output.match(/\brounded-(sm|md|lg|xl|2xl|3xl)\b/g) || [];
    const unique = [...new Set(radii)];
    if (unique.length <= 1) return 1;
    if (unique.length === 2) return { score: 0.5, metadata: { radii: unique } };
    return { score: 0, metadata: { radii: unique } };
  },
});

// "Bind to the project's semantic tokens; don't hardcode one-off colors."
const noHardcodedColors = createScorer<string, string, string>({
  name: "No hardcoded colors",
  description:
    "Fails if the output uses palette classes (bg-gray-*, text-white, etc.) or hex values instead of the project's semantic tokens",
  scorer: ({ output }) => {
    const hardcoded = output.match(
      /\b(bg-gray-\d+|bg-white|bg-black|text-gray-\d+|text-white|text-black|border-gray-\d+)\b|#[0-9a-fA-F]{3,8}\b/g
    );
    if (!hardcoded || hardcoded.length === 0) return 1;
    return { score: 0, metadata: { violations: hardcoded } };
  },
});

// "Design empty, loading, error, success, and overflow states."
const designedStates = createScorer<string, string, string>({
  name: "Designed empty/loading states",
  description:
    "Checks that a data-driven surface handles at least an empty state, ideally loading/error too",
  scorer: ({ output }) => {
    const empty =
      /\.length\s*===?\s*0|isEmpty|\bempty\b|No (results|items|projects|members|activity|notifications)/i.test(
        output
      );
    const loadingOrError = /isLoading|loading|skeleton|isError|error/i.test(output);
    if (empty && loadingOrError) return 1;
    if (empty || loadingOrError)
      return { score: 0.5, metadata: { empty, loadingOrError } };
    return { score: 0, metadata: { note: "No designed states found" } };
  },
});

// ---------------------------------------------------------------------------
// Eval definition — every prompt involves a collection so designed states
// are fairly assessable
// ---------------------------------------------------------------------------

evalite("ui-principles", {
  data: [
    {
      input:
        "Build a projects table for a workspace. Columns: project name, status (active/archived/draft), last updated, owner. Include a search input above the table. The data comes in as a `projects` prop that may be empty or still loading.",
      expected: "projects-table",
    },
    {
      input:
        "Build a team members panel: a heading, a short description, and a list of members (avatar, name, role, joined date) with an invite button. Members arrive as a possibly-empty `members` prop.",
      expected: "members-panel",
    },
    {
      input:
        "Build an activity feed for a dashboard: page heading, a feed of events (actor, action, target, timestamp), and a filter dropdown for event type. Events come from an `events` prop that may be empty or loading.",
      expected: "activity-feed",
    },
  ],

  task: async (input) => {
    return generateUI(input);
  },

  scorers: [
    weightCeiling,
    noAllCapsTracking,
    colorOnlyHover,
    oneRadius,
    noHardcodedColors,
    designedStates,
  ],
});
