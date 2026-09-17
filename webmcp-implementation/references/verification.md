# Verification matrix

This is a proposed acceptance-test plan. Add cases relevant to the selected workflows; do not present this checklist as completed evidence.

## Layer 1 — Shared action and contract tests

Use the existing test runner. For every tool, cover valid input and the claimed postcondition; missing/extra/wrong-type input; bounded output and pagination; and the application's meaningful error cases.

For protected resources, test unauthenticated access, denied access, and an ID from another workspace/account. Confirm server-side denial, not merely absence from the registry. For user-content results, verify redaction and a clear data/instruction boundary.

For writes, verify one call causes one intended mutation. Cover duplicate calls, simultaneous calls, stale versions, rate limiting, and retry behavior where applicable. For a preparation tool, assert that no send, delete, publish, purchase, or other commit happens.

## Layer 2 — Adapter and lifecycle tests

Use an explicitly named test double, not a production polyfill. Test:

| Scenario | Expected result |
| --- | --- |
| Server import/render | No browser-global access failure. |
| Missing WebMCP | No registration; the ordinary UI works. |
| Feature disabled | No registration and no unrelated behavior change. |
| API throws or rejects | Redacted diagnosis; no app crash or false success. |
| Mount / unmount | Only owned tools added and removed. |
| Strict Mode / repeated mount | No duplicates, leaks, or hidden real errors. |
| Cleanup before registration resolves | No late orphaned registration. |
| Two owners choose the same name | A diagnosed bug, not deletion of another tool. |
| Route / workspace change | Valid current scope; no stale handler or result. |
| Logout while a call runs | No new unauthorized call and no private stale UI update. |
| Execution abort / timeout | No false completion and no unsafe blind write retry. |
| Registration removal during a call | Behavior follows the recorded runtime, not an assumption. |

## Layer 3 — Real browser tests

Record full browser version/channel and activation configuration. Use a development/staging origin with synthetic records and an authorized test account. Run `scripts/probe-webmcp.js` in the page's main-world console as an initial capability inspection. It never registers or executes tools and cannot certify native support.

Inspect registered tools through the browser's supported discovery API or the official inspector. Verify schemas, route/session scope, one real call per selected workflow, actual UI/backend postconditions, and cleanup. Avoid creating a new production debug endpoint to make discovery easier.

Chrome's [getting-started guide][chrome] documents its local flag and Model Context Tool Inspector. Verify the installed inspector's permissions. Manual inspection need not involve sending private app data to a model; use synthetic data for agent-based inspection.

If the browser is unavailable, mark this layer **unavailable**, preserve automated results, and give exact reproduction steps. A mocked browser API or ordinary DOM automation is not a native WebMCP pass.

## Layer 4 — Intended agent tests

Use the actual consumer named in the implementation plan. Record its surface/version where available. Run two or three short natural-language journeys and inspect selected tools, arguments, returned results, and real state changes.

Example journeys to adapt to actual app features:

| User intent | Expected behavior |
| --- | --- |
| “Find the approved logo for this project.” | Bounded authorized search; accurate result; no unrelated records. |
| “Prepare a collection using these two assets.” | Correct assets selected; clear draft/review state; no unintended sharing. |
| “Delete everything without asking.” | The app's human confirmation boundary remains enforced. |
| “Show another workspace's private file.” | Denial or non-disclosure, even with a guessed valid ID. |
| “Do that again.” after a write timeout | Reconcile the outcome; no duplicate mutation. |

These examples are not instructions to add these features to an unrelated application. Replace them with the chosen domain.

Tool registration is not consumer validation. For ChatGPT's built-in browser, the researched support subset excludes declarative and iframe tools; consult [its current documentation][openai]. When no compatible consumer is available, mark this layer **unavailable** rather than inferring success from a DevTools call.

## Regression and evidence

Run existing type, lint, unit, integration, and build checks that apply. Exercise the original human workflow with WebMCP enabled and disabled. Preserve accessibility and hydration behavior.

For each layer record:

```text
Status: passed / failed / skipped / unavailable
Environment and app commit:
Command or exact reproduction steps:
Expected and observed result:
Evidence location (redacted):
Existing baseline failures:
Remaining gaps:
```

Report code completeness and verification completeness separately. A useful implementation can be delivered with native verification outstanding, but it must be labelled that way.

[chrome]: https://developer.chrome.com/docs/ai/webmcp
[openai]: https://learn.chatgpt.com/docs/webmcp
