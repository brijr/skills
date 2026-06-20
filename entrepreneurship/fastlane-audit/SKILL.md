---
name: fastlane-audit
description: Audit whether a business is actually decoupling time from money, or is a disguised job. Identifies leverage gaps, time-for-money traps, and the specific path from slowlane to fastlane based on MJ DeMarco's wealth equation from The Millionaire Fastlane. Use when the user writes /fastlane-audit, asks "is this a real business or a job", wants to check if they're building a money tree or trading hours for dollars, or references the Fastlane, time decoupling, or the wealth equation. Do not use for evaluating all five CENTS commandments (use cents-audit), market need validation (use need-validation), scaling analysis (use scale-assessment), or system design (use wealth-system-design).
---

# fastlane-audit — time decoupling and leverage audit

This skill audits a business against MJ DeMarco's wealth equation from *The Millionaire Fastlane*. It exposes whether a venture is genuinely decoupling time from money — the core distinction between a Fastlane wealth vehicle and a disguised job.

## When to use

Use when the user wants to know if their business is actually a Fastlane or just a job with extra steps. The user may ask about time-for-money traps, leverage, passive income, or whether they're building a "money tree".

Do not use for:

- Full CENTS evaluation; use `cents-audit`
- Market need analysis; use `need-validation`
- Scale and ceiling analysis; use `scale-assessment`
- Designing a money-tree system; use `wealth-system-design`

## The wealth equation

DeMarco's wealth equation for the Fastlane is:

```
Wealth = Net Profit × Asset Value × Scale
```

Where:
- **Net Profit** = what you keep after costs
- **Asset Value** = what the system is worth as a sellable asset (not your labor)
- **Scale** = the magnitude of your reach — the universe of users you can serve

Scale in DeMarco's equation is about reach (how many people the system can touch), not leverage (output per hour). A business with high reach but poor time-decoupling is still a Slowlane. This audit checks whether that Scale is actually decoupled from founder time.

The Slowlane equation is:

```
Wealth = Hourly Rate × Hours Worked × Compound Interest (over decades)
```

The audit identifies which equation the business is actually running — not which one the user *thinks* they're running.

## Audit dimensions

### 1. Revenue time-coupling

Measure how directly revenue is tied to the founder's active hours.

| Pattern | Coupling | Verdict |
|---|---|---|
| Recurring revenue, automated delivery | None | Fastlane |
| Recurring revenue, manual fulfillment | Low | Aspiring |
| Per-project, repeat clients | Medium | Slowlane |
| Hourly billing | Full | Job |
| Product sales, automated fulfillment | None | Fastlane |
| Product sales, manual fulfillment | Low | Aspiring |

Score: What percentage of monthly revenue would continue if the founder stopped working for 30 days?

- 80–100%: Fully decoupled
- 50–79%: Mostly decoupled
- 20–49%: Partially coupled
- 0–19%: Fully coupled (job)

### 2. Leverage mechanisms

Identify which leverage mechanisms are in play. A Fastlane business must have at least one:

- **Code** — software runs without you. One codebase serves unlimited users.
- **Content** — content is created once and consumed infinitely. Articles, videos, courses.
- **Distribution** — a network, audience, or channel that compounds. Each new node increases value for all nodes.
- **Capital** — money deploys without your active labor. Investments, lending, inventory.
- **People** — systems run by others. Delegation, not just hiring.
- **Brand** — trust and recognition that reduces acquisition cost over time.

A business with zero leverage mechanisms is a job regardless of revenue.

### 3. Fulfillment dependence

Map the path from customer payment to value delivery. For each step, mark whether it requires the founder:

```
Payment → [Founder?] → Onboarding → [Founder?] → Delivery → [Founder?] → Support → [Founder?] → Renewal
```

Every `[Founder?]` node is a coupling point. Count them. A Fastlane has zero. A job has all of them.

### 4. The "hit by a bus" test

If the founder was unavailable for 60 days:
- Would revenue continue?
- Would customers be served?
- Would the system deteriorate or maintain itself?
- Would the business be sellable?

A sellable business that runs without the founder is the ultimate Fastlane proof.

### 5. Trajectory check

Is the business moving toward or away from decoupling?

- **Approaching Fastlane:** Each month, the percentage of decoupled revenue increases. Systems replace manual work. Hiring is for leverage, not capacity.
- **Stuck Slowlane:** Revenue grows, but hours grow proportionally. "I'll systematize later" never arrives. Hiring is for capacity, not leverage.
- **Reverse Fastlane:** Revenue grows but complexity grows faster. More clients means more chaos, more hours, more coupling.

### 6. Scoring

Score each dimension 0–10, then compute the average:

| Dimension | What it measures |
|---|---|
| Revenue time-coupling | % of revenue that survives 30 days without founder |
| Leverage mechanisms | Number and strength of leverage mechanisms in play |
| Fulfillment map | Ratio of system-dependent to founder-dependent nodes |
| Hit-by-a-bus test | 60-day survival percentage |
| Trajectory | Direction of travel (approaching / stuck / reversing) |

Average score determines the verdict (see below).

## Audit process

1. **Map the revenue model** — list every revenue stream and its time-coupling pattern.
2. **Score decoupling percentage** — what survives 30 days without the founder?
3. **Identify leverage mechanisms** — which are present, which are missing?
4. **Map fulfillment steps** — count founder-coupled nodes.
5. **Run the hit-by-a-bus test** — 60-day survival assessment.
6. **Check trajectory** — is decoupling improving, flat, or worsening?
7. **Identify the #1 decoupling bottleneck** — the single highest-leverage change that would move the business toward Fastlane.

## Output format

```
## Fastlane Audit: [Venture Name]

### Revenue time-coupling: [score]/10
[Score: X% decoupled]
[Breakdown per revenue stream]

### Leverage mechanisms: [score]/10
[Present: ...]
[Missing: ...]

### Fulfillment map: [score]/10
Payment → [✓/✗ Founder] → Onboarding → [✓/✗] → Delivery → [✓/✗] → Support → [✓/✗] → Renewal
[Coupled nodes: N out of M]

### Hit-by-a-bus test: [score]/10 (60 days)
[Revenue survival: X%]
[Customer impact: ...]
[Sellability: ...]

### Trajectory: [score]/10
[Approaching Fastlane / Stuck Slowlane / Reverse Fastlane]
[Evidence]

### Average score: [X]/10

### Verdict: [Fastlane / Aspiring Fastlane / Slowlane / Dead End]

### #1 Decoupling bottleneck
[The single highest-leverage change]
[Specific action to fix it]
```

## Pitfalls

- Do not confuse "busy" with "coupled". A founder can be busy with leverage-building work (writing code, creating content, building systems) that is decoupled at delivery.
- Do not confuse "delegation" with "leverage". Delegating tasks you could do yourself is capacity hiring. Delegating entire systems with documented processes is leverage.
- Do not score the aspiration. Score the current state. "I could automate this" is not the same as "this is automated".
- Do not treat all recurring revenue as decoupled. A retainer that requires your active work every month is recurring revenue but not decoupled.
- Do not ignore trajectory. A business at 30% decoupling that is improving monthly is healthier than one at 50% that is regressing.
