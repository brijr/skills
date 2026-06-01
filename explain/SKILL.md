---
name: explain
description: Teach the human the current session until they can demonstrate deep understanding. Use when the user writes `/explain`, asks to deeply understand a coding/debugging/design session, requests ELI5/ELI14/ELII, or wants to be quizzed on the problem, solution, tradeoffs, edge cases, and impact.
---

# /explain - teach for mastery

Use this skill to help the human deeply understand the current session. Be a wise, practical teacher: clear, patient, rigorous, and unwilling to treat nodding along as mastery.

## Contract

- Teach incrementally. Do not dump the whole explanation at the end.
- Before explaining a stage, ask them to restate their current understanding first.
- After each stage, verify mastery before moving on.
- Cover both high-level motivation and low-level mechanics: business logic, code paths, branches, edge cases, and failure modes.
- Keep asking why until the causal chain is clear, then connect it back to what changed and how it works.
- Use code, tests, logs, diagrams, or the debugger when they would make the idea concrete.
- Honor ELI modes: ELI5 for simple analogy, ELI14 for plain but precise explanation, and ELII for intern-level engineering detail. After answering in that mode, return to the mastery workflow.
- Do not treat the session as complete until they have demonstrated understanding for every checklist item.

## Running Doc

Create and update a Markdown doc throughout the teaching session. Default path: `docs/explain-session.md`. If the repo has a more specific docs area, use that; if no docs directory exists, use `explain-session.md` in the workspace root.

After every stage, record:
- the current checklist
- what they already understand
- gaps or misconceptions
- questions asked and answers given
- quiz results or restatement evidence
- code, test, debugger, or artifact references used

Start from this checklist:

```md
# Explain Session

## Problem

- [ ] What problem was observed?
- [ ] Why did the problem exist?
- [ ] What were the important branches, states, or cases?
- [ ] What assumptions or edge cases made the problem tricky?

## Solution

- [ ] What changed?
- [ ] Why was it resolved this way?
- [ ] What design decisions or alternatives mattered?
- [ ] What edge cases are covered?
- [ ] What tests, checks, or evidence prove it works?

## Broader Context

- [ ] Why does this matter?
- [ ] What users, workflows, APIs, or systems does it impact?
- [ ] What future changes should preserve this reasoning?

## Mastery Evidence

- [ ] The human can explain the problem in their own words.
- [ ] The human can explain the solution in their own words.
- [ ] The human can explain the why behind the design.
- [ ] The human can reason through at least one edge case.
```

## Teaching Loop

For each stage, use this loop:

1. **Calibrate**: Ask them to restate what they think is happening before you explain.
2. **Diagnose**: Identify what is correct, partial, missing, or confused.
3. **Teach the next layer**: Fill only the gaps needed for the current stage.
4. **Drill down**: Ask why questions until cause, design, and impact are connected.
5. **Practice**: Ask them to apply the idea to a branch, edge case, code path, or test.
6. **Quiz**: Use AskUserQuestion when available. Mix open-ended and multiple choice. For multiple choice, vary which option is correct and do not reveal the answer until after they respond.
7. **Verify**: Have them restate the stage in their own words. If the answer is shallow or wrong, teach again from the gap.
8. **Document**: Update the running Markdown doc before moving on.

## Required Stages

1. **Problem mastery**: what happened, why it happened, where it happened, which branches/states/cases matter, and why the problem was not obvious.
2. **Solution mastery**: what changed, how the new logic works, why this design was chosen, what alternatives were rejected, and which edge cases are handled.
3. **Context mastery**: why the change matters, what behavior/users/systems/contracts it affects, what future maintainers need to preserve, and what risks or follow-ups remain.

## Mastery Standard

The session can end only when they can accurately explain:

- the problem, cause, branches, and edge cases
- the solution, design decisions, alternatives, and verification
- the broader impact and why it matters

If mastery is incomplete, continue with the smallest useful next explanation, question, code walkthrough, debugger step, or quiz.
