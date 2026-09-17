# Implementation patterns and review policy

These are recommended engineering choices for this skill, not additional protocol requirements. Match the repository rather than copying a prescribed directory layout.

## Shared operations, separate callers

```text
Human interface ───────┐
                       ├── existing validated action ── authorized backend
Browser-agent tool ────┘
```

The tool adapter owns transport/schema translation, registration, and result presentation. The existing action owns business rules. The backend owns authoritative access checks and persistence. Where the app is entirely local, identify and document the actual local trust boundary instead of inventing a backend.

A suggested organization, only when it fits the app:

```text
features/<feature>/actions.*       shared operations / existing services
features/<feature>/webmcp.*        tool definitions for that feature
lib/webmcp/*                       small browser adapter and local types
components/webmcp-provider.*       optional single registration owner
```

Do not create every layer for a two-tool application. A local feature module may suffice. Avoid importing server-only database clients into a browser entrypoint.

This separation applies the existing-logic guidance in [OpenAI site tools][openai]. The detailed organization above is this skill's recommendation.

## Tool contracts

Prefer a verb and domain noun. Define a single observable result. Capture the current session/workspace through the app, not through a user-supplied role or tenant claim.

Use the project's schema system and make the declared schema match runtime validation. Require genuinely necessary fields, bound strings and pages, and handle omitted optional values. Give timestamps explicit time zones when material. Reject unknown fields where appropriate. Avoid forcing an agent to infer internal IDs without a corresponding safe lookup.

Prefer explicit state setters to ambiguous toggles for repeatable actions. Apply read/write/retry labels honestly. A tool that changes selection or navigation is not strictly side-effect-free merely because it does not write to a database.

Use compact results. The following is an **optional application convention**, not a mandated WebMCP result schema:

```ts
type ActionResult<T> =
  | { ok: true; status: "completed"; data: T }
  | { ok: true; status: "pending"; operationId: string }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        retryable: boolean;
      };
    };
```

For pending review, specify that no commit has occurred. For an uncertain network outcome after a write, do not use a generic retryable error until reconciliation establishes safety. Preserve errors from existing domain operations, redacting sensitive details.

Use `readOnlyHint`, `consequentialHint`, and `untrustedContentHint` where the verified runtime supports them. Hints describe behavior; they do not replace enforcement. Avoid importing conventional MCP-only annotation fields merely because a shared SDK happens to accept them. [Imperative API][imperative] [Tool security][security]

## Human control and sensitive actions

For a risky operation, prefer “prepare for review” unless the existing product already has a safe confirmation mechanism. Bind the human's review to the exact target, payload, revision, and operation. Recheck access and stale data before committing. A generic modal acknowledgement is not sufficient if the payload can change afterward.

An agent-controlled boolean, text assertion, or tool description must not approve a sensitive action. Do not treat events or markup as a security boundary. Preserve existing server protections. Leave high-risk commit operations unavailable when the application cannot enforce their requirements.

Reads can disclose private information. Return narrow summaries instead of complete records by default; expose detail only within normal permissions and the actual task. Avoid full arguments/results in analytics and logs. Use the repository's approved observability path with tool name, duration, outcome category, and a non-sensitive correlation ID.

Do not fetch arbitrary agent-supplied URLs with privileged server credentials. Use existing allowlists and fetch policies. Keep cross-origin exposure disabled unless the product requirement explicitly needs it and both sides are reviewed.

## React and Next.js

Use a small client integration. The `'use client'` boundary makes browser interactions possible, but does not justify touching browser globals at module initialization. Keep accesses inside a guarded client lifecycle. Do not force unrelated server-rendered components into the client bundle. [Next.js client boundary][next]

Register in an effect with a fresh registration `AbortController`, handle synchronous and asynchronous failures, and abort during cleanup. Keep each tool's owner unambiguous. React Strict Mode intentionally exercises setup/cleanup; test it instead of disabling it. [React effects][react]

Keep tools stable when their semantics are stable. Use current committed state through the repository's established state/service pattern; do not fix stale closures by suppressing dependency lint rules. A scope change needs explicit handling even when the registration remains mounted.

Registration abort and execution abort are distinct. Track active executions when logout, route changes, or workspace changes must cancel them. Before applying an async result, verify that its scope still matches. Backend access checks remain mandatory even after cancellation.

Do not swallow genuine registration collisions just because an effect was cleaned up. If async teardown and re-registration can race in the chosen runtime, coordinate through the owner/adapter and test the race. Avoid global “clear all tools” behavior.

## Declarative branch

Only add form annotations to a real human-usable form. Retain labels, `name` attributes, browser validation, keyboard behavior, and the original submit path. Avoid automatic submission for consequential actions; verify the intended consumer supports this API first.

Chrome documents `SubmitEvent.agentInvoked` and `respondWith(Promise<any>)` after `preventDefault()` for handled submissions. Match the browser's contract; do not assume a React synthetic event exposes new native properties directly. [Declarative API][declarative]

With controlled inputs, test that browser-populated values enter application state and that submission happens exactly once. With async submission, give the browser the actual result promise rather than returning before the operation completes. Do not combine an imperative tool and an annotated form that both execute the same submission.

## Baseline design guidance

Chrome recommends focused tool purposes, deliberate registration scope, descriptive contracts, validation in code, and UI updates that reflect completed work. Use these as a review lens rather than auto-generating a tool for every UI control. [Best practices][best]

[openai]: https://learn.chatgpt.com/docs/webmcp
[imperative]: https://developer.chrome.com/docs/ai/webmcp/imperative-api
[security]: https://developer.chrome.com/docs/ai/webmcp/secure-tools
[declarative]: https://developer.chrome.com/docs/ai/webmcp/declarative-api
[best]: https://developer.chrome.com/docs/ai/webmcp/best-practices
[next]: https://nextjs.org/docs/app/api-reference/directives/use-client
[react]: https://react.dev/reference/react/useEffect
