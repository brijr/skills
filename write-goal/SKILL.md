---
name: write-goal
description: Turn a rough objective into a strong, evidence-backed goal for an AI coding agent, using lightweight codebase exploration when the objective depends on repository context. Use when the user writes `/write-goal`, asks to draft or tighten an agent goal, says "turn this into a goal" or "turn this into a /goal", or wants help making an objective measurable, repo-aware, and bounded. Produce a Codex `/goal` command only when the target agent supports it or the user asks for it; otherwise produce a portable agent goal block. Do not activate, pause, resume, clear, or complete goals unless the user explicitly asks for lifecycle management; this skill writes goal text for the user to review.
---

# write-goal — draft strong agent goals

Produce ready-to-use goal text from the user's rough objective. The output should make "done" auditable without over-prescribing the path. For codebase work, ground the goal in the actual repo before drafting.

## Workflow

1. Identify the target agent surface.
   - If the user names Codex, asks for `/goal`, or clearly wants Codex Goals, output a `/goal ...` command.
   - If the user names Claude, Cursor, Devin, ChatGPT, another coding agent, or does not name a native goal command, output a portable `Goal:` block.
   - Do not invent lifecycle commands for agents that may not support them. Preserve lifecycle language as instructions inside the goal text instead.

2. Decide if a long-running goal is appropriate.
   - Use a goal for work with a durable objective, uncertain path, and evidence-based finish line.
   - Prefer a normal prompt for one-line edits, simple explanations, short reviews, or tasks with no meaningful continuation loop.
   - If the user explicitly asks for `/write-goal`, still help, but say briefly if a normal prompt would fit better.

3. Gather context when the goal depends on a codebase.
   - Do a lightweight, read-only repo pass before drafting: inspect the current directory, `git status --short`, top-level docs, manifests, scripts, test commands, and likely files/modules named by the objective.
   - Use fast search first (`rg`, `rg --files`) to find relevant routes, tests, packages, benchmarks, or docs.
   - Do not edit files or run expensive/destructive commands while writing the goal.
   - If the user provides concrete repo context, treat that as checked context and say it was user-provided.
   - If repo context is unavailable and the user did not provide enough detail, state the assumption and draft the goal with placeholders only where necessary.

4. Extract or infer the six goal fields.
   - **Outcome**: what should be true when work is done.
   - **Verification surface**: tests, benchmark, report, artifact, command output, reproduction, source evidence, browser-visible state, or repo-specific command that proves it.
   - **Constraints**: behavior, APIs, tests, UX, performance, docs, data, or safety boundaries that must not regress.
   - **Boundaries**: allowed repos, files, modules, tools, services, data, time, budget, or destructive-operation limits.
   - **Iteration policy**: how the agent should pick the next useful action after each attempt.
   - **Blocked stop condition**: when the agent should stop and report evidence, blockers, and what would unlock progress.

5. Ask only for missing information that blocks an auditable goal.
   - Ask at most two questions.
   - Ask when the missing answer changes whether a goal can be written at all: the target agent surface, the actual object of work, the required outcome, a mandatory boundary, or the only credible verification surface.
   - Do not ask just to make a decent goal more precise. If a conservative assumption would produce a useful, auditable goal, write the goal and put the assumption under `Assumptions:`.
   - For repo-wide audit, coverage, cleanup, or test goals, do not ask which files or items are in scope when the user named a repo, directory, glob, or category. Assume the named scope means every relevant item inside it, and record that assumption.
   - If unsure about exact verification but a likely verification surface exists, name it and mark it as an assumption.

6. Write one compact goal.
   - Keep it specific enough to check and broad enough for the agent to choose the next action.
   - For codebase goals, prefer real repo nouns over generic ones: command names, test files, benchmark scripts, packages, routes, services, or modules discovered in the context pass.
   - Include the blocked stop condition for ambiguous, research, flaky, or infrastructure work.
   - For native goal systems, use their syntax. For generic agents, write a portable prompt block.

## Output Format

For Codex or another native goal-command surface:

