# Agentic Skill Audit

Audit one agentic skill against its local outcome, the parent harness's purpose, and model and compute scaling principles. A **skill** is a bounded capability package, workflow, plugin, prompt-and-tool unit, or other named execution feature exposed by an agentic system. Determine whether its complete package and direct execution path produce the intended user-visible outcome, remain trustworthy, and preserve value as models improve.

Keep the skill and inspected dependencies read-only. Recommend changes only when evidence supports them, and preserve every working capability.

## Input contract

The caller supplies:

- **Target skill:** a skill name plus harness root, a readable skill path, an immutable snapshot, or a complete supplied corpus.
- **Parent harness context:** optional purpose, governing architecture, and direct dependency locations when they are not discoverable from the target.
- **Output root:** optional parent directory for an external audit bundle.
- **Delivery mode:** optional `bundle` or `response`. Default to `response`; bundle writes require explicit caller selection or an explicitly supplied output root with clear file-delivery intent.
- **Additional details:** optional context, priorities, constraints, or deliverables.

Accept these values through the host system's native invocation format. Do not depend on positional arguments, slash commands, environment variables, one directory convention, or named tools. Use only capabilities actually exposed. If the target cannot be inspected, ask for an adequate snapshot or report the limitation. Never claim an unavailable read, write, fetch, test, review, or result.

Additional details cannot weaken evidence rules, coverage honesty, target-read-only behavior, artifact-status honesty, or verification. Record a concise safe disposition for each material detail. Ask a targeted question only when ambiguity could materially change goal, scope, authority, safety, or delivery.

## 1. Establish the local and parent outcomes

Infer the skill's **local goal** from current human-authored evidence such as its manifest, README, prompt assets, public description, contracts, examples, and applicable governing documentation. Express it as the user-visible outcome, not phases, files, scores, or implementation activity.

Infer or obtain the parent harness's purpose and explain how the skill contributes to it. Do not import a generic assistant goal when the target's governing sources state a different one.

If the local goal, parent relationship, or governing authority is absent, materially ambiguous, or contradicted across authoritative sources, stop objective-dependent analysis. Cite the gap or conflict, ask only what is needed, issue no alignment verdict, and create no full audit bundle. Tests and implementation do not silently override human-authored intent; ordinary implementation drift is a finding, not a goal-authority conflict.

Define observable **better** and **worse** for the skill in terms of outcome quality, evidence, reliability, effort, risk, user control, and parent-harness fit. Current metrics are possible evidence, not automatically the objective.

## 2. Bound the effective corpus

Audit the skill package and only the dependencies needed to understand its real execution. Adapt paths to the target. Normally include:

1. every authored file in the skill package;
2. its active registration, manifest, public interface, workflow, contracts, gates, budgets, retries, repair, recovery, and terminal behavior;
3. discovery, invocation, context assembly, and output delivery paths that directly govern the skill;
4. every agent, role, prompt layer, model selection, tool, child capability, configuration value, schema, script, or document the skill directly invokes or explicitly depends on;
5. existing tests, evals, regressions, measures, and completion signals that claim to protect the local outcome; and
6. current state needed to determine whether the skill is available, disabled, experimental, stale, or contradicted by documentation.

Do not expand into unrelated skills or a whole-harness audit. If a shared mechanism affects the target, inspect only the relevant path and label the finding `SHARED-FRAMEWORK` with its plausible blast radius; otherwise label it `SKILL-OWNED`.

Inventory dependencies, generated output, caches, private data, and vendor trees but exclude them unless they materially govern behavior. Record private exclusions by safe category and reason. Never inspect or reproduce credentials or personal records without separate explicit authorization and necessity.

For every discovered skill file and direct dependency unit, record:

- **Coverage:** `EXAMINED`, `EXCLUDED — reason`, `INACCESSIBLE — reason`, or `UNRESOLVED — reason`.
- **Alignment:** `ALIGNED`, `MISALIGNED`, or `NEUTRAL/UNKNOWN — reason`.

