# Plan Outcome Audit

Audit a plan as a plan—not as a project implementation or a particular agent subsystem. Determine whether its requirements, assumptions, sequence, deliverables, measures, and validation can produce the intended real-world result. Keep source material read-only and produce a capability-safe revised-plan proposal.

## Input contract

The caller supplies:

- **Target plan:** a readable file or directory, or complete inline plan text.
- **Output root:** optional parent directory for an audit bundle.
- **Delivery mode:** optional `bundle` or `response`. Default to `response`; bundle writes require explicit caller selection or an explicitly supplied output root with clear file-delivery intent.
- **Additional details:** optional context, constraints, priorities, scope limits, or deliverables.

Accept these through the host system's native invocation format. Do not depend on positional arguments, slash commands, environment variables, repository conventions, or named tools. Use only capabilities actually exposed. If the target is unavailable, ask for the text or report the limitation. Never claim an unavailable read, write, fetch, review, execution, or result.

Additional details cannot weaken evidence integrity, coverage honesty, source-read-only behavior, artifact-status honesty, or verification. Record a safe disposition for each material detail and redact secrets, personal data, authorization material, sensitive payloads, and unnecessary private path segments.

This prompt is methodology-, project-, and harness-neutral. Do not import a familiar product goal, planning framework, report schema, or directory convention unless the caller, plan, or an authoritative referenced source requires it.

## 1. Preflight and establish the intended outcome

Confirm that the target exists and is readable, or that complete inline content was supplied. For bundle delivery, resolve target, effective sources, output root, and candidate bundle before writing. The bundle must not overlap or sit inside the plan corpus. If no output root is supplied, use a harness-designated writable workspace area or an `audits/` directory under a caller-designated workspace when safe.

Infer one concise governing outcome—or an explicit hierarchy or tradeoff rule for legitimately co-equal outcomes—from direct caller statements and current human-authored plan evidence: problem statement, requirements, decisions, constraints, acceptance evidence, and sources the plan designates as authoritative. Explain the authority relationship. The goal is the result the plan exists to cause, not completion of its steps, deliverables, milestones, or tickets.

If the outcome, its authority, or a decision-relevant priority is absent, materially ambiguous, or contradicted, stop objective-dependent work. Cite the gap or both sides of the conflict, ask only what is needed, create no bundle, and do not guess. Implementation evidence may reveal a plan finding but cannot silently redefine the intended outcome.

Define observable **better** and **worse** for the eventual result in terms of outcome quality, evidence, cost, time, risk, affected users, and reversibility. Treat schedule, task completion, test counts, artifact counts, and scores as possible measures whose fidelity must be established.

## 2. Bound the effective plan corpus

By default include:

1. the supplied plan file or every plan-bearing file in the supplied directory;
2. attachments, appendices, checklists, decision records, designs, references, and evaluation material stored with it;
3. external artifacts the plan explicitly treats as authoritative for outcome, requirements, constraints, feasibility, or validation, only to the depth needed to test plan claims;
4. interactions among plan parts where contradictions, gaps, or dependency failures can arise; and
5. current implementation or environment evidence only when needed to verify a plan assumption.

Do not turn the task into an unbounded project audit. Inventory but normally exclude unrelated project files, dependencies, caches, builds, vendored material, secrets, private data, and ignored work-in-progress. Record private exclusions only by safe category and reason.

Treat requirements, assumptions, constraints, dependencies, decisions, workstreams, steps, milestones, deliverables, measures, acceptance clauses, risks, contingencies, and rollout or rollback conditions as possible plan components. Choose disjoint units—normally one row per file plus materially distinct components whose interaction would be hidden at file level.

Track:

- **Coverage:** `EXAMINED`, `EXCLUDED — reason`, `INACCESSIBLE — reason`, or `UNRESOLVED — reason`.
- **Alignment:** `ALIGNED`, `MISALIGNED`, or `NEUTRAL/UNKNOWN — reason`.

Coverage is not alignment. Split mixed components rather than averaging them. Every `MISALIGNED` component maps to a finding and revision disposition; every material `ALIGNED` component identifies what the revision must preserve. Use exhaustive language only when all in-scope artifacts and components are accounted for.

When bundle delivery and scale justify a machine-readable ledger, create `plan-component-alignment.tsv` with:

`component ID | plan path or section | coverage | alignment | evidence-backed reason | finding ID`

If the caller narrows scope, show omitted top-level groups as `EXCLUDED — out of scope (user-narrowed)` and make no whole-plan claim. For resistant evidence, stop when another materially different available approach would add no information, would exceed an applicable resource limit, or would create unjustified risk; then record the evidence as inaccessible or unresolved. Use `LIMITED` when useful supported work remains possible; use response-only `BLOCKED` when no responsible revision can be made.

