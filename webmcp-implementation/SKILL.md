---
name: webmcp-implementation
description: Research, implement, test, and document WebMCP in an existing web application. Use when asked to add WebMCP, expose website features as browser-agent tools, make an app agent-ready, or migrate an older modelContext integration. Inspect the repository, reuse existing actions and permissions, add native browser registration with safe lifecycle handling, and verify real workflows. Not for building a conventional remote MCP server, adding a chatbot, or generic browser automation alone.
metadata:
  version: "1.0.0"
  researched-on: "2026-09-17"
---

# WebMCP implementation

## Goal

Give an existing web app a small, coherent agent-facing interface to its real capabilities. Agents should be able to discover useful actions, provide validated inputs, and receive verifiable results while people retain the same UI, permissions, and control. Implement the integration, not just a proposal, unless the user requests research or planning only.

Work with the application's architecture. Do not build a second application or duplicate its business logic.

## Read selectively

Read [compatibility](references/compatibility.md) before selecting APIs. Read [implementation](references/implementation.md) when designing the adapter and tool contracts, then [verification](references/verification.md) before testing. Use [the planning template](assets/webmcp-plan.template.md) for the implementation record. The optional [browser probe](scripts/probe-webmcp.js) inspects capabilities without invoking or registering tools.

These references contain a dated research snapshot and recommended engineering policy. They are not a substitute for checking the target runtime.

## 1. Inspect the repository and establish scope

Read applicable `AGENTS.md`, project instructions, dependency manifests, routes, authentication, state management, validation, domain services, and test configuration. Respect the existing package manager and UI/design system. Inspect the working tree and preserve unrelated changes.

Identify the real human workflows and trace their implementation end to end. Note the browser/client boundary and where authorization is enforced. For a monorepo, work in the relevant web application; do not add a repo-wide framework merely to expose one app.

Record baseline checks and existing failures. Infer routine choices from the codebase. Ask only about a genuinely blocking product decision; otherwise proceed with a narrow, reversible implementation and state assumptions.

Do not interpret “agent-ready” as permission to expose every internal function, add a chatbot, install an MCP server, or redesign the interface.

## 2. Verify the API and the intended consumer

Recheck primary sources linked in `references/compatibility.md`, including the current specification, browser documentation, and the intended agent's documentation. Record the access date, browser/version/channel, activation requirements, and API subset you will actually test.

The researched baseline is `document.modelContext`, asynchronous `registerTool`, and registration cleanup through an `AbortSignal`. Do not silently substitute older `navigator.modelContext` examples. Never mix API generations. Reverify any legacy compatibility path before adding it.

Separate three questions: can the page register tools, can the intended agent discover them, and can that agent execute them correctly? A TypeScript declaration, mock, package installation, or present property does not prove all three.

Default to a native, top-level imperative integration. Add declarative HTML tools only when they suit an existing form and the intended consumer supports them. Do not expose the same operation through competing registrations. Inspect any existing wrapper before replacing it; do not add a dependency simply because its package name contains “WebMCP.”

Without web access, continue with code inspection, a separable adapter, and local tests using the dated snapshot. Mark current support as unverified. Without a native browser or compatible agent, do not claim native or agent-level verification.

## 3. Design a small tool surface

Propose and then implement the smallest useful slice, normally three to five tools. This is a starting heuristic, not a protocol limit. Prefer one complete workflow over many superficial wrappers; add fewer tools when the app warrants it.

Use the planning template to record each tool's purpose, registration scope, existing action/service, validated input, result, authorization, side effects, confirmation rule, and tests. Explicitly list deferred high-risk operations.

Expose intent-level operations such as `search_assets`, `get_asset_details`, or `prepare_collection`, only where the application already supports them. Avoid generic `click_button`, `run_javascript`, `call_any_endpoint`, arbitrary SQL, and catch-all tools with loosely typed action switches.

Give tools non-overlapping names and concise descriptions. Distinguish preparation from execution: opening an editor is not saving, preparing a message is not sending, and selecting a file is not uploading it. Make prerequisites and observable effects clear.

Prefer read-only discovery and reversible preparation first. Do not invent unsupported product functionality to reach a tool count. Stop at a safe draft/review boundary when a consequential action lacks adequate safeguards.

## 4. Reuse domain logic and preserve security boundaries

Wire each tool into the same validated application operation as the UI. Where handlers mix UI and domain logic, extract the smallest shared operation and test both callers. Do not emulate clicks when a shared action is available.

Treat inputs as untrusted. Reuse the project's runtime validator; constrain lengths, enums, identifiers, pagination, and allowed fields. A published JSON Schema is documentation, not authorization or a complete runtime validator.

Derive the active identity and workspace from trusted session/application state. Recheck server authorization and resource ownership on every request. Agent-supplied IDs never establish access. Preserve CSRF protections, rate limits, resource constraints, and normal error handling. Never ship server credentials or accept tokens/passwords as convenience tool parameters.

