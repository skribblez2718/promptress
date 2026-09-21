# Harness-Agnostic Audit Prompts

These prompts preserve a shared audit discipline while remaining independent of any one agent framework.

## Prompt map

| Prompt                                               | Use it to                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`concept-audit.md`](concept-audit.md)               | Test a pre-plan concept and produce a revised concept with a separate plan-readiness judgment.                  |
| [`create-audit.md`](create-audit.md)                 | Create or capability-preservingly revise another audit prompt.                                                  |
| [`harness-audit.md`](harness-audit.md)               | Audit an entire agentic harness, including prompts, agents, tools, workflows, state, memory, and user controls. |
| [`human-centered-audit.md`](human-centered-audit.md) | Audit reader-facing writing without an authorship verdict or style detector.                                    |
| [`plan-audit.md`](plan-audit.md)                     | Test whether a plan can produce its intended result and propose a capability-safe revision.                     |
| [`project-audit.md`](project-audit.md)               | Audit an arbitrary project's outcome alignment, evidence, measures, and scaling risks.                          |
| [`skill-audit.md`](skill-audit.md)                   | Audit one agentic skill and only the parent-harness dependencies needed to understand it.                       |

## Portability contract

The prompts intentionally avoid:

- positional variables such as `$1`;
- slash-command assumptions;
- framework-specific frontmatter;
- fixed tool names or artifact APIs;
- fixed project-root environment variables;
- one repository layout or prompt-layer implementation; and
- claims that prompt wording itself grants permissions.

Each prompt instead defines semantic fields under **Input contract**. A harness may supply them as task text, structured fields, template variables, or another native mechanism.

The auditor must use only capabilities actually exposed by its runtime. Generic actions such as “read,” “write,” “fetch,” “run,” or “review” describe needed behavior, not guaranteed tools or permission. Missing capabilities produce a targeted question, `BLOCKED` result, or bounded `LIMITED` result rather than fabrication.

## Shared audit discipline

Across the collection, audits should:

1. establish the authoritative real-world or user-visible outcome;
2. define observable better and worse conditions;
3. bound and account for the effective corpus;
4. distinguish coverage from alignment;
5. ground consequential findings in re-checkable evidence;
6. keep a complete plain-English decision in one place for each fixable issue;
7. protect working capabilities and prefer reversible changes;
8. classify measures as outcome-faithful, proxy, or vanity when relevant;
9. distinguish genuine proxy drift from a merely imperfect proxy;
10. keep the target read-only unless a different side-effect contract is explicitly authorized; and
11. verify outputs and report limitations honestly.

## Model and compute scaling

When AI or model behavior is materially involved, the audit prompts require a source-gated scaling analysis:

- read the full canonical “The Bitter Lesson” essay before attributing claims to Richard Sutton;
- separate essay claims from the audit's engineering translation;
- identify fixed human knowledge or procedures, their current value, and their scaling limit;
- prefer mechanisms that can benefit from stronger models, search, learning, tools, data, or computation when outcome evidence supports them;
- preserve deterministic controls for safety, external requirements, machine interfaces, and consequential actions; and
- replace brittle scaffolding only with capability-preserving evaluation and regression evidence.

This is an outcome and adaptability discipline, not a ban on explicit structure.

## Delivery modes

- **Response:** the default. Return equivalent labeled sections without filesystem writes.
- **Bundle:** an explicit opt-in. Write durable outputs to one collision-safe directory outside the complete read-only corpus. Use when the audit requires files, ledgers, evals, regressions, or manifests.
- **Single file:** `create-audit.md` is the deliberate exception. It writes only when the caller supplies an explicit output path; otherwise it returns the candidate in the response.

A prompt may require `LIMITED` status when response delivery prevents a material assurance obligation from being completed.