Coverage is not alignment. Split mixed components rather than averaging them. Missing optional machinery is not a defect unless an authoritative contract requires it. Every `MISALIGNED` row maps to a finding and plan disposition; every material `ALIGNED` row names the capability to preserve. Use exhaustive language only when the ledger accounts for the full effective corpus.

For resistant evidence, stop when another materially different available approach would add no information, would exceed an applicable resource limit, or would create unjustified risk; then mark it inaccessible or unresolved. If the missing evidence could materially change the local goal or verdict, report the blocker and ask for access; create no full bundle.

## 3. Assess outcomes, interfaces, and execution

Apply these evidence rules globally:

- Cite every behavioral, alignment, scaling, measure, and finding claim with a precise path and section, line range, symbol, test, observed command, or source anchor.
- Distinguish source-backed facts, direct observations, inferences, assumptions, and unknowns when that affects a verdict.
- Mark material unsupported claims `[UNVERIFIED]`; do not use them as sole support for misalignment, scaling debt, or proxy drift.
- A document proves stated intent, not runtime behavior. A test proves only exercised behavior. A static checker proves only its encoded rule.
- Re-open both sides before claiming contradiction, and confirm references and execution paths before calling material dead or unreachable.
- Report aligned behavior and supported empty finding sets. Do not manufacture defects.

Assess outcomes and interfaces rather than rewarding architectural ceremony. Determine, where applicable, whether:

- the manifest, README, public description, prompts, runtime registration, and completion contract agree on the local goal;
- every phase or mechanism earns its complexity and contributes causally to the outcome;
- tool authority, role boundaries, prompt or context layers, data and artifact handoff, and host-private boundaries match the target's current contracts;
- prompt or retrieved content cannot silently expand runtime authority;
- evidence and completion gates distinguish genuine success from plausible-looking output;
- retries change strategy, budgets end honestly, interruptions resume correctly, and blocked or high-consequence work escalates appropriately;
- outputs are complete, usable, and delivered through the declared interface;
- optional services fail honestly rather than becoming hidden dependencies;
- documentation and examples describe current availability and behavior;
- tests and evals exercise the user-visible outcome rather than only schemas, phases, or file presence; and
- a shared-framework issue has a demonstrated effect on the target, with target evidence and wider blast radius stated separately.

Classify supported findings against applicable dimensions:

- **Local outcome**
- **Grounded trust**
- **Execution fitness**
- **Controlled consequences**
- **Adaptability**
- **Parent-harness fit**

A domain-specific criterion is not drift merely because it is specialized. A safety control, external requirement, machine interface, or deterministic consequence boundary is not method debt merely because it constrains behavior.

## 4. Analyze model and compute scaling when relevant

First decide whether the skill contains AI or model behavior, encodes human procedures intended to substitute for model judgment, or includes mechanisms whose relative value may change with stronger models, search, learning, data, or computation. If not, record `Scaling-source status: N-A — reason` and do not force the analogy. Individual mechanisms inside a mixed skill may also be `N-A`.

When the module applies, read Richard Sutton's full canonical essay, “The Bitter Lesson,” at `http://www.incompleteideas.net/IncIdeas/BitterLesson.html` before attributing claims or issuing a source-dependent verdict. Record URL, access time, and evidence that the full essay—not a snippet, excerpt, cached paraphrase, or remembered summary—was read. After a failed retrieval, retry only when a genuinely different available route could add information; stop when another attempt would not. Omit Sutton-dependent claims if the source remains unavailable. Continue source-independent analysis, record `Scaling-source status: BLOCKED`, and mark the audit `LIMITED` when a material scaling obligation remains unmet.

Keep separate:

- **Sutton source claims** — only claims supported by the essay, with quotations or precise anchors.
- **Skill-engineering translation** — clearly labeled applications to skill prompts, orchestration, search, learning, tools, verification, and model-led work.

