---
name: nextjs-arch
description: Enforce a clean Next.js App Router architecture when building or scaffolding features, routes, components, actions, or data layers. Covers directory structure, server/client boundaries, data flow, auth gating, server actions, DB queries, and naming conventions. Use when the user asks to build, add, scaffold, or restructure anything in a Next.js App Router project. Do not use for marketing sites, static pages, or non-Next.js projects.
---

# nextjs-arch — Clean Next.js App Router Architecture

This skill enforces a specific project architecture for Next.js App Router applications. It is not generic guidance — it is an opinionated constraint system based on a proven production structure.

Read every rule before writing code. Every rule is testable — you should be able to look at the file tree and answer yes/no.

## Directory Structure

This is the canonical layout. Do not invent new top-level directories. Every file has exactly one correct home.

```
app/
  layout.tsx             Root layout (html, fonts, providers, toaster)
  page.tsx               Landing / public entry
  globals.css            Tailwind v4 config + color tokens
  not-found.tsx          Global 404
  global-error.tsx       Root error boundary ("use client")
  (app)/                 Protected route group
    layout.tsx           Auth gate + shell (sidebar, header, container)
    error.tsx            Protected error boundary
    [feature]/
      page.tsx           Server component — fetches data, passes to clients
      loading.tsx        Skeleton loading state
  (auth)/                Public auth route group
    layout.tsx           Centered layout wrapper
    sign-in/page.tsx     "use client"
    sign-up/page.tsx     "use client"
  api/
    auth/[...all]/route.ts   Auth catch-all handler
    [feature]/route.ts       Feature-specific API routes (uploads, webhooks, streaming)

actions/                 Server actions only — nothing else
  [feature].ts

components/
  [feature].tsx          Feature-specific components
  ds.tsx                 Design system layout primitives
  forms/
    [feature]-form.tsx   Client form components
  charts/
    [feature]-chart.tsx  Client chart components (dynamic import, ssr: false)
  layout/
    [component].tsx      Shell layout components
  ui/                    shadcn/ui primitives — do not put custom components here

lib/
  utils.ts               cn(), formatDate(), serializeForClient()
  validators.ts          All Zod schemas + inferred types
  auth.ts                Auth server config (SERVER ONLY)
  auth-client.ts         Auth client (signIn, signUp, signOut, useSession)
  auth-helpers.ts        Server auth helpers (SERVER ONLY)
  blob.ts                File storage wrappers
  ai/
    client.ts            AI SDK wrappers
  db/
    index.ts             DB connection, exports `db`
    schema.ts            All Drizzle table definitions + relations
    queries.ts           Reusable read queries

types/
  index.ts               Shared TypeScript types

hooks/
  use-[name].ts          Client-side hooks
```

### Rules

- **Route groups for auth boundaries.** `(app)` is protected, `(auth)` is public. Parenthetical groups only — no URL impact.
- **One auth gate.** The `(app)/layout.tsx` checks auth and redirects. Individual pages inside `(app)` never re-check auth.
- **Features are flat.** A feature is a route directory with `page.tsx`, optionally `loading.tsx`. Do not nest feature directories unless there's a real URL hierarchy.
- **`ui/` is sacred.** Only shadcn/ui primitives live in `components/ui/`. Custom components go in `components/` or `components/[category]/`.

## Server / Client Boundary

This is the single most important architectural decision. Get it wrong and the whole app leaks.

### Strictly Server-Only (never import in client components)

- `lib/db/*` — database connection and queries
- `lib/auth.ts` — auth server config
- `lib/auth-helpers.ts` — session/user helpers
- `lib/blob.ts` — file storage
- `actions/*` — server actions

### Client-Only (must have `"use client"`)

- All `components/forms/*`
- All `components/charts/*`
- Interactive shell components (sidebar, header with dropdowns)
- Theme provider, mode toggle
- `lib/auth-client.ts`

### Server Components (default, no directive)

- All `page.tsx` files (except auth pages)
- All `layout.tsx` files
- Design system primitives (`ds.tsx`)
- Any component that doesn't need interactivity

### The Rule

**Default to server. Add `"use client"` only when you need browser APIs, event handlers, hooks, or interactivity.** If a component only renders props, it stays on the server.

## Data Flow

This is the one correct data flow pattern. Do not invent alternatives.

```
Server Component (page.tsx)
  → calls auth helper (getCurrentUser / requireUser)
  → fetches data via db.query or query function from lib/db/queries.ts
  → renders, passing data as props to Client Components

Client Component
  → receives data as props (defaultValues, items, user, etc.)
  → calls Server Action inside startTransition(async () => { ... })
  → shows feedback via toast

Server Action (actions/[feature].ts)
  → "use server" at top
  → calls requireUser() or requireOrg() (auth check first, always)
  → validates input with Zod .parse()
  → mutates DB
  → calls revalidatePath() for affected routes
```

### Rules

- **Server components fetch, client components display and mutate.** Never fetch data inside a client component. Never call `db` from a client component.
- **Props down, actions up.** Data flows down through props. Mutations flow up through server actions.
- **Auth check in every action.** Every server action starts with `requireUser()` or `requireOrg()`. No exceptions.
- **Validate in actions.** Parse input with Zod in the server action, not in the client component.
- **Revalidate after mutation.** Every server action that writes data calls `revalidatePath()`.