```text
Use this with the native goal command:

/goal <desired end state>, verified by <specific evidence>, while preserving <constraints>. Use <boundaries>. Between iterations, <iteration policy>. If blocked or no valid path remains, stop with <evidence gathered, attempted paths, blocker, and next input needed>.
```

For a portable agent goal:

```text
Use this as the agent goal:

Goal:
<Desired end state>, verified by <specific evidence>, while preserving <constraints>.

Operating contract:
- Use <boundaries>.
- Between iterations, <iteration policy>.
- If blocked or no valid path remains, stop with <evidence gathered, attempted paths, blocker, and next input needed>.
```

Then add `Assumptions:` only if you inferred important details.

For every codebase goal, add `Context checked:`. Keep it to one short line:
- `Context checked: local repo pass ...` when you inspected files or commands.
- `Context checked: user-provided ...` when the prompt supplied enough concrete repo details.
- `Context checked: unavailable ...` when neither local repo context nor concrete user-provided context is available.

If critical information is missing:

```text
I can write this, but one thing decides whether the goal is auditable: <question>
```

Use this only when no conservative assumption would produce a defensible goal. Ask the question and stop; do not draft a placeholder goal after it. Otherwise, draft the goal and list the assumption.

If a goal is the wrong tool:

```text
This is probably better as a normal prompt because <reason>. If you still want it as a goal:

<goal text>
```

Use the wrong-tool format only when enough concrete information exists to draft a usable goal. If the object of work, desired outcome, or verification surface is missing, use the clarification form instead.

## Quality Checks

Before answering, make sure the drafted goal:

- Names a concrete end state, not just "improve", "clean up", or "investigate".
- Has a verification surface the target agent can inspect.
- Uses repo-specific evidence for codebase tasks whenever local context is available.
- Includes `Context checked:` for codebase goals, even when the context came from the user rather than a live repo pass.
- Preserves at least one relevant constraint.
- Gives the agent room to iterate without asking the user to say "keep going".
- Defines what to report if blocked instead of treating uncertainty as success.
- Asks for clarification only when the missing answer blocks any auditable goal.
- Uses native lifecycle syntax only when the target agent supports it.
- Avoids calling lifecycle tools or marking a goal complete from this skill.

## Patterns

Weak:

```text
Improve performance
```

Codex:

```text
/goal Reduce p95 checkout latency below 120 ms, verified by the checkout benchmark, while keeping the correctness suite green. Use the checkout service, benchmark fixtures, and related tests. Between iterations, record what changed, what the benchmark showed, and the next best experiment. If the benchmark cannot run or no valid path remains, stop with the attempted paths, evidence gathered, blocker, and next input needed.
```

Portable:

```text
Goal:
Reduce p95 checkout latency below 120 ms, verified by the checkout benchmark, while keeping the correctness suite green.

Operating contract:
- Use the checkout service, benchmark fixtures, and related tests.
- Between iterations, record what changed, what the benchmark showed, and the next best experiment.
- If the benchmark cannot run or no valid path remains, stop with the attempted paths, evidence gathered, blocker, and next input needed.
```

Weak:

```text
Fix the flaky checkout test
```

Strong:

```text
Goal:
Make the flaky checkout test pass reliably on the current branch, verified by reproducing the failure or identifying why it cannot be reproduced, applying a focused fix, and rerunning the relevant test command enough times to support the result. Preserve public API behavior and existing coverage.

Operating contract:
- Follow the strongest evidence from failure output, logs, and recent diffs between iterations.
- If the failure cannot be reproduced or no defensible fix remains, stop with the commands run, evidence gathered, suspected cause, and next input needed.
```

Weak:

```text
Research this paper
```

Strong:

```text
Goal:
Produce an evidence-backed audit of the paper's main claims using the available materials and local resources. Attempt feasible reproductions, verify outputs where possible, and end with a report separating confirmed findings, approximate reconstructions, blocked claims, and remaining uncertainty.

Operating contract:
- Between iterations, prioritize claims with the strongest available evidence and lowest reproduction cost.
- If exact reproduction is blocked, stop with the missing materials, attempted paths, proxy evidence, and what would unlock stronger verification.
```