Do not attribute answer-versus-method framing, verification vocabulary, model-led exploration, or capability ratchets to Sutton unless the essay states them.

Classify each relevant major mechanism as `GAINS`, `APPROXIMATELY NEUTRAL`, `LOSES`, or `N-A — reason`. State the model and compute assumption, target evidence, causal rationale, and required action or protection.

For fixed human knowledge or procedure, identify:

- what is encoded;
- the current benefit and capability it supplies;
- why its relative value plateaus or obstructs stronger models; and
- a more adaptive direction that preserves the capability.

Prefer outcome and capability constraints over unnecessarily fixed reasoning methods. Prefer model-led search, exploration, learning, or tool use where they can improve with model capability and computation and where outcome evidence can verify them. Do not manufacture scaling violations from explicit structure alone.

## 5. Build findings, analyze measures, and create a capability-safe plan

Create one canonical record per finding with a stable ID. State:

- `SKILL-OWNED` or `SHARED-FRAMEWORK` and exact evidence;
- the problem and causal harm to the local outcome, parent purpose, or authoritative contract;
- affected outcome dimensions;
- whether it constrains the **answer or outcome**, prescribes the **method**, or is `N-A — reason`;
- impact and priority;
- benefit, effort, cost, and risk of fixing it;
- consequence and detection path if not fixed;
- one concrete change or explicit blocker, no-change, or accepted-debt disposition; and
- the working capability that must not regress.

### Plain-English decision guide

For every supported fixable `MISALIGNED` item, keep the complete decision together and answer:

1. What is wrong?
2. What does it mean in normal use?
3. Who or what is affected, and why does it matter?
4. What happens if nothing changes?
5. What behavioral change is recommended?
6. What improves, and what tradeoffs, compatibility effects, cross-skill consequences, costs, or new failure modes can result?
7. Why does the change better serve the local goal and parent purpose?
8. What working capability must remain intact?
9. What is the next decision or action, and what evidence would prove the fix worked?
10. What evidence supports the finding? Separately state what was observed or run, what remains untested or unknown, and whether the fix has been implemented and tested.

Use those questions as headings for consequential or complex decisions unless skill-specific wording is equally clear. Low-risk or repetitive items may be grouped in compact prose only when every decision field, evidence link, and disposition remains clear. Put technical paths and IDs after the everyday-language explanation. A summary table may help prioritize work but cannot replace the guide. If no supported fixable misalignment exists, say so and distinguish that result from unexamined or unresolved areas.

Inventory material current and proposed metrics, gates, thresholds, scores, completion signals, incentives, and optimization targets. Classify each as `OUTCOME-FAITHFUL`, `PROXY`, or `VANITY`. Claim proxy drift only with evidence that optimization pressure or observed behavior has diverged from the intended outcome.

Produce a standalone capability-safe improvement plan. Every `MISALIGNED` component and `LOSES` mechanism maps to a concrete change or explicit no-change reason, outcome improvement, protected capability, effort and cost, cost of delay, risk and reversibility, and linked assurance. Keep shared-framework changes separate and state their cross-skill blast radius. No finding may be orphaned.

## 6. Build outcome evals and regressions

Build complete repeatable artifacts when bundle delivery is authorized. They protect the local outcome and working capabilities, not exact wording, phase count, or implementation shape.

Use:

- `BUILT-AND-RUN`
- `BUILT-NOT-RUN — reason`
- `NOT-BUILT — reason`

A goal-level evaluation must include representative inputs, an oracle or repeatable judgment rule, expected evidence, pass and fail interpretation, prerequisites, exact instructions, and individual results when run. Add enough coverage to protect every capability affected by the plan.

An early-warning regression must include an explicit baseline, comparison operation, deterioration signal, missed-degradation and false-warning risks, trigger or cadence, and exact instructions.

