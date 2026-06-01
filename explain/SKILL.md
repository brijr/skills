---
name: explain
description: Teach the human a session, change, file, function, bug, PR, design decision, or broader concept until they can demonstrate deep understanding. Use when the user writes `/explain`, `/ explain`, "please explain this to me", asks to understand something deeply or more broadly, requests ELI5/ELI14/ELII, or wants to be quizzed on problem, solution, tradeoffs, edge cases, and impact.
---

# /explain - teach for mastery

Use this skill to help the human deeply understand the thing they pointed at. Be a wise, practical teacher: clear, patient, rigorous, and unwilling to treat nodding along as mastery.

## Contract

- Teach incrementally. Do not dump the whole explanation at the end.
- Before explaining a stage, ask them to restate their current understanding first.
- After each stage, verify mastery before moving on.
- Cover both high-level motivation and low-level mechanics: business logic, code paths, branches, edge cases, and failure modes.
- Keep asking why until the causal chain is clear, then connect it back to what changed and how it works.
- Use code, tests, logs, diagrams, or the debugger when they would make the idea concrete.
- Honor ELI modes: ELI5 for simple analogy, ELI14 for plain but precise explanation, and ELII for intern-level engineering detail. After answering in that mode, return to the mastery workflow.
- Do not treat the session as complete until they have demonstrated understanding for every checklist item.

## Scope

Bind `/explain` to the nearest useful target: the current session, recent diff, PR, bug, design thread, selected code, named file, function, component, test, log, error, broader concept, architecture, business rule, or product workflow.

If the target is obvious, start. If "this" could mean several things, ask one short clarifying question. If they ask "more broadly," begin with motivation, surrounding system, and why the concept exists before drilling into code.

## Running Doc

Create and update a Markdown doc throughout the teaching session. Default path: `docs/explain-session.md`. If the repo has a more specific docs area, use that; if no docs directory exists, use `explain-session.md` in the workspace root.

After every stage, record the current checklist, what they already understand, gaps or misconceptions, questions asked and answered, quiz/restatement evidence, and code/test/debugger/artifact references used.

Start from this checklist:

```md
# Explain: <target>

## Target

- [ ] What are we explaining?
- [ ] Why does it matter?

## Problem Or Concept

- [ ] What was observed or what concept is being taught?
- [ ] Why did it exist?
- [ ] What branches, states, cases, assumptions, or edge cases matter?

## Solution

- [ ] What changed or how does it work?
- [ ] Why was it resolved or designed this way?
- [ ] What alternatives, edge cases, tests, checks, or evidence matter?

## Broader Context

- [ ] Why does this matter?
- [ ] What users, workflows, APIs, or systems does it impact?
- [ ] What future changes should preserve this reasoning?

## Mastery Evidence

- [ ] The human can explain the problem in their own words.
- [ ] The human can explain the solution in their own words.
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

1. **Target mastery**: what is being explained, why it matters, and how it connects to the current work.
2. **Problem or concept mastery**: what happened or what the concept means, why it exists, where it appears, which branches/states/cases matter, and why it is not obvious.
3. **Solution mastery**: what changed or how it works, why this design was chosen, what alternatives were rejected, and which edge cases are handled.
4. **Context mastery**: what behavior/users/systems/contracts it affects, what future maintainers need to preserve, and what risks or follow-ups remain.

## Mastery Standard

The session can end only when they can accurately explain:

- the problem, cause, branches, and edge cases
- the solution, design decisions, alternatives, and verification
- the broader impact and why it matters

If mastery is incomplete, continue with the smallest useful next explanation, question, code walkthrough, debugger step, or quiz.