## Server Actions Pattern

Every server action follows this exact structure:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tableSchema } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-helpers";
import { eq } from "drizzle-orm";
import { featureSchema, type FeatureInput } from "@/lib/validators";

export async function updateFeature(input: FeatureInput) {
  const user = await requireUser();
  const validated = featureSchema.parse(input);

  await db.update(tableSchema)
    .set({ ...validated })
    .where(eq(tableSchema.id, validated.id));

  revalidatePath("/feature");
}
```

### Rules

- **One file per feature domain** in the `actions/` directory.
- **Auth first, validate second, mutate third, revalidate fourth.** Always in this order.
- **Types come from Zod.** Use `z.infer<typeof schema>` for action input types. Define schemas in `lib/validators.ts`.

## Client Form Pattern

Every form follows this exact structure:

```tsx
"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateFeature } from "@/actions/feature";

export function FeatureForm({ defaultValues }: { defaultValues: FeatureInput }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateFeature({
          /* extract from formData */
        });
        toast.success("Updated");
      } catch {
        toast.error("Failed to update");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

### Rules

- **`useTransition`, not `useFormStatus`.** Wrap server action calls in `startTransition`.
- **Native FormData.** Extract values from `e.currentTarget`, not controlled state (unless the form needs it).
- **`defaultValues` as props.** Server component passes initial data; client component doesn't fetch.
- **Sonner for feedback.** `toast.success()` and `toast.error()` — no custom toast components.
- **Pending state on buttons.** `disabled={isPending}` and label change during submission.

## Database Patterns

### Schema (`lib/db/schema.ts`)

- All tables use `pgTable()` from `drizzle-orm/pg-core`
- Primary keys are `text` type with `createId()` from `@paralleldrive/cuid2` as `$defaultFn`
- Timestamps: `timestamp().defaultNow().notNull()`
- Foreign keys: explicit `.references()` with `onDelete` behavior (`cascade` or `set null`)
- Relations defined separately using `relations()` from `drizzle-orm`
- Organized by section: Enums → Auth Tables → Application Tables → Relations

### Queries (`lib/db/queries.ts`)

- Pure async functions using `db.query` (relational API) with `findFirst` / `findMany`
- Named `getXByY` pattern (e.g., `getUserById`, `getOrgBySlug`)
- No raw SQL unless absolutely necessary

### Connection (`lib/db/index.ts`)

- Single `db` export, single connection setup
- Pass `schema` to drizzle for relational queries

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| Files | kebab-case | `settings-form.tsx`, `auth-helpers.ts` |
| Components | PascalCase exports | `SettingsForm`, `AppSidebar` |
| Server actions | camelCase | `updateUserSettings` |
| DB tables | camelCase variable | `organizations`, `userRole` |
| Hooks | `use-` file prefix, `use` function prefix | `use-mobile.ts`, `useIsMobile()` |
| Types | PascalCase | `AIResponse`, `SettingsInput` |
| Zod schemas | camelCase with `Schema` suffix | `settingsSchema` |
| Route groups | Parenthetical | `(app)`, `(auth)` |
| Path aliases | `@/` prefix | `@/lib/utils` |

## Import Order

Always in this order, separated by blank lines:

1. React / Next.js built-ins (`react`, `next/navigation`, `next/cache`)
2. Third-party libraries (`drizzle-orm`, `zod`, `sonner`)
3. Internal lib (`@/lib/...`)
4. Internal components (`@/components/...`)
5. Types (`@/types`)

## Anti-Patterns (Hard Stops)

Do not produce any of the following:

- **Client-side data fetching** — no `useEffect` + `fetch` for data that can be fetched in a server component
- **Auth checks in individual pages** — the `(app)/layout.tsx` handles this once
- **`db` imported in client components** — database access is server-only, always
- **Custom components in `ui/`** — that directory is for shadcn primitives only
- **Server actions without auth** — every action starts with `requireUser()` or `requireOrg()`
- **Controlled form state for simple forms** — use native FormData unless the form genuinely needs controlled inputs
- **API routes for mutations** — use server actions. API routes are for webhooks, file uploads, streaming, and third-party integrations.
- **Nested feature directories** — keep routes flat unless the URL hierarchy demands nesting
- **Fetching data in client components** — server component fetches, passes as props
- **Skipping loading.tsx** — every route under `(app)` should have a loading state with Skeleton components
- **Hardcoded color classes** — use shadcn CSS variable classes (`bg-background`, `text-foreground`), never `bg-gray-*` or `bg-white`

## Self-Review (Run Before Finalizing)

Score 1–5 on each. Revise until all are 4+.

| Criterion | Question |
|---|---|
| Boundary | Is every file on the correct side of the server/client boundary? |
| Data flow | Does data flow down as props and mutations flow up as actions? |
| Auth | Is auth checked once in layout, and again in every server action? |
| Structure | Does the file tree follow the canonical layout? |
| Naming | Do all files, functions, and types follow the naming conventions? |
| Loading | Does every route have a loading.tsx with skeletons? |