Reuse or wrap adequate existing checks when the exact target reference and interpretation are recorded. Run only when the skill and dependencies remain unmodified, external impact is absent or authorized, and all outputs remain in the designated delivery area. Never invent results. `NOT-BUILT` on a required artifact prevents `COMPLETE`; `BUILT-NOT-RUN` may still permit `COMPLETE` when execution is unnecessary for the audit claim and the reason is justified.

For response delivery, provide complete reusable specifications when possible, but label them `NOT-BUILT` unless they were actually materialized in an authorized output location.

## 7. Preserve target boundaries and deliver safely

The skill and inspected dependencies are read-only. Do not modify source, prompts, documentation, tests, configuration, dependencies, version-control state, credentials, deployments, external systems, or private records. Do not install dependencies. Runtime-created sessions, logs, or model-review records do not authorize target changes. Sanitize all durable output.

For bundle delivery, resolve target and output boundaries before writing. Create `<skill-name>-audit-<YYYY-MM-DD>/`, adding `-2`, `-3`, and so on rather than overwriting. The bundle must be outside the union of the skill package, every inspected local dependency, and any read-only parent project root. If no such output area is authorized, use response delivery or ask for an external output root. The bundle must contain:

- `skill-audit-report.md`
- `skill-component-alignment.tsv`
- `evals/`
- `regressions/`
- `artifact-manifest.md`

Add before and after target manifests when a net source-integrity claim is material. Matching manifests prove only equal observed end states, not absence of transient writes.

For response delivery, return the complete report, component ledger, improvement plan, and assurance specifications as labeled sections. Create no files and do not claim a bundle exists. If response delivery prevents an applicable assurance obligation, use `LIMITED`.

Use output states consistently:

- `Output status: RESPONSE-READY` — the complete response deliverables are present and no bundle was created.
- `Output status: BUNDLE-READY` — the bundle exists and all required files and directories are complete and readable.
- `Output status: FAILED — reason` — required output is absent, incomplete, unreadable, or unsafe.

## 8. Report and terminal states

Write four top-level parts:

1. **Skill goal and executive summary** — target, local and parent goals, bottom line, priority issues, actions, cost of inaction, unknowns, better and worse, detail dispositions, and scaling source and translation.
2. **Component alignment and findings** — corpus summaries, aligned capabilities, decision guide, technical evidence, scaling ledger, and measure ledger.
3. **Capability-safe plan and assurance** — skill-owned and shared-framework changes separated, protected capabilities, and linked eval and regression status and results.
4. **Coverage, verification, limitations, and questions** — scope, coverage ledger, inaccessible or unresolved items, operations, integrity evidence, output checks, and genuinely blocking questions.

State separately:

- `Audit completeness: COMPLETE | LIMITED | BLOCKED`
- `Skill alignment: ALIGNED | MISALIGNED | INDETERMINATE`
- `Scaling-source status: VERIFIED | BLOCKED | N-A — reason`

Before finalizing, re-open cited evidence; re-check classifications, contradictions, non-functioning claims, measure verdicts, plan links, and artifacts; and verify every finding has a disposition, capability protection, and assurance link. Use a fresh non-generator reviewer for high-impact, shared-framework, security, authority, or otherwise consequential recommendations when the runtime permits it. Model review is supplementary scrutiny, not independent proof.

Use:

- `BLOCKED` — missing or invalid target, unclear local goal or parent relationship, material corpus blocker, or unsafe output boundary that prevents responsible assessment.
- `LIMITED` — useful output exists, but a material corpus, scaling-source, assurance, review, or integrity obligation remains unmet.
- `COMPLETE` — all applicable obligations are satisfied at the declared scope.

Use `MISALIGNED` when at least one supported material misalignment exists; use `ALIGNED` only when coverage is sufficient and none exists; use `INDETERMINATE` when material unavailable evidence prevents either verdict. Findings affect skill alignment, not audit completeness. A finding-free audit must still report supported aligned behavior and baseline assurance.

Return output status, completeness, alignment, scaling status, material limitations, and the bundle path only when one was actually created.
