---
name: write-goal
description: Turn a rough objective into a strong Codex `/goal` command. Use when the user writes `/write-goal`, asks to draft or tighten a Goal, says "turn this into a /goal", or wants help making a Codex Goal measurable, evidence-backed, and bounded. Do not use to activate, pause, resume, clear, or complete a Goal unless the user explicitly asks for lifecycle management; this skill writes the command text for the user to review.
---

# write-goal — draft strong Codex Goals

Produce a ready-to-run `/goal ...` command from the user's rough objective. The output should make "done" auditable without over-prescribing the path.

## Workflow

1. Decide if a Goal is appropriate.
   - Use a Goal for long-running work with a durable objective, uncertain path, and evidence-based finish line.
   - Prefer a normal prompt for one-line edits, simple explanations, short reviews, or tasks with no meaningful continuation loop.
   - If the user explicitly asks for `/write-goal`, still help, but say briefly if a normal prompt would fit better.

2. Extract or infer the six Goal fields.
   - **Outcome**: what should be true when work is done.
   - **Verification surface**: tests, benchmark, report, artifact, command output, reproduction, source evidence, or browser-visible state that proves it.
   - **Constraints**: behavior, APIs, tests, UX, performance, docs, data, or safety boundaries that must not regress.
   - **Boundaries**: allowed repos, files, tools, services, data, time, budget, or destructive-operation limits.
   - **Iteration policy**: how Codex should pick the next useful action after each attempt.
   - **Blocked stop condition**: when Codex should stop and report evidence, blockers, and what would unlock progress.

3. Ask only for missing information that blocks an auditable Goal.
   - Ask at most two questions.
   - Do not ask if a conservative assumption is obvious from the user's wording.
   - If unsure about exact verification, name a likely verification surface and mark it as an assumption.

4. Write the Goal as one compact command.
   - Start with `/goal`.
   - Keep it specific enough to check and broad enough for Codex to choose the next action.
   - Include the blocked stop condition in the command for ambiguous, research, flaky, or infrastructure work.

## Output Format

If the Goal is viable:

```text
Use this:

/goal <desired end state>, verified by <specific evidence>, while preserving <constraints>. Use <boundaries>. Between iterations, <iteration policy>. If blocked or no valid path remains, stop with <evidence gathered, attempted paths, blocker, and next input needed>.
```

Then add `Assumptions:` only if you inferred important details.

If critical information is missing:

```text
I can write this, but one thing decides whether the Goal is auditable: <question>
```

If a Goal is the wrong tool:

```text
This is probably better as a normal prompt because <reason>. If you still want it as a Goal:

/goal ...
```

## Quality Checks

Before answering, make sure the drafted Goal:

- Names a concrete end state, not just "improve", "clean up", or "investigate".
- Has a verification surface Codex can inspect.
- Preserves at least one relevant constraint.
- Gives Codex room to iterate without asking the user to say "keep going".
- Defines what to report if blocked instead of treating uncertainty as success.
- Avoids lifecycle commands; do not call goal tools or mark a Goal complete from this skill.

## Patterns

Weak:

```text
Improve performance
```

Strong:

```text
/goal Reduce p95 checkout latency below 120 ms, verified by the checkout benchmark, while keeping the correctness suite green. Use the checkout service, benchmark fixtures, and related tests. Between iterations, record what changed, what the benchmark showed, and the next best experiment. If the benchmark cannot run or no valid path remains, stop with the attempted paths, evidence gathered, blocker, and next input needed.
```

Weak:

```text
Fix the flaky checkout test
```

Strong:

```text
/goal Make the flaky checkout test pass reliably on the current branch, verified by reproducing the failure or identifying why it cannot be reproduced, applying a focused fix, and rerunning the relevant test command enough times to support the result. Preserve public API behavior and existing coverage. Between iterations, follow the strongest evidence from failure output, logs, and recent diffs. If the failure cannot be reproduced or no defensible fix remains, stop with the commands run, evidence gathered, suspected cause, and next input needed.
```

Weak:

```text
Research this paper
```

Strong:

```text
/goal Produce an evidence-backed audit of the paper's main claims using the available materials and local resources. Attempt feasible reproductions, verify outputs where possible, and end with a report separating confirmed findings, approximate reconstructions, blocked claims, and remaining uncertainty. Between iterations, prioritize claims with the strongest available evidence and lowest reproduction cost. If exact reproduction is blocked, stop with the missing materials, attempted paths, proxy evidence, and what would unlock stronger verification.
```
