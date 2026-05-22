import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../software-design/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateImplementation(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0,
    system: `You are a senior TypeScript engineer. Assume the software-design approval gate has already happened and the approved design is ready to build. Return ONLY code, no explanation, no markdown fences. When output spans multiple files, separate files with "// FILE: path/to/file.ts" comments.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  const raw = block.type === "text" ? block.text : "";
  return raw.replace(/^```\w*\n?/, "").replace(/\n?```\s*$/, "");
}

function parseFiles(output: string): { path: string; content: string }[] {
  const parts = output.split(/\/\/\s*FILE:\s*/);
  if (parts.length <= 1) return [{ path: "unknown", content: output }];
  return parts
    .filter((part) => part.trim())
    .map((part) => {
      const firstNewline = part.indexOf("\n");
      const path = part.slice(0, firstNewline).trim();
      const content = part.slice(firstNewline + 1);
      return { path, content };
    });
}

function isNextPrompt(input: string): boolean {
  return /Next\.js|App Router|page\.tsx|server action|route is|\/bookmarks|\/settings|\/team/i.test(
    input
  );
}

const noSpeculativeGenerality = createScorer<string, string, string>({
  name: "No speculative generality",
  description:
    "Fails if output includes unused flags, plugin systems, or extension points that were not requested",
  scorer: ({ input, output }) => {
    const patterns = [
      /enableFeature/i,
      /featureFlag/i,
      /\.isEnabled\b/,
      /pluginSystem|registerPlugin/i,
    ];
    const violations = patterns.filter((pattern) => pattern.test(output));
    if (violations.length > 0 && !/config|option|flag|setting/i.test(input)) {
      return {
        score: 0,
        metadata: { violations: violations.map((v) => v.source) },
      };
    }
    return 1;
  },
});

const noPrematureAbstraction = createScorer<string, string, string>({
  name: "No premature abstraction",
  description:
    "Fails if output creates abstract classes, factories, or strategy patterns for a single use case",
  scorer: ({ output }) => {
    const violations: string[] = [];

    if (/abstract\s+class/.test(output)) {
      const abstractCount = (output.match(/abstract\s+class/g) || []).length;
      const extendsCount = (output.match(/extends\s+\w+/g) || []).length;
      if (extendsCount <= abstractCount) {
        violations.push("abstract class with no/single implementation");
      }
    }

    if (/Factory/.test(output) && !/factory/i.test(output.split("\n")[0])) {
      violations.push("factory pattern");
    }

    if (/Strategy/.test(output)) {
      const strategyImpls = (output.match(/implements\s+\w*Strategy/g) || [])
        .length;
      if (strategyImpls <= 1) {
        violations.push("strategy pattern with single implementation");
      }
    }

    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const noLayerByLayer = createScorer<string, string, string>({
  name: "No layer-by-layer construction",
  description:
    "Warns when output is organized only by technical layers instead of feature slices",
  scorer: ({ output }) => {
    const layerHeaders = output.match(
      /\/\/\s*(?:=+|-+)\s*(?:Types|Models|Utils|Helpers|Handlers|Controllers|Services|Repositories)\b/gi
    );
    if (layerHeaders && layerHeaders.length >= 4) {
      return {
        score: 0.5,
        metadata: { layers: layerHeaders.map((h) => h.trim()) },
      };
    }
    return 1;
  },
});

const noPrematureComponentExtraction = createScorer<string, string, string>({
  name: "No premature component extraction",
  description:
    "Fails if output creates shared/generic wrapper components used only once",
  scorer: ({ input, output }) => {
    if (!/React|component|UI|TSX|Next\.js/i.test(input)) return 1;

    const componentDefs = [
      ...output.matchAll(
        /(?:function|const)\s+([A-Z]\w+)\s*(?:=\s*(?:\([^)]*\)|[^=])*=>|\()/g
      ),
    ].map((match) => match[1]);

    const violations: string[] = [];
    for (const name of componentDefs) {
      const usages = (
        output.match(new RegExp(`<${name}[\\s/>]`, "g")) || []
      ).length;
      const isExported = new RegExp(
        `export\\s+(?:default\\s+)?(?:function|const)\\s+${name}`
      ).test(output);
      if (usages <= 1 && !isExported) {
        violations.push(`${name} defined but used ${usages} time(s)`);
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
  description: "Fails if any component has more than 12 props",
  scorer: ({ input, output }) => {
    if (!/React|component|UI|TSX|Next\.js/i.test(input)) return 1;

    const propTypes = [
      ...output.matchAll(
        /(?:type|interface)\s+\w+Props\s*(?:=\s*\{|{)([\s\S]*?)\}/g
      ),
    ];
    const violations: string[] = [];
    for (const match of propTypes) {
      const propCount = (match[1].match(/\w+\s*[?:]?\s*:/g) || []).length;
      if (propCount > 12) violations.push(`Props type with ${propCount} props`);
    }

    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const noContextAsGlobalState = createScorer<string, string, string>({
  name: "No context as global state",
  description:
    "Warns if React context carries frequently-changing UI or list state",
  scorer: ({ input, output }) => {
    if (!/React|component|UI|TSX|Next\.js/i.test(input)) return 1;
    if (!/createContext/.test(output)) return 1;

    const contextValues = [...output.matchAll(/value=\{\{?([\s\S]*?)\}?\}/g)];
    const violations: string[] = [];
    for (const match of contextValues) {
      const value = match[1];
      if (/\bset\w+\b/.test(value) && /\bitems\b|\blist\b|\bdata\b/i.test(value)) {
        violations.push("context provides frequently-changing state + setters");
      }
      const valueCount = (value.match(/\w+,/g) || []).length + 1;
      if (valueCount > 5) {
        violations.push(`context with ${valueCount} values`);
      }
    }

    return violations.length === 0
      ? 1
      : { score: 0.5, metadata: { violations } };
  },
});

const hasCleanPropInterfaces = createScorer<string, string, string>({
  name: "Clean prop interfaces",
  description: "Checks that React components have focused prop typing",
  scorer: ({ input, output }) => {
    if (!/React|component|UI|TSX|Next\.js/i.test(input)) return 1;
    const hasTypes =
      /:\s*\{[^}]+\}|Props\b|interface\s+\w+|type\s+\w+/.test(output);
    const hasInlineTypes = /\(\s*\{[^}]+\}\s*:\s*\{/.test(output);
    if (!hasTypes && !hasInlineTypes && output.includes("function")) {
      return {
        score: 0.5,
        metadata: { note: "components may be missing prop types" },
      };
    }
    return 1;
  },
});

const noDBInClientComponents = createScorer<string, string, string>({
  name: "No DB in client components",
  description: "Fails if client files import server-only DB/auth modules",
  scorer: ({ output }) => {
    const violations: string[] = [];
    for (const file of parseFiles(output)) {
      if (!/["']use client["']/.test(file.content)) continue;
      if (/@\/lib\/db/.test(file.content)) {
        violations.push(`${file.path}: client component imports db`);
      }
      if (/@\/lib\/auth-helpers/.test(file.content)) {
        violations.push(`${file.path}: client component imports auth helpers`);
      }
      if (/@\/lib\/auth(?!-client)['"]/.test(file.content)) {
        violations.push(`${file.path}: client component imports server auth`);
      }
    }
    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const serverActionsHaveAuth = createScorer<string, string, string>({
  name: "Server actions have auth",
  description: "Fails if exported server actions do not perform auth checks",
  scorer: ({ output }) => {
    const violations: string[] = [];
    for (const file of parseFiles(output)) {
      if (!/["']use server["']/.test(file.content)) continue;
      const exportedFns = [
        ...file.content.matchAll(/export\s+async\s+function\s+(\w+)/g),
      ];
      for (const fn of exportedFns) {
        const fnStart = fn.index!;
        const nextExport = file.content.indexOf("export ", fnStart + 1);
        const fnBody = file.content.slice(
          fnStart,
          nextExport > -1 ? nextExport : undefined
        );
        if (!/requireUser|requireOrg|getServerSession|getCurrentUser/.test(fnBody)) {
          violations.push(`${file.path}: ${fn[1]}() has no auth check`);
        }
      }
    }
    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const serverActionsRevalidate = createScorer<string, string, string>({
  name: "Server actions revalidate",
  description: "Fails if mutating server actions do not revalidate",
  scorer: ({ output }) => {
    const violations: string[] = [];
    for (const file of parseFiles(output)) {
      if (!/["']use server["']/.test(file.content)) continue;
      const hasMutation = /\.insert\(|\.update\(|\.delete\(|\.set\(|\.values\(/.test(
        file.content
      );
      if (hasMutation && !/revalidatePath|revalidateTag/.test(file.content)) {
        violations.push(`${file.path}: mutation without revalidation`);
      }
    }
    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const noClientSideFetching = createScorer<string, string, string>({
  name: "No client-side data fetching",
  description: "Fails if client components fetch server data in effects",
  scorer: ({ output }) => {
    const violations: string[] = [];
    for (const file of parseFiles(output)) {
      if (!/["']use client["']/.test(file.content)) continue;
      if (/useEffect/.test(file.content) && /\bfetch\(/.test(file.content)) {
        violations.push(`${file.path}: useEffect + fetch`);
      }
      if (/\buseSWR\b|\buseQuery\b/.test(file.content)) {
        violations.push(`${file.path}: client data fetching library`);
      }
    }
    return violations.length === 0
      ? 1
      : { score: 0, metadata: { violations } };
  },
});

const propsDownActionsUp = createScorer<string, string, string>({
  name: "Props down, actions up",
  description: "Checks Next.js server-to-client data and mutation flow",
  scorer: ({ input, output }) => {
    if (!isNextPrompt(input)) return 1;

    const files = parseFiles(output);
    let hasServerPage = false;
    let serverPassesProps = false;
    let clientCallsAction = false;

    for (const file of files) {
      const isClient = /["']use client["']/.test(file.content);
      if (/page\.tsx/.test(file.path) && !isClient) {
        hasServerPage = true;
        if (/<\w+\s+\w+=\{/.test(file.content)) serverPassesProps = true;
      }
      if (isClient && (/@\/actions\//.test(file.content) || /startTransition|action=\{/.test(file.content))) {
        clientCallsAction = true;
      }
    }

    if (!hasServerPage) {
      const wholeHasProps = /<\w+\s+\w+=\{/.test(output);
      const wholeHasAction = /@\/actions\/|startTransition|action=\{/.test(output);
      if (wholeHasProps && wholeHasAction) return 1;
      return {
        score: 0.5,
        metadata: { note: "No server page detected" },
      };
    }

    return {
      score: Number(serverPassesProps) * 0.5 + Number(clientCallsAction) * 0.5,
      metadata: { serverPassesProps, clientCallsAction },
    };
  },
});

const usesZodValidation = createScorer<string, string, string>({
  name: "Uses Zod validation in actions",
  description: "Checks that server actions validate input with Zod",
  scorer: ({ output }) => {
    for (const file of parseFiles(output)) {
      if (!/["']use server["']/.test(file.content)) continue;
      if (!/\bz\.\w+|\.parse\(|\.safeParse\(|zod/.test(file.content)) {
        return {
          score: 0,
          metadata: { note: `${file.path}: server action without Zod` },
        };
      }
    }
    return 1;
  },
});

const correctNamingConventions = createScorer<string, string, string>({
  name: "Correct naming conventions",
  description: "Checks file path and exported component naming",
  scorer: ({ output }) => {
    const violations: string[] = [];
    for (const file of parseFiles(output)) {
      if (file.path === "unknown") continue;
      const filename = file.path.split("/").pop() || "";
      const nameWithoutExt = filename.replace(/\.\w+$/, "");
      if (/[A-Z]/.test(nameWithoutExt)) {
        violations.push(`${file.path}: filename not kebab-case`);
      }
      if (/["']use server["']/.test(file.content)) continue;
      const exportedComponents = [
        ...file.content.matchAll(
          /export\s+(?:default\s+)?(?:function|const)\s+([a-z]\w*)/g
        ),
      ];
      for (const match of exportedComponents) {
        if (/^(?:use|get|set|update|delete|create|fetch|handle|is|has|parse|format)/.test(match[1]))
          continue;
        if (/<\w+/.test(file.content)) {
          violations.push(`${file.path}: ${match[1]} should be PascalCase`);
        }
      }
    }
    return violations.length === 0
      ? 1
      : { score: 0.5, metadata: { violations } };
  },
});

evalite("software-design", {
  data: [
    {
      input:
        "Build a notification system that sends emails and Slack messages when user signup, payment received, or subscription cancelled events occur. Include event handlers and dispatching logic.",
      expected: "general-feature",
    },
    {
      input:
        "Build a React task list where users can add tasks with a title and due date, mark them complete, and filter by all, active, or completed. Include state management and the full UI.",
      expected: "react-task-list",
    },
    {
      input:
        "Build a Next.js App Router bookmarks feature at /bookmarks with page.tsx, loading.tsx, a client form to add bookmarks, server actions to add/delete, and Zod schemas.",
      expected: "nextjs-bookmarks",
    },
  ],

  task: async (input) => {
    return generateImplementation(input);
  },

  scorers: [
    noSpeculativeGenerality,
    noPrematureAbstraction,
    noLayerByLayer,
    noPrematureComponentExtraction,
    noPropExplosion,
    noContextAsGlobalState,
    hasCleanPropInterfaces,
    noDBInClientComponents,
    serverActionsHaveAuth,
    serverActionsRevalidate,
    noClientSideFetching,
    propsDownActionsUp,
    usesZodValidation,
    correctNamingConventions,
  ],
});
