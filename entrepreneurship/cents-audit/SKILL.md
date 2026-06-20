---
name: cents-audit
description: Evaluate a business, product, or opportunity against MJ DeMarco's Five Commandments of Wealth (CENTS) — Control, Entry, Need, Time, Scale. Score each commandment, identify the weakest link, and produce a go/no-go verdict with specific fixes. Use when the user writes /cents-audit, asks to evaluate a business idea or opportunity, wants to know if a venture is "fastlane", or references CENTS, the Five Commandments, or The Millionaire Fastlane. Do not use for time-decoupling analysis (use fastlane-audit), pure financial modeling (use wealth-system-design), market research alone (use need-validation), or scaling analysis alone (use scale-assessment).
---

# cents-audit — Five Commandments of Wealth evaluation

This skill evaluates a business or opportunity against MJ DeMarco's CENTS framework from *The Millionaire Fastlane*. It is not generic business advice — it is a strict scoring system that exposes whether a venture has genuine wealth-creation potential or is a disguised job.

## When to use

Use when the user asks to evaluate a business idea, product, side project, client engagement, or investment opportunity against the Five Commandments. The user may reference DeMarco, Fastlane, CENTS, or simply ask "is this a good business?"

Do not use for:

- Deep market need validation alone; use `need-validation`
- Scale and leverage analysis alone; use `scale-assessment`
- Designing a money-tree system; use `wealth-system-design`
- Time-decoupling analysis alone; use `fastlane-audit`

## The Five Commandments

Each commandment is scored on a 0–10 scale with specific evidence. A score of 0 means the commandment is violated; 10 means it is fully satisfied. The audit is only as strong as its weakest commandment — a venture that scores 10 on four and 0 on one is NOT a Fastlane.

### C — Control

**Question:** Do you control the revenue-generating mechanism?

You must own and control the system that produces income. If someone else can cut you off, change the rules, or disintermediate you, you do not have Control.

Score evidence:
- Who owns the customer relationship?
- Who owns the pricing?
- Can a platform change its terms and kill your revenue overnight?
- Are you a dependency or a partner?
- If you left, does the system keep producing?

Red flags: sole dependency on an app store, a single marketplace, an employer, a franchisor's brand, or an API you don't control.

### E — Entry

**Question:** Is there a meaningful barrier to entry?

If anyone can start doing what you do in a weekend, there is no Entry. Low entry means high competition, race-to-bottom pricing, and no moat. High entry means fewer competitors and pricing power.

Score evidence:
- How long would it take a competent person to replicate this?
- What capital, expertise, relationships, or regulatory barriers exist?
- Does the difficulty increase over time (compound moat) or stay flat?
- Is the barrier real (cost, skill, network, regulation) or just "we were first"?

Red flags: "I just need to build a landing page", no specialized knowledge, no capital requirement, no network effect, pure execution speed as the only moat.

### N — Need

**Question:** Does the market genuinely need this?

Need is the most important commandment. The market must want what you're selling — not "appreciate it", not "think it's cool", but pull out a credit card for it. Need is measured in revenue, not likes.

Score evidence:
- What specific pain does this solve?
- Are people already paying for a solution (even a bad one)?
- Is this a vitamin (nice to have) or a painkiller (need to have)?
- What happens if this product disappears tomorrow — who suffers?
- Is the need large enough to sustain a business?

Red flags: "people will love this", no existing spend in the category, solving a problem nobody has, building for yourself not the market.

### T — Time

**Question:** Is income decoupled from your time?

If revenue stops when you stop working, you have a job, not a Fastlane. The system must produce income whether you are sleeping, on vacation, or building something else.

Score evidence:
- Does revenue continue if you don't work for a week? A month?
- Is there a 1:1 ratio between your hours and your income?
- What percentage of revenue requires your direct involvement?
- Can the system be delegated, automated, or systematized?
- What is the path to full time-decoupling?

Red flags: hourly billing, per-project revenue with no recurring component, manual fulfillment, "I'll hire later", no systematization plan.

### S — Scale

**Question:** Can this scale without proportional effort?

A Fastlane business has a non-linear relationship between input and output. Doubling revenue should not require doubling headcount, hours, or costs.

Score evidence:
- What is the theoretical ceiling on revenue?
- Does marginal cost decrease as volume increases?
- Can you serve 10x customers without 10x infrastructure?
- Is the constraint market size, production capacity, or your time?
- What happens to margins at scale?

Red flags: 1:1 service model, physical production constraints, geographic limitations, linear pricing, no leverage mechanism.

## Audit process

1. **Identify the venture clearly** — name it, describe the model, and list the revenue mechanism.
2. **Score each commandment 0–10** with specific, evidence-based reasoning. No vague scores — every number must have a "because".
3. **Identify the weakest commandment** — this is the bottleneck. The venture's potential is gated by its weakest score.
4. **Produce a verdict:**
   - **Fastlane** — all five commandments score 7+. Wealth-creation engine.
   - **Aspiring Fastlane** — 3–4 commandments at 7+, one or two fixable weaknesses. Worth pursuing if the fix is concrete.
   - **Dead End** — 2+ commandments below 4 with no clear fix. This is a job or a hobby, not a wealth vehicle.
   - **Slowlane** — high Time and Scale scores but low Control. You're building someone else's wealth.
5. **Output specific fixes** for the weakest commandments — not "improve marketing", but "add a recurring revenue component by X" or "build an API layer so you own the integration, not the platform".

## Output format

```
## CENTS Audit: [Venture Name]

### C — Control: [score]/10
[evidence and reasoning]

### E — Entry: [score]/10
[evidence and reasoning]

### N — Need: [score]/10
[evidence and reasoning]

### T — Time: [score]/10
[evidence and reasoning]

### S — Scale: [score]/10
[evidence and reasoning]

### Weakest link: [commandment]
[why this is the bottleneck]

### Verdict: [Fastlane / Aspiring Fastlane / Sidewalk / Slowlane]
[summary reasoning]

### Fixes
1. [specific, actionable fix for weakest commandment]
2. [specific, actionable fix for second-weakest]
```

## Pitfalls

- Do not score generously — the framework's value is in its honesty. A 5/10 on Need means the market doesn't really care.
- Do not confuse "I'm good at this" with Control. Skill is not ownership.
- Do not confuse "hard to build" with Entry. If the difficulty is just your learning curve, not a market barrier, Entry is low.
- Do not confuse "I could automate it later" with Time decoupled. Score the current state, not the aspiration.
- Do not confuse "big market" with Scale. Market size without a leverage mechanism is just a big ceiling you'll never reach.
