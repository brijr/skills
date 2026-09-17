# WebMCP implementation record

> Replace placeholders with repository-specific findings. This is documentation, not a runtime manifest.

## Scope

App / package:
App commit:
User workflows:
Chosen initial slice:
Out of scope:
Assumptions:
Existing instructions and conventions:

## Research and compatibility

Checked on:
Primary source URLs and relevant update dates:
Browser name / full version / channel:
Agent / consumer / surface:
Activation configuration:
Observed entrypoint and methods:
Required subset (imperative / declarative / iframe):
Registration and execution cancellation behavior:
Input/result representation:
Any SDK / types / wrapper and exact version:
Native support observed or still unverified:

## Existing architecture

UI entrypoints:
Shared actions/services:
Runtime validation:
Authentication/session source:
Server authorization and tenant/resource checks:
State and cache synchronization:
Client registration owner:
Feature gate / disable mechanism:

## Tool inventory

| Tool | User intent | Registration scope | Existing operation | Side effects | Confirmation | Test coverage |
| --- | --- | --- | --- | --- | --- | --- |
| <name> | <intent> | <page/session/workspace> | <path:export> | <none/draft/write/etc.> | <none/review/commit boundary> | <tests> |

### Contract: <tool name>

Description:
Input schema and runtime validator:
Output contract and observable postcondition:
Identity / workspace derivation:
Authorization and ownership checks:
Data minimization:
Supported annotations and rationale:
Human review binding, if needed:
Cancellation / timeout outcome:
Idempotency / duplicate behavior:
UI feedback and state synchronization:
Errors and safe recovery:

## Security decisions

High-risk operations deferred:
Human confirmation enforcement:
No agent-controlled approval parameter:
Cross-origin policy:
Secrets / private-data handling:
Logging and redaction:
Real mutations permitted for testing (normally synthetic only):

## Implementation

Changed modules:
New dependencies and rationale:
Baseline commands and pre-existing failures:

## Verification

| Layer | Status | Environment / command / steps | Evidence and gaps |
| --- | --- | --- | --- |
| Shared actions/contracts | not run | | |
| Adapter/lifecycle | not run | | |
| Real browser | not run | | |
| Intended consumer | not run | | |
| Human UI regression | not run | | |
| Type/lint/build | not run | | |

## Operations and maintenance

Local activation steps:
How to inspect and invoke tools safely:
Feature-disable / rollback steps:
Known unsupported environments:
Compatibility recheck trigger:
Follow-up work:
