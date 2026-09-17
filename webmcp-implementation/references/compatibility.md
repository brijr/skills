# API and consumer compatibility

Research snapshot: **September 17, 2026**. Recheck before implementation. Source documentation is not evidence that a specific deployed browser passes a test.

## Verified snapshot

| Area | Research finding | Source |
| --- | --- | --- |
| Standardization | The September 17 draft is a Community Group report, not a W3C Standard. | [Specification][spec] |
| Chrome activation | Chrome documents an origin trial from Chrome 149 and local activation through `chrome://flags/#enable-webmcp-testing`. Do not infer universal default availability. | [Getting started][chrome] |
| Current imperative API | Documentation updated September 11 uses `document.modelContext`; registration is asynchronous and a registration `AbortSignal` supplies cleanup. | [Imperative API][imperative] |
| Discovery/calls | The current API describes `getTools()` and `executeTool(tool, inputObject, options)`. Verify the installed browser's argument/result representation; Chrome's documentation flags a string-input transition at Chrome 155. | [Imperative API][imperative] |
| Execution lifetime | Chrome documents that, from 153, unregistering does not cancel in-flight execution. Execution cancellation has its own signal. | [Imperative API][imperative] |
| HTML forms | Chrome documents `toolname`, `tooldescription`, optional `toolparamdescription`, and `toolautosubmit`. | [Declarative API][declarative] |
| ChatGPT consumer | The built-in browser documents top-level JavaScript tools. Declarative form tools and iframe tools are currently unsupported there. | [OpenAI site tools][openai] |
| Isolation | Chrome documents origin isolation and the `tools` Permissions Policy. Origin isolation is not the same as COOP/COEP cross-origin isolation. Do not indiscriminately add unrelated headers. | [Getting started][chrome] |

## Recommended selection policy

For a new integration, start with native imperative tools in the top-level document. Implement only the chosen runtime subset; keep compatibility logic localized. Do not promise support in every browser, agent, plan, or surface. An agent having “browser access” does not establish WebMCP support.

WebMCP adds tools to a live website. It is distinct from a conventional MCP server/transport and does not automatically make that site a remotely callable MCP endpoint. A tab-independent integration is a separate architectural task. [Comparison][compare]

Older code mentioning `navigator.modelContext`, `provideContext`, `clearContext`, `unregisterTool`, or `modelContextTesting` needs an explicit migration decision, not blind copying. Check actual runtime behavior before retaining a legacy branch. In particular, do not automatically try both registries and register the same tool twice.

Do not depend on `requestUserInteraction()` without verifying it: Chrome's September 1 security page mentions it, while the September 17 draft's callback options do not contain that method. Prefer the application's existing review/confirmation workflow. This is a documented source mismatch, not proof that every historical runtime lacks the method. [Security][security] [Specification][spec]

Likewise, declarative event-target descriptions may lag the current draft. Verify the exact event target and submission contract in the browser used for tests rather than mixing examples across dates.

## Environment record

Fill in these fields in the implementation document:

```text
Research checked on:
App commit / environment:
Browser name, full version, and channel:
Agent/consumer and surface:
Secure context:
Top-level document or frame:
Activation mechanism (flag / trial / built-in / other):
Observed API entrypoint and methods:
Registration cleanup behavior tested:
Discovery / execution argument and result representation:
Declarative support needed and observed:
Wrappers, types, polyfills, and their exact versions:
Native evidence:
Consumer evidence:
Unsupported environments / known limitations:
```

Use the bundled probe as an initial diagnostic. It does not certify native implementation, flags, origin-trial enrollment, cleanup semantics, or agent discovery. Never use it as a support guarantee.

## Primary sources

[spec]: https://webmachinelearning.github.io/webmcp/
[chrome]: https://developer.chrome.com/docs/ai/webmcp
[imperative]: https://developer.chrome.com/docs/ai/webmcp/imperative-api
[declarative]: https://developer.chrome.com/docs/ai/webmcp/declarative-api
[security]: https://developer.chrome.com/docs/ai/webmcp/secure-tools
[openai]: https://learn.chatgpt.com/docs/webmcp
[compare]: https://developer.chrome.com/docs/ai/webmcp/compare-mcp

All sources were accessed September 17, 2026. Follow the links again rather than assuming this snapshot is current at the next invocation.
