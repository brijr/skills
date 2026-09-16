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
