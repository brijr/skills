---
name: need-validation
description: Test a product or business idea against the Commandment of Need from MJ DeMarco's The Millionaire Fastlane. Evaluate whether the market has a raw, urgent, credit-card-out want — not a "nice to have". Score need intensity, willingness to pay, existing spend evidence, and pain urgency. Use when the user writes /need-validation, asks "does anyone actually want this", wants to validate a product idea before building, or references the Commandment of Need. Do not use for full CENTS evaluation (use cents-audit), time-decoupling analysis (use fastlane-audit), scaling analysis (use scale-assessment), or designing a business system (use wealth-system-design).
---

# need-validation — Commandment of Need evaluation

This skill tests a product or business idea against the Commandment of Need from *The Millionaire Fastlane*. DeMarco is blunt: the market doesn't care about your idea, your passion, or your technology. The market cares about what it needs. Need is the heaviest commandment — without it, nothing else matters.

## When to use

Use when the user wants to validate whether a product idea has genuine market need before investing time in building. The user may ask "is this a good idea", "would people pay for this", or "does anyone want this".

Do not use for:

- Full CENTS evaluation; use `cents-audit`
- Time-decoupling analysis; use `fastlane-audit`
- Scale potential; use `scale-assessment`
- Designing the business system; use `wealth-system-design`

## The core test

DeMarco's test for Need is simple and brutal:

> **Does the market pull out a credit card for this?**

Not "would they sign up for a free trial". Not "they said they'd use it". Not "they liked it in a demo". **Do they spend money to solve this problem?**

If the answer is no, there is no Need. Everything else is theater.

## Validation dimensions

### 1. Pain intensity

What level of pain does this problem cause?

| Level | Description | Verdict |
|---|---|---|
| **Bleeding neck** | The problem is costing money right now, every day it persists | Strong need |
| **Active pain** | The problem is annoying enough that they're actively seeking solutions | Real need |
| **Background friction** | They've learned to live with it but would switch for something better | Weak need |
| **Nice to have** | They hadn't thought about it until you mentioned it | No need |
| **Solution seeking a problem** | You built something cool and are looking for someone who needs it | Anti-need |

Score: 0–10 based on the pain level above.

### 2. Existing spend evidence

Is anyone already paying to solve this problem?

- **Direct competitors charging:** People are paying for a solution. The need is proven. You're competing on execution.
- **Adjacent spend:** People pay for tools/workarounds that partially address the problem. The need exists but is underserved.
- **DIY/makeshift solutions:** People build their own spreadsheets, scripts, or manual processes. The need exists but nobody has productized it well.
- **No spend anywhere:** Nobody pays anything to solve this. Either the need doesn't exist or it's not painful enough to pay for.

Score: 0–10 based on spend evidence.

### 3. Urgency

How urgently does the market need this solved?

- **Now:** They need it solved today. Every day without it costs money or time.
- **Soon:** They know they need it and are planning to address it within weeks.
- **Eventually:** They'd like to solve it but it's not a priority.
- **Never:** They don't see it as a problem.

Score: 0–10.

### 4. Market pull signals

What evidence exists that the market is pulling for a solution?

- Are people searching for this? (Search volume, forum posts, community questions)
- Are people complaining about the current state? (Reviews of competitors, Reddit, social media)
- Are people asking for this specifically? (Feature requests, "I wish there was..." posts)
- Are people paying for bad solutions? (Pain is high enough to tolerate a poor product)
- Is there organic word-of-mouth for existing solutions?

Score: 0–10 based on quantity and strength of pull signals.

### 5. The "painkiller vs vitamin" test

Classify the product honestly:

- **Painkiller:** Stops active pain. People buy painkillers before they buy vitamins. Price-inelastic.
- **Vitamin:** Improves something that isn't broken. People buy vitamins when they have disposable income and motivation. Price-elastic.
- **Candy:** Pleasurable but unnecessary. Pure discretionary spend.

Painkillers score 8–10. Vitamins score 4–7. Candy scores 0–3.

## Validation process

1. **State the problem clearly** — not the solution, the problem. "People can't track their Shopify stockouts" not "an AI-powered inventory dashboard".
2. **Score all five dimensions** with specific evidence. No score without a "because".
3. **Identify the cheapest validation experiment** — the fastest way to test willingness to pay before building.
4. **Produce a verdict.**

### Verdict scale

- **Strong Need (8–10 average):** The market is bleeding and paying. Build immediately. The risk is execution, not demand.
- **Real Need (6–7 average):** The problem is real and some people pay. Build, but validate pricing and positioning early.
- **Weak Need (4–5 average):** The problem exists but the market isn't desperate. Proceed only if you have a distribution advantage or can create the need.
- **No Need (0–3 average):** Stop. Do not build. The market doesn't care. Find a different problem.

## Validation experiments

The audit must recommend the cheapest possible experiment to test willingness to pay:

1. **Pre-sell:** Put up a landing page with a "buy" button before building. If nobody clicks, there's no need.
2. **Concierge test:** Manually deliver the service to 5 paying customers. If you can't get 5, there's no need.
3. **Fake door test:** Add the feature to your existing product behind a "coming soon" button. Count clicks.
4. **Competitor customer interviews:** Interview 10 customers of the closest competitor. Ask what they'd pay more for.
5. **Search and forum mining:** Find 50 public posts of people asking for this. If you can't find 50, the need may not exist.

## Output format

```
## Need Validation: [Product/Idea]

### Problem statement
[The problem, not the solution]

### Pain intensity: [score]/10
[evidence]

### Existing spend evidence: [score]/10
[evidence]

### Urgency: [score]/10
[evidence]

### Market pull signals: [score]/10
[evidence]

### Painkiller vs vitamin: [classification + score]/10
[evidence]

### Average score: [X]/10

### Verdict: [Strong Need / Real Need / Weak Need / No Need]

### Cheapest validation experiment
[Specific experiment to run, with expected timeline and success criteria]
```

## Pitfalls

- Do not confuse your own need with market need. "I needed this" is not "the market needs this".
- Do not confuse interest with willingness to pay. "That sounds cool" is not "here's my credit card".
- Do not score based on market size. A billion-dollar market with weak pain is still weak need.
- Do not confuse competitor existence with validated need. Competitors can exist and still fail if the need is weak.
- Do not skip the validation experiment. The audit is a hypothesis; the experiment is the proof.
- Do not let the founder's enthusiasm inflate scores. Score as if you were an investor evaluating someone else's pitch.
