# brijr/skills

Personal skills for product interfaces, software design, and evidence-backed delivery. Choose the skill matching the actual task; there is no mandatory sequence of skills.

## Choose a skill

| Task | Skill |
| --- | --- |
| Design interfaces, ownership, or data flow for new behavior | `software-design` |
| Build a standalone prototype or spike | `pragmatic` |
| Clean up a recent diff without changing behavior | `clean-up` |
| Deep structural maintainability review | `thermo-nuclear-code-quality-review` |
| Critique or improve an existing screen; iterate on corrections | `refactor-ui` |
| Resolve product journeys, roles, or handoffs across screens | `product-design` |
| Apply restrained styling in React or shadcn | `calm-ui` |
| Apply framework-independent restrained visual principles | `ui-principles` |
| Create the specific single-file layout/prose contract | `craft-ds` |
| Improve multiple surfaces against a shared design contract | `design-loop` |
| Assess PR readiness or perform authorized release steps | `review-pr` |
| Summarize verified shipped work | `what-shipped` |
| Draft an auditable agent goal | `write-goal` |
| Explicit coaching, practice, or mastery | `explain` |

Ordinary explanations need no coaching skill. Styling corrections need no product-design phase. A critique-only request stays read-only; approved implementation continues without repeated approval. Review, merge, deployment, and external messages remain distinct authorizations.

## Install

Other users can install selected skills using their agent's skill installer and the relevant directory in this repository. Each skill is standalone; supporting references travel with its folder.

### Personal maintained installation

This machine uses `/Users/brijr/projects/skills` as the source checkout. The owned skill directories in `~/.agents/skills` link to that checkout, and `~/.codex/skills` links through `~/.agents/skills`. Edit and review changes in the checkout so installed skills cannot drift from source.

Do not use a package-based reinstall to overwrite these links. Before a managed reinstall or relocation, preserve any changes, inspect the existing targets, and explicitly reconcile the installation layout. Third-party and plugin-managed skills are maintained separately.

`redesign` was replaced by `refactor-ui`; the old installation links should be removed rather than retained as a competing skill.

## Working conventions

Descriptions identify capability and activation boundaries. Entrypoints keep decision-critical constraints; references provide conditional examples or operating modes. Preserve user intent and scope, use proportional verification, and avoid mandatory skill handoffs.

`design-loop` records progress across authorized surfaces and pauses at requested checkpoints or material unresolved decisions. It never labels agent verification as human approval.

## Validation

Run the skill-creator validator on each changed skill and check local references and installed links. `pnpm eval` runs the repository's model-backed evaluations using `ANTHROPIC_API_KEY` and optional `ANTHROPIC_MODEL`; keep credentials outside version control.

The workflow evaluations judge requested-stage behavior against concrete scenarios. They do not prove tool execution or end-to-end agent behavior: they evaluate generated responses. Code-generation evaluations remain separate. Missing credentials mean model evaluation is unverified, not passed.
