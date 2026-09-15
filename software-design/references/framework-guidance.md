## React Guidance

Apply when the inspected repo uses React.

- Build data-to-pixels vertical slices; do not build isolated component trees first.
- Keep state in the lowest component that needs it.
- Prefer props over context for local data; context is for truly shared, rarely-changing values.
- Extract components or hooks only when the knowledge changes for the same reason in multiple real places.
- Keep prop interfaces small and named around product/domain concepts.
- Handle loading, empty, error, success, disabled, and permission states that the feature actually needs.
- Avoid premature `useMemo`, `useCallback`, `React.memo`, render props, slot props, and variant systems.

## Next.js App Router Guidance

Apply when the inspected repo is a Next.js App Router project.

- Default to server components. Add `"use client"` only for hooks, event handlers, browser APIs, or interactive state.
- Server components fetch data and pass props down.
- Client components render props and call server actions for mutations.
- Server actions start with auth, then validate with Zod, mutate, and revalidate the affected path/tag.
- Do not import DB, server auth helpers, storage clients, or server actions into client-only code except action imports used for mutation calls.
- Use API routes for webhooks, uploads, streaming, and third-party callbacks; prefer server actions for app mutations.
- Put custom components outside `components/ui`; that directory is for primitives.
- Follow existing route groups, loading/error files, naming, and import order.
