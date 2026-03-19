import { evalite } from "evalite";
import { createScorer } from "evalite";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

const skillPath = resolve(__dirname, "../nextjs-arch/SKILL.md");
const skillContent = readFileSync(skillPath, "utf-8").replace(
  /^---[\s\S]*?---\n/,
  ""
);

const client = new Anthropic();

async function generateNextJS(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a senior Next.js App Router engineer. Return ONLY the code — no explanation, no markdown fences. When the output spans multiple files, separate them with "// FILE: path/to/file.ts" comments.\n\n${skillContent}`,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

// Helper: split multi-file output into { path, content } pairs
function parseFiles(output: string): { path: string; content: string }[] {
  const parts = output.split(/\/\/\s*FILE:\s*/);
  if (parts.length <= 1) return [{ path: "unknown", content: output }];
  return parts
    .filter((p) => p.trim())
    .map((part) => {
      const firstNewline = part.indexOf("\n");
      const path = part.slice(0, firstNewline).trim();
      const content = part.slice(firstNewline + 1);
      return { path, content };
    });
}

// ---------------------------------------------------------------------------
// Scorers — server/client boundary
// ---------------------------------------------------------------------------

const noDBInClientComponents = createScorer<string, string, string>({
  name: "No DB in client components",
  description:
    "Fails if any file marked 'use client' imports from db, auth-helpers, or actions directly uses db",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    const violations: string[] = [];

    for (const file of files) {
      const isClient = /["']use client["']/.test(file.content);
      if (isClient) {
        if (/@\/lib\/db/.test(file.content)) {
          violations.push(`${file.path}: client component imports db`);
        }
        if (/@\/lib\/auth-helpers/.test(file.content)) {
          violations.push(
            `${file.path}: client component imports server-only auth-helpers`
          );
        }
        if (/@\/lib\/auth(?!-client)['"]/.test(file.content)) {
          violations.push(
            `${file.path}: client component imports server auth config`
          );
        }
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const serverActionsHaveAuth = createScorer<string, string, string>({
  name: "Server actions have auth",
  description:
    "Fails if server action files contain exported async functions without a requireUser/requireOrg/getServerSession call",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    const violations: string[] = [];

    for (const file of files) {
      const isServerAction = /["']use server["']/.test(file.content);
      if (!isServerAction) continue;

      // Find exported async functions
      const exportedFns = [
        ...file.content.matchAll(
          /export\s+async\s+function\s+(\w+)/g
        ),
      ];

      for (const fn of exportedFns) {
        // Get function body (rough: from function name to next export or end)
        const fnStart = fn.index!;
        const nextExport = file.content.indexOf("export ", fnStart + 1);
        const fnBody = file.content.slice(
          fnStart,
          nextExport > -1 ? nextExport : undefined
        );

        const hasAuth =
          /requireUser|requireOrg|getServerSession|getCurrentUser/.test(
            fnBody
          );
        if (!hasAuth) {
          violations.push(`${file.path}: ${fn[1]}() has no auth check`);
        }
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const serverActionsRevalidate = createScorer<string, string, string>({
  name: "Server actions revalidate",
  description:
    "Fails if server actions that perform mutations don't call revalidatePath or revalidateTag",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    const violations: string[] = [];

    for (const file of files) {
      const isServerAction = /["']use server["']/.test(file.content);
      if (!isServerAction) continue;

      // Check if file has any DB writes
      const hasMutation =
        /\.insert\(|\.update\(|\.delete\(|\.set\(|\.values\(/.test(
          file.content
        );
      if (!hasMutation) continue;

      const hasRevalidate =
        /revalidatePath|revalidateTag/.test(file.content);
      if (!hasRevalidate) {
        violations.push(`${file.path}: mutations without revalidation`);
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

// ---------------------------------------------------------------------------
// Scorers — data flow
// ---------------------------------------------------------------------------

const noClientSideFetching = createScorer<string, string, string>({
  name: "No client-side data fetching",
  description:
    "Fails if client components use useEffect+fetch or useSWR/react-query for data that should come from server components",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    const violations: string[] = [];

    for (const file of files) {
      const isClient = /["']use client["']/.test(file.content);
      if (!isClient) continue;

      // useEffect + fetch pattern
      if (/useEffect/.test(file.content) && /\bfetch\(/.test(file.content)) {
        violations.push(
          `${file.path}: useEffect + fetch — data should come from server component props`
        );
      }

      // SWR or react-query
      if (/\buseSWR\b|\buseQuery\b/.test(file.content)) {
        violations.push(
          `${file.path}: client-side data fetching library — prefer server component data flow`
        );
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0, metadata: { violations } };
  },
});

const propsDownActionsUp = createScorer<string, string, string>({
  name: "Props down, actions up",
  description:
    "Checks that server components pass data as props and client components call server actions for mutations",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    let hasServerPage = false;
    let serverPassesProps = false;
    let clientCallsAction = false;

    for (const file of files) {
      const isClient = /["']use client["']/.test(file.content);
      const isPage = /page\.tsx/.test(file.path);

      if (isPage && !isClient) {
        hasServerPage = true;
        // Check if it renders a component with props
        if (/<\w+\s+\w+=\{/.test(file.content)) {
          serverPassesProps = true;
        }
      }

      if (isClient) {
        // Check if it imports/calls a server action
        if (/@\/actions\//.test(file.content) || /startTransition/.test(file.content)) {
          clientCallsAction = true;
        }
      }
    }

    if (!hasServerPage)
      return { score: 0.5, metadata: { note: "No server page detected" } };

    let score = 0;
    if (serverPassesProps) score += 0.5;
    if (clientCallsAction) score += 0.5;

    return {
      score,
      metadata: { serverPassesProps, clientCallsAction },
    };
  },
});

// ---------------------------------------------------------------------------
// Scorers — form patterns
// ---------------------------------------------------------------------------

const usesTransitionForForms = createScorer<string, string, string>({
  name: "Uses useTransition for forms",
  description:
    "Checks that client form components use useTransition + startTransition pattern, not useFormStatus",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    let hasForm = false;

    for (const file of files) {
      const isClient = /["']use client["']/.test(file.content);
      if (!isClient) continue;

      if (/<form/.test(file.content)) {
        hasForm = true;

        if (/useFormStatus/.test(file.content)) {
          return {
            score: 0,
            metadata: { note: "Uses useFormStatus instead of useTransition" },
          };
        }
      }
    }

    if (!hasForm)
      return { score: 0.5, metadata: { note: "No form component detected" } };

    const hasTransition = /useTransition/.test(output);
    return hasTransition ? 1 : { score: 0.5, metadata: { note: "No useTransition found" } };
  },
});

// ---------------------------------------------------------------------------
// Scorers — naming & structure
// ---------------------------------------------------------------------------

const correctNamingConventions = createScorer<string, string, string>({
  name: "Correct naming conventions",
  description:
    "Checks that file paths use kebab-case and component exports use PascalCase",
  scorer: ({ output }) => {
    const files = parseFiles(output);
    const violations: string[] = [];

    for (const file of files) {
      if (file.path === "unknown") continue;

      const filename = file.path.split("/").pop() || "";
      // File should be kebab-case (allow dots for extensions)
      const nameWithoutExt = filename.replace(/\.\w+$/, "");
      if (/[A-Z]/.test(nameWithoutExt)) {
        violations.push(`${file.path}: filename not kebab-case`);
      }

      // Exported components should be PascalCase
      const exportedComponents = [
        ...file.content.matchAll(
          /export\s+(?:default\s+)?(?:function|const)\s+([a-z]\w*)/g
        ),
      ];
      for (const match of exportedComponents) {
        // Skip non-component exports (functions, variables)
        if (/^(?:use|get|set|update|delete|create|fetch|handle)/.test(match[1]))
          continue;
        // If it looks like a component (returns JSX) but starts lowercase
        if (/<\w+/.test(file.content)) {
          violations.push(
            `${file.path}: exported component "${match[1]}" should be PascalCase`
          );
        }
      }
    }

    if (violations.length === 0) return 1;
    return { score: 0.5, metadata: { violations } };
  },
});

const usesZodValidation = createScorer<string, string, string>({
  name: "Uses Zod validation in actions",
  description:
    "Checks that server actions validate input with Zod schemas",
  scorer: ({ output }) => {
    const files = parseFiles(output);

    for (const file of files) {
      const isServerAction = /["']use server["']/.test(file.content);
      if (!isServerAction) continue;

      const hasZod = /\bz\.\w+|\.parse\(|\.safeParse\(|zod/.test(
        file.content
      );
      if (!hasZod) {
        return {
          score: 0,
          metadata: {
            note: `${file.path}: server action without Zod validation`,
          },
        };
      }
    }

    return 1;
  },
});

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

evalite("nextjs-arch", {
  data: [
    {
      input:
        "Build a feature for a bookmarks app: a page that lists the user's bookmarks with title and URL, a form to add a new bookmark, and the ability to delete bookmarks. Include the page.tsx, loading.tsx, the form component, the server actions, and any Zod schemas needed. The route is /bookmarks.",
      expected: "bookmarks-feature",
    },
    {
      input:
        "Build a user profile settings feature: a server component page at /settings that reads the current user's name, email, and bio, passes them to a client SettingsForm component, and a server action that validates and updates the profile. Include all files needed.",
      expected: "settings-feature",
    },
    {
      input:
        "Build a team members page at /team that shows a table of team members (name, email, role) fetched from the database, with an invite form that takes an email and role. Include the page, loading state, form component, server action with auth check, and the Zod schema.",
      expected: "team-feature",
    },
  ],

  task: async (input) => {
    return generateNextJS(input);
  },

  scorers: [
    noDBInClientComponents,
    serverActionsHaveAuth,
    serverActionsRevalidate,
    noClientSideFetching,
    propsDownActionsUp,
    usesTransitionForForms,
    correctNamingConventions,
    usesZodValidation,
  ],
});
