---
name: scale-assessment
description: Evaluate whether a business can scale without proportional increases in time, cost, or effort. Identifies the scaling bottleneck, the leverage mechanism, and the path from linear to exponential growth based on MJ DeMarco's concepts of scale and leverage from The Millionaire Fastlane. Use when the user writes /scale-assessment, asks "can this scale", wants to find the ceiling on their business, or references scale, leverage, or marginal cost. Do not use for full CENTS evaluation (use cents-audit), time-decoupling analysis (use fastlane-audit), need validation (use need-validation), or designing a money-tree system (use wealth-system-design).
---

# scale-assessment — scaling and leverage analysis

This skill evaluates a business's capacity to scale without proportional effort, based on MJ DeMarco's concept of Scale from *The Millionaire Fastlane*. A Fastlane business must have a non-linear relationship between input and output — doubling customers should not require doubling headcount, hours, or infrastructure.

## When to use

Use when the user wants to understand the ceiling on their business, identify what blocks exponential growth, or evaluate whether their model can scale. The user may ask about leverage, marginal cost, growth constraints, or "how big can this get".

Do not use for:

- Full CENTS evaluation; use `cents-audit`
- Time-decoupling analysis; use `fastlane-audit`
- Market need testing; use `need-validation`
- Designing a money-tree system; use `wealth-system-design`

## The scale test

DeMarco's test for Scale:

> **Can you serve 10x the customers without 10x the cost, time, or effort?**

If yes, the business scales. If no, the business is linear — a high-paying job, not a wealth vehicle.

## Assessment dimensions

### 1. Revenue per unit of effort

Map the relationship between input and output:

| Model | Relationship | Verdict |
|---|---|---|
| Software/SaaS | 1 codebase → unlimited users | Exponential scale |
| Content/Media | 1 creation → unlimited consumption | Exponential scale |
| Marketplaces | Network effects compound | Super-linear scale |
| Productized service | Fixed scope, systematized delivery | Linear-to-super-linear |
| Agency/consulting | Revenue ≈ headcount × utilization | Linear (job) |
| Manufacturing | Marginal cost decreases but doesn't hit zero | Sub-linear |
| Retail/physical | Revenue ≈ locations × foot traffic | Linear |

Score: 0–10 based on where the business falls on this spectrum.

### 2. Marginal cost curve

What does it cost to serve the next customer?

- **Approaches zero:** Software, digital goods, content. Each additional user costs nearly nothing.
- **Decreases:** Marketplaces, platforms with network effects. Each user increases value for all users.
- **Flat:** Productized services with some automation. Each customer costs roughly the same.
- **Increases linearly:** Services, agencies. Each customer requires proportionally more people.
- **Increases super-linearly:** Complex custom work. Each customer requires more coordination overhead than the last.

Score: 0–10 based on the marginal cost trajectory.

### 3. The constraint map

Identify what actually limits growth. Every business has a bottleneck — the question is whether it's fixable:

| Constraint | Fixable? | Impact if fixed |
|---|---|---|
| **Founder time** | Yes, via systems/delegation | Unlocks linear growth |
| **Team capacity** | Yes, via hiring | Unlocks linear growth |
| **Market size** | No (or very slowly) | Hard ceiling |
| **Production capacity** | Sometimes, via capital | Unlocks sub-linear growth |
| **Distribution/acquisition cost** | Yes, via brand/content/SEO | Unlocks exponential growth |
| **Regulatory/compliance** | Difficult | Hard ceiling |
| **Technology** | Yes, via engineering | Unlocks exponential growth |

The fixable constraints are opportunities. The unfixable ones are ceilings.

Score: 0–10 based on whether the primary constraint is fixable and what unlocking it enables.

### 4. Leverage multiplier

What is the leverage multiplier — output per unit of founder input?

Calculate: `Annual Revenue / Annual Founder Hours`

- **> $10,000/hour of founder time:** High leverage (software at scale, content empires)
- **$1,000–$10,000/hour:** Medium leverage (successful SaaS, productized services)
- **$100–$1,000/hour:** Low leverage (consulting, small agency)
- **< $100/hour:** No leverage (freelancer, employee-equivalent)

This is not the same as the hourly rate charged to clients — it's total revenue divided by total founder hours invested.

Score: 0–10 based on the leverage multiplier.

### 5. Ceiling analysis

What is the theoretical maximum revenue?

- **Unlimited:** Software, content, marketplaces — the ceiling is market size, not the model.
- **High ($10M+):** Productized services, SaaS in a large market, agencies with strong systems.
- **Medium ($1–10M):** Boutique agencies, specialized consulting, small SaaS in a niche.
- **Low (<$1M):** Solopreneur services, local businesses, trades.

The ceiling matters less than whether the business can reach 50% of it without breaking.

Score: 0–10 based on ceiling height and reachability.

## Assessment process

1. **Map the revenue model** — how does the business make money per customer?
2. **Plot the marginal cost curve** — what does customer N+1 cost vs customer N?
3. **Identify the primary constraint** — what actually stops growth today?
4. **Calculate the leverage multiplier** — revenue per founder hour.
5. **Project the ceiling** — theoretical max revenue and whether the model can reach it.
6. **Identify the #1 scaling unlock** — the single change that would shift the business from linear to super-linear growth.

## Output format

```
## Scale Assessment: [Venture Name]

### Revenue model
[How revenue is generated per customer]

### Revenue per unit of effort: [score]/10
[Model type and evidence]

### Marginal cost curve: [score]/10
[Trajectory and evidence]

### Primary constraint: [type]
[What limits growth today]
[Fixable: yes/no]
[Impact if fixed: ...]

### Leverage multiplier: [score]/10
[Revenue per founder hour: $X/hr]

### Ceiling analysis: [score]/10
[Theoretical max: $X]
[Reachable at 50%: yes/no]

### Average score: [X]/10

### Verdict: [Exponential Scale / Super-Linear / Linear / Sub-Linear]

### #1 Scaling unlock
[The single highest-leverage change]
[Specific action to achieve it]
```

## Pitfalls

- Do not confuse revenue growth with scaling. Revenue can grow linearly while the business remains non-scalable — it just means more hours, more people, more cost.
- Do not assume technology automatically creates scale. A SaaS with manual onboarding, custom implementations, and high support burden can be as linear as a service business.
- Do not ignore the constraint. A business with exponential potential but a hard market-size ceiling is still capped.
- Do not score the model's theoretical best case if the current execution is linear. Score what the business actually does, not what it could do "if we automated everything".
- Do not confuse hiring with scaling. Adding people to do manual work is linear growth. Adding systems that replace manual work is scaling.