For destructive, financial, externally visible, or permission-changing operations, preserve an explicit human review/confirmation path bound to the exact operation and current data. An agent-controlled `confirmed: true` is not approval. An annotation is not an authorization check. Prefer a preparation tool followed by the app's existing human commit flow when a safe commit tool cannot be implemented.

Use the current annotation fields accurately where supported. Keep tool metadata developer-owned; treat returned user content as data, not instructions. Return only the fields needed for the workflow. Avoid bulk private-data extraction, raw session state, secrets, unrestricted URLs, and production logging of full arguments/results.

Keep cross-origin exposure off by default. Do not broaden iframe delegation or origin allowlists merely to make a demo pass.

## 5. Add a thin, lifecycle-safe browser integration

Keep browser-specific registration behind a small module following the repo's conventions. Keep tool definitions and shared operations independently testable. Prefer direct native calls over a large abstraction framework.

Guard browser access during SSR and detect required methods at runtime. With the feature disabled or unavailable, registration should do nothing and the human UI must remain fully usable. Do not install a global shim or silently advertise simulated support as native support. Handle registration failures through redacted development diagnostics rather than breaking the app.

Give each tool a clear registration owner. Register only while its route/session/workspace prerequisites are satisfied. Use stable definitions where practical; do not rebuild the registry for every keystroke. Do not delete another owner's tools to resolve a name collision. Detect duplicate registration as a bug.

Use the verified cleanup mechanism. Account for route transitions, logout, workspace changes, overlapping component mounts, hot reload, and unmount-before-registration-settles. Keep current state available to handlers without stale closures.

Track registration lifetime separately from in-flight execution lifetime. Explicitly cancel or suppress stale work when session or scope changes require it; do not assume unregistering rolls back or cancels a started operation. Reject calls that begin after their scope becomes invalid, and prevent old results from updating a new workspace.

For React/Next.js, follow `references/implementation.md`: use a narrow client boundary and effect cleanup without converting the whole app to client rendering. Preserve hook dependency correctness and verify Strict Mode behavior.

## 6. Make execution outcomes reliable

Await the existing operation and necessary UI synchronization. Return success only when the claimed postcondition is true. For background jobs, return an explicit accepted/pending state and a job identifier rather than claiming completion.

Use small JSON-serializable results with stable identifiers, useful status, and enough evidence to inspect the outcome. The example application result envelope in the implementation reference is optional; it is not a WebMCP requirement. Follow the verified consumer's result contract and avoid double-stringifying unless that contract requires it.

Provide actionable, redacted errors. Distinguish invalid input, authentication, authorization, not found, conflict, rate limit, cancellation, and unavailable service using existing application conventions. Never invent a successful fallback after a failed mutation.

Forward execution cancellation where supported. A timeout or abort after a request was sent does not prove that a write failed. Before retrying non-idempotent work, reconcile its outcome; use the application's server-enforced idempotency mechanism when needed. Do not implement write retries based only on agent assurances.

Keep the UI consistent with tool results, including loading, empty, error, and review states. Show meaningful feedback using existing components, not a separate agent-only interface.

## 7. Verify in layers

Run baseline and new checks using the repository's tools. Consult `references/verification.md` for the test matrix.

At minimum test the shared action/validation, registration and cleanup, unsupported-browser fallback, permission/tenant boundaries, and one complete useful workflow. Add cancellation, duplicate/retry, and confirmation tests wherever the chosen tools make them relevant.

Mocks verify adapter behavior, not browser compatibility. Test native registration/discovery/execution in the recorded browser when available. Then verify a natural-language workflow with the intended consumer when available. A tool visible in an inspector is not proof that a consumer selected or executed it correctly.

Test with WebMCP absent or disabled and confirm ordinary workflows still work. Exercise route changes, logout/login, and workspace switching. Assert actual state and side effects, not merely that a callback ran.

Report each layer as passed, failed, skipped, or unavailable, with commands or reproduction steps. Never manufacture a native pass, an agent pass, or a clean baseline. Repair failures introduced by the change; distinguish existing failures from new ones.

## 8. Document and hand off

Produce working code, tests, and a short implementation record in the project's existing documentation location, or `docs/webmcp.md` when there is no better convention. Include the tool inventory, supported runtime/consumer, source dates, activation setup, security decisions, verification evidence, known gaps, and feature-disable/rollback path.

Leave a concise final report: what changed; tools and workflows implemented; confirmation/permission boundaries; checks run and their results; native/consumer verification status; and any remaining limitations. Do not deploy, connect production services, or perform real user mutations merely to demonstrate success without authorization.

## Completion criteria

The selected workflows use real existing operations; their contracts and permissions are tested; registrations have owners and cleanup; unsupported browsers retain the human UI; outcomes are truthful and observable; and support/testing claims match evidence. A list of registered demo tools, a mock-only screenshot, or an implementation plan alone is not completion of an implementation request.
