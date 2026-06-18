# DECISIONS.md format

The decisions log is the system's long-term memory of human taste. Every verdict at the gate gets appended here verbatim, so the agent never re-litigates a settled question and the human never has to repeat themselves.

## Entry format

Append one block per verdict. Newest at the bottom, chronological, so git blame reads naturally.

```md
## 2026-06-09 — Settings page
Verdict: approved with one change.
"Section headers are too heavy, drop to weight 500."
Action: fixed in this iteration.
Promoted to /design.md: yes — added "section headers use weight 500, never 600+".
```

```md
## 2026-06-09 — Dashboard
Verdict: rejected.
"Card density is wrong — too airy for a data tool. Tighten to 36px rows
 and cut the card padding in half."
Action: surface back to in-progress with these fixes queued.
Promoted to /design.md: yes — added "data-dense surfaces use 36px rows".
```

## The promotion question

After recording every verdict, ask: is this a one-off, or a general rule? If the human's note would apply to other surfaces too ("headers should always...", "we never..."), propose adding it to `/design.md`.

That's the mechanism that makes the human gate reject less over time: each verdict compiles a bit more of the human's taste into the canonical contract, so the agent gets it right unprompted next time.

One-off verdicts ("this specific empty-state copy should say X") stay here and don't get promoted.
