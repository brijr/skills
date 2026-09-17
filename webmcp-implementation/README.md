# WebMCP implementation skill

A reusable coding-agent skill for adding WebMCP to an existing app. It combines repository inspection, current API verification, a small tool inventory, implementation guidance, safety boundaries, and layered testing.

**Research date: September 17, 2026.** This package is an implementation workflow, not an installed WebMCP integration or a runtime library. No target application has been modified or browser-tested as part of packaging the skill.

## Files

```text
webmcp-implementation/
├── SKILL.md                          Main agent instructions
├── README.md                         Installation and use
├── agents/openai.yaml                Optional Codex presentation metadata
├── references/
│   ├── compatibility.md              Dated APIs, consumer support, primary sources
│   ├── implementation.md             Architecture, safety, React/Next.js, forms
│   └── verification.md               Contract, lifecycle, browser, agent checks
├── assets/webmcp-plan.template.md     Implementation/evidence record
├── scripts/probe-webmcp.js            Read-only browser capability diagnostic
├── scripts/probe-webmcp.test.cjs      Diagnostic tests (synthetic environments)
└── PACKAGE-CHECKS.md                  What was and was not verified
```

## Install locally for Codex

Extract the complete `webmcp-implementation` folder into either:

```text
<repo>/.agents/skills/webmcp-implementation/
```

or, for use across repositories:

```text
~/.agents/skills/webmcp-implementation/
```

Keep the supporting folders next to `SKILL.md`. Avoid installing duplicate copies with the same skill name. Codex documents these local skill locations in [Build skills](https://learn.chatgpt.com/docs/build-skills). It detects skill changes automatically; restart it if the skill does not appear.

Other coding agents can use the [Agent Skills format](https://agentskills.io/specification), but their discovery directories and invocation syntax differ. Follow the installed agent's instructions rather than assuming the Codex path is universal. Alternatively, point the agent directly at `webmcp-implementation/SKILL.md` and ask it to follow the file and its references.

## Invoke

In Codex:

```text
$webmcp-implementation

Implement WebMCP in this application. Start by inspecting the codebase and
verifying the current API and intended browser/agent support. Choose three
to five high-value tools around real existing workflows, or fewer if that
is the better slice. Reuse existing actions, validation, and permissions.
Preserve the UI and human confirmations. Implement, test, and document it;
do not stop at a plan. Report native and consumer verification separately.
```

For another agent, replace the first line with:

```text
Read webmcp-implementation/SKILL.md and use that skill for this task.
```

## Important defaults

Use native, top-level imperative tools; add a declarative branch only when appropriate and supported. Keep the browser integration thin, begin with read-only or reversible workflows, and preserve the existing human interface. Do not add a chatbot, backend MCP server, or polyfill by default.

The current snapshot deliberately uses `document.modelContext` rather than early `navigator.modelContext` examples. ChatGPT's built-in browser currently documents an imperative-only, top-level subset. Reverify the linked [Chrome API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) and [OpenAI consumer documentation](https://learn.chatgpt.com/docs/webmcp) before implementation.

## Validation of this package

See `PACKAGE-CHECKS.md` for packaging and diagnostic-script checks. These are not tests of WebMCP in your application, native-browser conformance, or consumer compatibility.