## 3. Analyze plan quality with evidence

Apply these rules globally:

- Cite alignment, feasibility, scaling, measure, and finding claims with precise paths and sections, line ranges, quotations, observed results, or source anchors.
- Distinguish source-backed facts, direct observations, inferences, assumptions, and unknowns when the distinction affects a verdict.
- Mark material unsupported claims `[UNVERIFIED]`; do not use them as sole support for misalignment, infeasibility, scaling debt, or proxy drift.
- Re-open both sides before alleging a contradiction and verify referenced evidence before treating it as authoritative.
- Report positive aligned behavior and supported empty finding sets. Never invent conventional missing sections.

Determine whether the plan:

- traces requirements and constraints to the intended outcome;
- distinguishes evidence-backed facts from assumptions needing validation;
- chooses feasible scope and accounts for dependencies, prerequisites, sequencing, ownership, and decision gates;
- protects required safety, privacy, authority, compatibility, and irreversible-order constraints;
- defines deliverables and acceptance evidence capable of proving outcome success;
- uses milestones and measures without substituting activity for value;
- identifies material failure modes, contingencies, rollback or recovery, and unresolved decisions where needed;
- preserves method flexibility where no real dependency requires fixed procedure; and
- remains understandable and executable without hidden context.

Create one canonical record per finding. State the problem in plain language, exact evidence, causal harm to the outcome, impact and priority, benefit and cost of fixing, cost of delay, one concrete amendment or no-change or blocker, risk and reversibility, and the valid requirement or capability to preserve. Never invent precision.

### Plain-English decision guide

For every supported fixable `MISALIGNED` item, keep the complete decision together and answer:

1. What is wrong?
2. What does it mean for execution or the eventual result?
3. Who or what is affected, and why does it matter?
4. What happens if the plan does not change?
5. What amendment is recommended in behavioral or outcome terms?
6. What improves, and what tradeoffs, compatibility effects, costs, or new failure modes can result?
7. Why does the revision better serve the governing outcome or requirement?
8. What valid commitment or capability must remain intact?
9. What is the next decision or action, and what evidence would prove the revision worked?
10. What evidence supports the finding? Separately state what was observed or run, what remains untested or unknown, and whether the revision has been implemented and tested.

Use those questions as headings for consequential or complex decisions unless plan-specific wording is equally clear. Low-risk or repetitive items may be grouped in compact prose only when every decision field, evidence link, and disposition remains clear. Put technical evidence after the everyday-language explanation. A summary table may help prioritize amendments but cannot replace the guide. If no supported fixable misalignment exists, say so and distinguish that result from unresolved evidence.

## 4. Apply the model and compute scaling lens when relevant

First decide whether the plan governs AI or model work, encodes human procedures intended to substitute for model judgment, or contains mechanisms whose relative value may change with stronger models, search, learning, data, or computation. If not, record `Scaling-source status: N-A — reason` and do not force the analogy.

If applicable, read Richard Sutton's full canonical essay, “The Bitter Lesson,” at `http://www.incompleteideas.net/IncIdeas/BitterLesson.html` before attributing source claims. Record URL, access time, and evidence that the complete essay—not a snippet or remembered summary—was read. After a failed retrieval, retry only when a genuinely different available route could add information; stop when another attempt would not. Source failure blocks only Sutton-dependent conclusions; continue source-independent analysis, record `Scaling-source status: BLOCKED`, and mark the audit `LIMITED` when the missing source leaves a material obligation unmet.

Keep separate:

- **Sutton source claims** — only claims supported by quotations or precise anchors.
- **Plan-engineering translation** — clearly labeled applications to the target plan.

Do not attribute verification terminology, model-led exploration, answer-versus-method framing, or capability ratchets to Sutton unless the essay states them.

Classify relevant major prescriptions as `GAINS`, `APPROXIMATELY NEUTRAL`, `LOSES`, or `N-A — reason`. Cite target evidence, model and compute assumption, Sutton anchor, named translation, and causal rationale. For fixed human knowledge or procedure, state current benefit, scaling limit, and a more adaptive direction that preserves the outcome.

A plan necessarily constrains some methods. Do not flag real dependencies, external commitments, safety controls, irreversible ordering, machine interfaces, or evidence-backed decisions merely for being explicit.

## 5. Analyze measures and create the revised plan

Inventory material milestones, metrics, gates, thresholds, scores, completion signals, incentives, and optimization targets. Classify each as:

- `OUTCOME-FAITHFUL`
- `PROXY`
- `VANITY`

