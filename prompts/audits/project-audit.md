# Project Outcome Audit

Audit a project against the real outcome it exists to produce. Examine purpose, behavior, evidence, measures, operational boundaries, and—when applicable—model and compute scaling risks. Keep the target project read-only and produce a capability-safe improvement plan.

## Input contract

The caller supplies:

- **Target project:** a readable project directory or a complete project snapshot supplied through the host system.
- **Output root:** optional parent directory for an external audit bundle.
- **Delivery mode:** optional `bundle` or `response`. Default to `response`; bundle writes require explicit caller selection or an explicitly supplied output root with clear file-delivery intent.
- **Additional details:** optional context, constraints, priorities, scope limits, or deliverables.

Accept these through the host system's native invocation format. Do not depend on positional arguments, slash commands, environment variables, repository layout, or named tools. Use only capabilities actually exposed. If the target cannot be inspected, ask for an adequate snapshot or report the limitation. Never claim an unavailable read, write, fetch, test, review, or result.

Additional details cannot weaken evidence integrity, coverage honesty, target-read-only behavior, artifact-status honesty, or verification. Record a concise safe disposition for each material detail and redact secrets, personal data, authorization material, sensitive payloads, and unnecessary private path segments.

## 1. Preflight and establish the project's outcome

Confirm that the target is a readable project and that the intended delivery is safe. For bundle delivery, resolve the target and output paths before writing. The bundle must be outside the target. If no output root is supplied, use a harness-designated writable workspace area outside the target, or ask for one. Never infer an operator-specific absolute path.

Derive one concise governing user-visible or real-world outcome—or an explicit hierarchy or tradeoff rule for legitimately co-equal outcomes—from direct caller statements and current human-authored project evidence: purpose, requirements, decisions, interfaces, and governing documentation. Explain the authority relationship. Human-authored intent does not become runtime behavior merely because it is documented, and implementation drift does not silently redefine the goal.

If the goal, its authority, or a decision-relevant priority is absent, materially ambiguous, or contradicted, stop objective-dependent work. Cite the gap or conflict, ask only what is needed, and create no bundle. Do not infer a business model, persona, or generic project goal.

Define observable **better** and **worse** in terms of the real outcome, evidence, reliability, effort, risk, and affected users—not feature count, tasks closed, files produced, test count, schedule, or model score unless evidence establishes that measure as outcome-faithful.

## 2. Bound and classify the effective corpus

Inventory the project-authored, behavior-affecting tree. Adapt the corpus to the project's technology and purpose while normally covering, when present:

- purpose, requirements, decisions, interfaces, examples, and documentation;
- source, architecture, scripts, hooks, workflows, and build, deploy, or operations configuration;
- tests, evals, regressions, metrics, telemetry, feedback, and optimization loops;
- AI agents, prompts, models, providers, skills, tools, memory, orchestration, or automation;
- manifests, lockfiles, dependencies, integration boundaries, and shipped generated assets; and
- dead, deprecated, placeholder, contradictory, unreachable, or non-functioning project-authored material.

Inventory but normally exclude dependencies, caches, local builds, vendored source, secrets, personal data, and ignored work-in-progress. Record private exclusions only by safe category and reason. Include a dependency or generated artifact only when it materially controls current behavior.

Choose disjoint, reproducible component units appropriate to the target: for example, one package, service, application, prompt, agent, skill, source subsystem, documentation tree, workflow, or configuration group. Classify each once and record cross-cutting relationships separately.

For every unit, record:

- **Coverage:** `EXAMINED`, `EXCLUDED — reason`, `INACCESSIBLE — reason`, or `UNRESOLVED — reason`.
- **Alignment:** `ALIGNED`, `MISALIGNED`, or `NEUTRAL/UNKNOWN — reason`.

Coverage is not alignment. Split mixed units rather than averaging them. Missing optional machinery is not a defect unless an authoritative requirement makes its absence harmful. Every `MISALIGNED` unit maps to a finding and plan disposition; every material `ALIGNED` unit names the capability to preserve. Claim whole-project or exhaustive coverage only when every in-scope unit is accounted for at the declared grain.

When bundle delivery and scale justify a machine-readable ledger, create `project-component-alignment.tsv` with:

`component ID | component or path | coverage | alignment | evidence-backed reason | finding ID`

