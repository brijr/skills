---
name: wealth-system-design
description: Design or restructure a venture as a money-tree system that produces income while you sleep, based on MJ DeMarco's money-tree categories from The Millionaire Fastlane. Evaluate which of the four money-tree types applies, design the system architecture, identify the automation/delegation path, and define the milestones from coupled to decoupled. Use when the user writes /wealth-system-design, asks to design a passive income system, wants to restructure a business as a money tree, or references money trees, system design, or decoupling revenue. Do not use for evaluating an existing business (use cents-audit or fastlane-audit), need validation (use need-validation), or scale analysis alone (use scale-assessment).
---

# wealth-system-design — money-tree system design

This skill designs or restructures a venture as a money-tree system based on MJ DeMarco's framework from *The Millionaire Fastlane*. A money tree is a business system that produces income without continuous active labor from the owner. This skill is prescriptive — it designs the system, not just analyzes it.

## When to use

Use when the user wants to design a new venture as a money tree from the start, or restructure an existing business to decouple revenue from time. The user may reference "passive income", "money tree", "automated business", or "system design".

Do not use for:

- Evaluating an existing business against CENTS; use `cents-audit`
- Auditing time-decoupling of an existing business; use `fastlane-audit`
- Validating market need; use `need-validation`
- Analyzing scale potential alone; use `scale-assessment`

## The five money-tree types

DeMarco identifies five business systems that can function as money trees. The design must select one as the primary engine:

### 1. Rental systems
**Income from asset usage, not labor.** Real estate, intellectual property, licensing, equipment leasing.

- Decoupling: High — the asset produces regardless of your time
- Entry: High — requires capital or valuable IP
- Scale: Bounded by asset count
- Examples: SaaS subscriptions, patent licensing, real estate rentals

### 2. Computer systems
**Income from code that runs without you.** Software products, apps, APIs, platforms.

- Decoupling: Very high — code serves unlimited users
- Entry: Medium — requires skill but not capital
- Scale: Nearly unlimited
- Examples: SaaS, mobile apps, APIs, automation tools

### 3. Content systems
**Income from content that is created once and consumed infinitely.** Media, courses, books, videos.

- Decoupling: Very high — content serves unlimited consumers
- Entry: Medium — requires expertise and production skill
- Scale: Nearly unlimited
- Examples: YouTube channels, online courses, books, podcasts

### 4. Distribution systems
**Income from connecting buyers and sellers.** E-commerce, marketplaces, affiliate networks, agencies with systematized lead gen.

- Decoupling: Medium-high — the system routes value, you don't produce it
- Entry: Medium — requires network or brand
- Scale: High — network effects compound
- Examples: Amazon FBA, affiliate sites, lead-gen businesses, marketplace platforms

### 5. People systems
**Income from systems run by others.** Delegated agencies, franchises, managed service businesses.

- Decoupling: Medium — depends on management quality
- Entry: Medium-high — requires hiring and process design
- Scale: Linear to super-linear — bounded by management capacity
- Examples: Agencies with documented playbooks, franchises, managed services

## Design process

### Phase 1: Select the money-tree type

Evaluate which type fits the venture:

- What asset do you have or can build? (capital → rental, skill → software/content, network → distribution, team → people)
- What type matches the market need?
- What type has the lowest entry barrier for this venture?
- What type gives the highest decoupling potential?

Select a primary type. A venture can blend types (e.g., software with distribution), but one must be the engine.

### Phase 2: Map the system architecture

Design the full system as a flow:

```
Acquisition → Activation → Value Delivery → Revenue → Retention → Referral
```

For each stage, specify:
- **What happens** (the process)
- **Who/what does it** (system, automation, or person)
- **Coupling level** (founder-dependent or system-dependent)
- **Decoupling path** (how it becomes system-dependent)

Every stage must have a decoupling path. If a stage cannot be decoupled, the system has a leak.

### Phase 3: Identify automation opportunities

For each coupled stage, identify what can be automated:

