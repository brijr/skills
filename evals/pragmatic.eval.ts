import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../pragmatic/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateCode(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0,
    system: `You are a senior software engineer building features in TypeScript. Return ONLY the code — no explanation, no markdown fences.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  const raw = block.type === "text" ? block.text : "";
  return raw.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "");
}

// ---------------------------------------------------------------------------
// Scorers — anti-pattern suppression
// ---------------------------------------------------------------------------

const noSpeculativeGenerality = createScorer<string, string, string>({
  name: "No speculative generality",
  description:
    "Fails if the output includes unused options, config params, feature flags, or generic extension points that weren't requested",
  scorer: ({ input, output }) => {
    const speculativePatterns = [
      /enableFeature/i,
      /featureFlag/i,
      /\.isEnabled\b/,
      /pluginSystem|registerPlugin/i,
    ];
    const violations = speculativePatterns.filter((p) => p.test(output));
    // Only flag if the input didn't ask for configuration/options
    if (
      violations.length > 0 &&
      !/config|option|flag|setting/i.test(input)
    ) {
      return {
        score: 0,
        metadata: {
          violations: violations.map((v) => v.source),
        },
      };
    }
    return 1;
  },
});

const noPrematureAbstraction = createScorer<string, string, string>({
  name: "No premature abstraction",
  description:
    "Fails if the output creates abstract base classes, generic factory patterns, or strategy patterns for a single use case",
  scorer: ({ output }) => {
    const violations: string[] = [];

    // Abstract class with only one implementation implied
    if (/abstract\s+class/.test(output)) {
      const abstractCount = (output.match(/abstract\s+class/g) || []).length;
      const extendsCount = (output.match(/extends\s+\w+/g) || []).length;
      if (abstractCount > 0 && extendsCount <= abstractCount) {
        violations.push("abstract class with no/single implementation");
      }
    }

    // Factory pattern for one type
    if (/Factory/.test(output) && !/factory/i.test(output.split("\n")[0])) {
      violations.push("factory pattern");
    }

    // Strategy pattern with single strategy
    if (/Strategy/.test(output)) {
      const strategyImpls = (output.match(/implements\s+\w*Strategy/g) || [])
        .length;
      if (strategyImpls <= 1) {
        violations.push("strategy pattern with single implementation");
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const noLayerByLayer = createScorer<string, string, string>({
  name: "No layer-by-layer construction",
  description:
    "Checks that the output isn't organized purely by technical layer (all types, then all utils, then all handlers) with no vertical integration",
  scorer: ({ output }) => {
    // Only flag if code is organized PURELY by technical layer names
    const layerHeaders = output.match(
      /\/\/\s*(?:=+|-+)\s*(?:Types|Models|Utils|Helpers|Handlers|Controllers|Services|Repositories)\b/gi
    );
    if (layerHeaders && layerHeaders.length >= 4) {
      return {
        score: 0.5,
        metadata: {
          note: "Output organized by technical layer rather than feature slice",
          layers: layerHeaders.map((h) => h.trim()),
        },
      };
    }
    return 1;
  },
});

const noCopyPasteBlocks = createScorer<string, string, string>({
  name: "No copy-paste blocks",
  description:
    "Detects near-identical code blocks that suggest copy-paste rather than proper abstraction",
  scorer: ({ output }) => {
    const lines = output.split("\n").filter((l) => l.trim().length > 10);
    const duplicates: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 3; j < lines.length; j++) {
        // Check for 4+ consecutive matching lines
        let matchLen = 0;
        while (
          i + matchLen < lines.length &&
          j + matchLen < lines.length &&
          lines[i + matchLen].trim() === lines[j + matchLen].trim()
        ) {
          matchLen++;
        }
        if (matchLen >= 4) {
          duplicates.push(
            `Lines ~${i + 1}-${i + matchLen} duplicated at ~${j + 1}-${j + matchLen}`
          );
          break;
        }
      }
    }

    if (duplicates.length === 0) return 1;
    return { score: 0, metadata: { duplicates } };
  },
});

// ---------------------------------------------------------------------------
// Scorers — positive signal
// ---------------------------------------------------------------------------

const isEasyToChange = createScorer<string, string, string>({
  name: "Easy to change (ETC)",
  description:
    "Checks that functions are small, focused, and use dependency injection or explicit params over hard-coded dependencies",
  scorer: ({ output }) => {
    const functions = output.match(
      /(?:function\s+\w+|(?:const|let)\s+\w+\s*=\s*(?:async\s*)?\()/g
    );
    if (!functions || functions.length === 0)
      return { score: 0.5, metadata: { note: "No functions detected" } };

    // Check function sizes — split by function boundaries
    const funcBodies = output.split(
      /(?:function\s+\w+|(?:const|let)\s+\w+\s*=\s*(?:async\s*)?\()/
    );
    const longFunctions = funcBodies.filter(
      (body) => body.split("\n").length > 40
    );

    if (longFunctions.length > 0) {
      return {
        score: 0.5,
        metadata: {
          note: `${longFunctions.length} function(s) over 40 lines`,
        },
      };
    }
    return 1;
  },
});

const hasExplicitDependencies = createScorer<string, string, string>({
  name: "Explicit dependencies",
  description:
    "Checks that functions receive dependencies as parameters rather than importing/accessing globals inline",
  scorer: ({ output }) => {
    // Check for global mutable state access patterns
    const globalAccess = output.match(
      /\bglobal\b|\bwindow\.\w+\s*=|\bprocess\.env\.\w+/g
    );
    // process.env reads are OK in config, not in business logic functions
    const envReads = (output.match(/process\.env\.\w+/g) || []).length;
    const totalFunctions = (
      output.match(
        /(?:function\s+\w+|(?:const|let)\s+\w+\s*=\s*(?:async\s*)?\()/g
      ) || []
    ).length;

    if (envReads > totalFunctions) {
      return {
        score: 0.5,
        metadata: {
          note: "Multiple env reads scattered across functions — consider a config object",
        },
      };
    }
    return 1;
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("pragmatic", {
  data: [
    {
      input:
        "Build a notification system that sends emails and Slack messages when certain events occur (user signup, payment received, subscription cancelled). Include the event handlers and the notification dispatching logic.",
      expected: "notification-system",
    },
    {
      input:
        "Build a file processing pipeline that reads CSV files, validates the rows against a schema, transforms valid rows into a normalized format, and writes the output to a new file. Handle errors for individual rows without stopping the whole pipeline.",
      expected: "file-pipeline",
    },
    {
      input:
        "Build an API rate limiter middleware that tracks requests per user per endpoint. It should use a sliding window algorithm, return appropriate 429 responses with retry-after headers, and be configurable per route.",
      expected: "rate-limiter",
    },
  ],

  task: async (input) => {
    return generateCode(input);
  },

  scorers: [
    noSpeculativeGenerality,
    noPrematureAbstraction,
    noLayerByLayer,
    noCopyPasteBlocks,
    isEasyToChange,
    hasExplicitDependencies,
  ],
});