If the caller narrows scope, show omitted authored surfaces by top-level group or safe category as `EXCLUDED — out of scope (user-narrowed)` and make no whole-project claim. For resistant evidence, stop when another materially different available approach would add no information, would exceed an applicable resource limit, or would create unjustified risk; then classify it as inaccessible or unresolved. Use `LIMITED` when useful supported work remains possible; use response-only `BLOCKED` when the gap prevents responsible assessment.

## 3. Build evidence-supported findings

Apply these rules globally:

- Cite behavioral, alignment, scaling, measure, and finding claims with precise paths and sections, line ranges, symbols, observed results, or source anchors.
- Distinguish source-backed facts, direct observations, inferences, assumptions, and unknowns when that affects a verdict.
- Mark material unsupported claims `[UNVERIFIED]`; do not use them as sole support for misalignment, scaling debt, or proxy drift.
- Documents prove stated intent, tests prove only exercised behavior, and static checks prove only encoded rules.
- Re-open both sides before alleging a contradiction and confirm references and execution paths before calling material dead.
- Report positive aligned behavior and supported empty finding sets. Never manufacture defects.

Create one canonical record per finding. State the problem in plain language, exact evidence, causal harm to the project outcome, impact and priority, benefit and cost of fixing, cost of delay, one concrete change or no-change or blocker, risk and reversibility, and the working capability that must not regress. Never invent precision.

### Plain-English decision guide

For every supported fixable `MISALIGNED` item, keep the complete decision together and answer:

1. What is wrong?
2. What does it mean in normal operation?
3. Who or what is affected, and why does it matter?
4. What happens if nothing changes?
5. What behavioral change is recommended?
6. What improves, and what tradeoffs, compatibility effects, costs, or new failure modes can result?
7. Why does the change better serve the project's governing outcome?
8. What working capability must remain intact?
9. What is the next decision or action, and what evidence would prove the fix worked?
10. What evidence supports the finding? Separately state what was observed or run, what remains untested or unknown, and whether the proposed fix has been implemented and tested.

Use these questions as headings for consequential or complex decisions unless project-specific wording is equally clear. Low-risk or repetitive items may be grouped in compact prose only when every decision field, evidence link, and disposition remains clear. Put technical evidence after the everyday-language explanation. A summary table may help prioritize work but cannot replace the guide. If no supported fixable misalignment exists, say so and distinguish that result from unexamined or unresolved areas.

## 4. Apply the model and compute scaling lens when relevant

First decide whether the target contains AI or model behavior, human-coded procedures intended to substitute for model judgment, or mechanisms whose relative value may change with stronger models, search, learning, data, or computation. If not, record `Scaling-source status: N-A — reason` and do not force the analogy.

If applicable, read Richard Sutton's full canonical essay, “The Bitter Lesson,” at `http://www.incompleteideas.net/IncIdeas/BitterLesson.html` before attributing source claims. Record URL, access time, and evidence that the full essay—not a snippet or remembered summary—was read. After a failed retrieval, retry only when a genuinely different available route could add information; stop when another attempt would not. Source failure blocks only Sutton-dependent conclusions. Continue source-independent analysis, record `Scaling-source status: BLOCKED`, and mark the audit `LIMITED` when a material applicable obligation remains unmet.

Keep separate:

- **Sutton source claims** — only claims supported by quotations or precise anchors.
- **Project-engineering translation** — clearly labeled applications to the target project.

Do not attribute verification terminology, model-led exploration, answer-versus-method framing, or capability ratchets to Sutton unless the essay states them.

Classify relevant major mechanisms as `GAINS`, `APPROXIMATELY NEUTRAL`, `LOSES`, or `N-A — reason`. State the model and compute assumption, target evidence, Sutton anchor, named translation, causal rationale, and action or protection. For fixed human knowledge or procedure, identify current benefit, scaling limit, and a capability-preserving alternative.

Favor outcome and capability constraints over unnecessarily fixed reasoning methods, and model-led search, learning, or tool use where outcome evidence supports them. Do not flag safety controls, external requirements, machine interfaces, or deterministic consequence boundaries merely because they constrain behavior.

## 5. Analyze measures and produce a capability-safe plan

Inventory material current and proposed metrics, gates, thresholds, scores, completion signals, incentives, and optimization targets. Classify each as:

- `OUTCOME-FAITHFUL`
- `PROXY`
- `VANITY`

Claim proxy drift only with evidence that optimization pressure or observed behavior diverges from the intended outcome. A weak proxy alone is not demonstrated drift. Scrutinize measures proposed by the audit too.