| Coupling type | Automation path |
|---|---|
| Manual onboarding | Self-serve onboarding flow, in-app tutorials |
| Manual fulfillment | API integration, automated pipeline, content delivery |
| Manual support | Knowledge base, AI chatbot, ticket routing |
| Manual sales | Self-serve checkout, automated sequences, content marketing |
| Manual reporting | Dashboards, scheduled exports, webhook notifications |
| Manual billing | Stripe billing, automated invoicing, subscription management |

### Phase 4: Identify delegation opportunities

For coupled stages that cannot be automated:

- Can this be documented as a playbook?
- Can a non-specialist execute it with a checklist?
- Can it be outsourced to a specialist at a lower cost than founder time?
- What is the hiring sequence? (first hire, second hire, management layer)

### Phase 5: Define decoupling milestones

Map the path from fully coupled to fully decoupled:

| Milestone | Decoupling % | What changes |
|---|---|---|
| **M0: Today** | 0–20% | Founder does everything |
| **M1: Systematized** | 20–40% | Core processes documented, first automation live |
| **M2: Automated delivery** | 40–60% | Value delivery runs without founder |
| **M3: Automated acquisition** | 60–80% | Leads and onboarding flow without founder |
| **M4: Delegated operations** | 80–95% | Team runs daily operations, founder oversees |
| **M5: Fully decoupled** | 95–100% | Founder sets strategy only, system runs itself |

Each milestone needs:
- A specific trigger (what must be true to reach it)
- A timeline estimate
- The #1 blocker preventing advancement

### Phase 6: Define the asset value

A money tree must be sellable. Define what makes the business valuable independent of the founder:

- What recurring revenue exists?
- What proprietary assets exist? (code, data, brand, customer list)
- What systems are documented and transferable?
- What is the rough valuation multiple for this type of business?

If the business is worthless without the founder, it is not a money tree — it is a personal practice.

## Output format

```
## Wealth System Design: [Venture Name]

### Money-tree type: [type]
[Why this type fits]
[Primary engine: ...]
[Secondary type (if blended): ...]

### System architecture
Acquisition: [process] → [system/person] → [coupling: X] → [decoupling path: ...]
Activation: [process] → [system/person] → [coupling: X] → [decoupling path: ...]
Value Delivery: [process] → [system/person] → [coupling: X] → [decoupling path: ...]
Revenue: [process] → [system/person] → [coupling: X] → [decoupling path: ...]
Retention: [process] → [system/person] → [coupling: X] → [decoupling path: ...]
Referral: [process] → [system/person] → [coupling: X] → [decoupling path: ...]

### Automation opportunities
1. [stage] → [automation] → [impact]
2. [stage] → [automation] → [impact]

### Delegation opportunities
1. [stage] → [playbook + role] → [impact]
2. [stage] → [playbook + role] → [impact]

### Decoupling milestones
M0 (today): [X% coupled] — [state]
M1: [X%] — [trigger] — [estimated timeline]
M2: [X%] — [trigger] — [estimated timeline]
M3: [X%] — [trigger] — [estimated timeline]
M4: [X%] — [trigger] — [estimated timeline]
M5: [X%] — [trigger] — [estimated timeline]

### Asset value
[Recurring revenue: $X/mo]
[Proprietary assets: ...]
[Transferable systems: ...]
[Estimated valuation: $X at Yx multiple]

### #1 next action
[The single highest-leverage step to advance one milestone]
```

## Pitfalls

- Do not design a system that requires a superhero founder. If the system only works because the founder is exceptional, it is not a money tree.
- Do not skip the decoupling path for any stage. A system with one permanently coupled stage is a system with a leak.
- Do not confuse "automated" with "self-sustaining." An automated system that breaks every week and requires the founder to fix it is still coupled.
- Do not assume delegation equals decoupling. Delegation without documentation and oversight is just paying someone to do your job poorly.
- Do not ignore asset value. A business that produces income but cannot be sold is a cash machine, not a wealth vehicle. DeMarco's distinction: wealth is assets, not income.
- Do not design for the current scale. Design the system to handle 10x current volume, then build the 1x version as the first milestone.