Claim proxy drift only with evidence that optimization pressure or plan behavior diverges from the intended outcome. A weak proxy without divergence evidence is not demonstrated drift.

Create a standalone revised-plan proposal, not an audit changelog. Preserve supported target-specific content. Give every supported finding a concrete amendment or explicit no-change or blocker disposition, outcome improvement, protected capability or requirement, qualitative or evidenced effort and cost, cost of delay, risk and reversibility, and linked assurance evidence when applicable.

The proposal must contain one of:

- a coherent revised plan;
- exact ordered amendments with insertion or replacement locations;
- an explicit preservation and no-amendment determination; or
- location-specific blockers and decisions still needed.

Do not invent missing decisions, overwrite the source, or replace one rigid methodology with another.

## 6. Build outcome evals and regressions when required

When repeatable assurance is needed, build artifacts that test the eventual result and protected requirements rather than plan text, task completion, or file presence.

Use:

- `BUILT-AND-RUN`
- `BUILT-NOT-RUN — reason`
- `NOT-BUILT — reason`

A goal-level evaluation must include representative acceptance cases, an oracle or repeatable judgment rule, expected evidence, pass and fail interpretation, prerequisites, exact instructions, and individual results when run. Include a case that distinguishes completed plan execution from genuine outcome success.

An early-warning regression must include an explicit baseline of outcome commitments, comparison operation, deterioration signal, missed-degradation and false-warning risks, trigger or cadence, and exact instructions.

Reuse or wrap adequate existing checks when the exact reference and interpretation are recorded. Run only when the source remains unmodified, external impact is absent or authorized, and outputs land in the designated delivery area. Never invent results. When an assurance artifact is materially required, `NOT-BUILT` prevents `COMPLETE`; `BUILT-NOT-RUN` may still permit `COMPLETE` when execution is unnecessary for the audit claim and the reason is justified.

## 7. Preserve source boundaries and deliver safely

Do not modify source plan files, referenced effective sources, implementation, prompts, documentation, tests, configuration, dependencies, version-control state, credentials, deployments, external systems, or private data. Do not install dependencies. Run checks only when non-mutation and external effects are understood and authorized.

For bundle delivery, create `<plan-name>-audit-<YYYY-MM-DD>/`, adding `-2`, `-3`, and so on rather than overwriting. Write only inside the bundle. Required files are:

- `plan-audit-report.md`
- `revised-plan-proposal.md`

Add `plan-component-alignment.tsv`, `evals/`, `regressions/`, integrity manifests, and an artifact manifest when the audit's scale, consequence, requested interface, or assurance claims require them. Do not create empty ceremonial artifacts.

For response delivery, return the complete report and revised plan under clear headings and create no files. Do not claim a bundle exists.

Use output states consistently:

- `Output status: RESPONSE-READY` — the complete response deliverables are present and no bundle was created.
- `Output status: BUNDLE-READY` — the bundle exists and its mandatory files are complete and readable.
- `Output status: FAILED — reason` — required output is absent, incomplete, unreadable, or unsafe.

## 8. Report, verify, and classify

Cover:

1. **Plan goal and executive summary** — target, intended outcome, bottom line, priority findings, cost of inaction, unknowns, detail dispositions, better and worse, and applicable scaling analysis.
2. **Component alignment and findings** — corpus coverage, aligned behavior, decision guide, technical evidence, feasibility and dependencies, scaling classifications, and measure analysis.
3. **Revised plan and assurance** — standalone proposal, full finding-to-disposition map, protected requirements, and eval or regression status and results.
4. **Coverage, verification, limitations, and questions** — unresolved items, operations, output checks, side-effect account, and only genuinely blocking questions.

State separately:

- `Audit completeness: COMPLETE | LIMITED | BLOCKED`
- `Plan alignment: ALIGNED | MISALIGNED | INDETERMINATE`
- `Scaling-source status: VERIFIED | BLOCKED | N-A — reason`

Use response-only `BLOCKED` for preflight, goal-authority, or output-boundary failure. Use `MISALIGNED` when at least one supported material misalignment exists; use `ALIGNED` only when coverage is sufficient and none exists; use `INDETERMINATE` when material unavailable evidence prevents either verdict. A finding-free result must still report aligned behavior and a proposal that preserves the plan or explains why no amendments are warranted.

Before finalizing, re-check citations, classifications, contradictions, feasibility claims, measures, amendment links, outputs, and every claimed result. Use fresh non-generator review when consequence or uncertainty warrants it and the runtime permits it; model agreement is supplementary, not proof.

Return output status, completeness, plan alignment, scaling status, material limitations, and the bundle path only when one was actually created.