Produce a self-contained improvement plan. Map every supported finding, `MISALIGNED` component, and `LOSES` mechanism to a concrete change or explicit no-change reason, outcome improvement, protected capability, qualitative or evidenced effort and cost, cost of delay, risk and reversibility, and linked assurance evidence when applicable. One plan item may address several findings; no finding may be orphaned.

Prefer reversible changes. Do not recommend replacing a working mechanism without stating how outcome evaluation and regression evidence will protect the capability it currently provides.

## 6. Build outcome evals and regressions when required

When repeatable assurance is needed, build artifacts that test the real project outcome and protected capabilities rather than file presence, task completion, or implementation shape.

Use:

- `BUILT-AND-RUN`
- `BUILT-NOT-RUN — reason`
- `NOT-BUILT — reason`

A goal-level evaluation must include representative cases, an oracle or repeatable judgment rule, expected evidence, pass and fail interpretation, prerequisites, exact instructions, and individual results when run. Include a case that distinguishes completed work from genuine outcome success.

An early-warning regression must include an explicit baseline, comparison operation, deterioration signal, missed-degradation and false-warning risks, trigger or cadence, and exact instructions.

Reuse or wrap adequate existing checks when the exact reference and interpretation are recorded. Run only when the target remains unmodified, external impact is absent or authorized, and every intended output lands in the designated delivery area. Never invent results. When an assurance artifact is materially required, `NOT-BUILT` prevents `COMPLETE`; `BUILT-NOT-RUN` may still permit `COMPLETE` when execution is unnecessary for the audit claim and the reason is justified.

## 7. Preserve target boundaries and deliver safely

The target project is read-only. Do not create or modify source, prompts, documentation, tests, configuration, dependencies, version-control state, credentials, deployments, external systems, or private data inside it. Do not install dependencies. Run existing checks only when their non-mutation and external effects are understood and authorized. Runtime-created session or log records do not grant permission to alter the target.

For bundle delivery, create `<project-name>-audit-<YYYY-MM-DD>/`, adding `-2`, `-3`, and so on rather than overwriting. Write only inside the external bundle. Required files are:

- `project-audit-report.md`
- `project-component-alignment.tsv`

Add `evals/`, `regressions/`, integrity manifests, and `artifact-manifest.md` when scale, consequence, requested interface, or assurance claims require them. Do not create empty ceremonial artifacts. Sanitize logs and outputs.

For response delivery, return the complete report, component ledger, and improvement plan as labeled sections and create no files. Do not claim a bundle exists.

Use output states consistently:

- `Output status: RESPONSE-READY` — the complete response deliverables are present and no bundle was created.
- `Output status: BUNDLE-READY` — the bundle exists and its mandatory files are complete and readable.
- `Output status: FAILED — reason` — required output is absent, incomplete, unreadable, or unsafe.

## 8. Report, verify, and classify

Cover:

1. **Project goal and executive summary** — target, purpose, bottom line, priority findings, cost of inaction, unknowns, detail dispositions, better and worse, and applicable scaling analysis.
2. **Component alignment and findings** — corpus summary, aligned behavior, decision guide, technical evidence, scaling classifications, and measure analysis.
3. **Capability-safe plan and assurance** — improvement plan, protected capabilities, and eval or regression inventory, status, commands, and results.
4. **Coverage, verification, limitations, and questions** — coverage ledger, unresolved items, operations, output checks, side-effect account, and only genuinely blocking questions.

State separately:

- `Audit completeness: COMPLETE | LIMITED | BLOCKED`
- `Target alignment: ALIGNED | MISALIGNED | INDETERMINATE`
- `Scaling-source status: VERIFIED | BLOCKED | N-A — reason`

Use response-only `BLOCKED` for preflight, goal-authority, or output-boundary failure. Use `MISALIGNED` when at least one supported material misalignment exists; use `ALIGNED` only when coverage is sufficient and none exists; use `INDETERMINATE` when material unavailable evidence prevents either verdict. Findings affect target alignment, not audit completeness. A finding-free result must still preserve supported aligned behavior and state what was and was not examined.

Before finalizing, re-check citations, classifications, contradictions, measure verdicts, plan links, output files, and every claimed result. Use fresh non-generator review when consequence or uncertainty warrants it and the runtime permits it; model agreement is supplementary, not proof.

Return output status, completeness, target alignment, scaling status, material limitations, and the bundle path only when one was actually created.
