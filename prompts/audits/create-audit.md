# Audit Prompt Creator

Create or capability-preservingly revise one self-contained audit prompt. Preserve target-specific audit quality, require evidence appropriate to the audited object, and avoid forcing irrelevant framework ceremony into every audit.

## Input contract

The caller supplies:

- **Mode:** `create` or `revise`.
- **Audit domain or source prompt:** a bounded domain description for creation, or the complete existing prompt or readable path for revision.
- **Delivery:** optional writable output path or `response`. Default to `response`; writing requires an explicit output path.
- **Additional requirements:** optional context, constraints, priorities, or deliverables.

Accept these through the host system's native invocation format. Do not depend on positional arguments, slash commands, environment variables, repository layout, prompt-frontmatter conventions, or named tools. If a required value is missing or ambiguous, ask the minimum targeted question. Use only capabilities actually exposed by the runtime, and never claim an unavailable read, write, fetch, review, or test.

Additional requirements may not weaken objective clarity, evidence integrity, coverage honesty, target-side-effect rules, capability preservation, or status honesty. Record a concise safe disposition for each material requirement. Redact secrets, personal data, authorization material, sensitive payloads, and unnecessary private path segments.

## 1. Mode contract

### Create

Establish the audit object, authoritative goal sources, behavior-affecting corpus, component grain, evidence types, side-effect mode, outputs, and meaningful failure branches. Ask only for decisions that would materially change the prompt's purpose, authority, safety, or deliverable.

### Revise

Read the existing prompt completely. Treat it as a capability bundle, not disposable prose. Before drafting, create a preservation ledger covering every material existing:

- goal and goal-authority rule;
- target, corpus, and dependency boundary;
- evidence, anti-fabrication, and uncertainty rule;
- coverage and exhaustive-claim limit;
- stopping or partial-result branch;
- safety, privacy, authority, and side-effect constraint;
- supported aligned and empty-result behavior;
- finding, prioritization, recommendation, risk, and reversibility contract;
- target-specific rubric, output, artifact, and machine interface;
- evaluation, regression, verification, and completion obligation; and
- readability and decision-usability requirement.

Mark each `PRESERVE`, `REPHRASE`, `GENERALIZE WITHOUT LOSS`, `REPLACE — protection`, or `REMOVE — caller-authorized reason`. Do not remove or weaken a capability merely to shorten the prompt or match a preferred template.

## 2. Universal audit core

Every generated prompt must enforce these behaviors, adapted to its target rather than copied mechanically:

1. **Desired outcome** — establish the actual overarching outcome from caller or target evidence. Define observable better and worse without substituting tasks, files, phases, counts, scores, or current metrics.
2. **Goal clarity** — when the objective or its authority is absent, materially ambiguous, or contradicted, stop objective-dependent analysis, cite the gap, and ask targeted questions rather than inventing a goal.
3. **Causal alignment** — findings identify exact evidence and explain how the issue harms the outcome or contradicts an authoritative requirement. Positive aligned behavior and supported empty finding sets are valid.
4. **Bounded coverage** — declare the effective corpus and track `EXAMINED`, `EXCLUDED — reason`, `INACCESSIBLE — reason`, and `UNRESOLVED — reason`. Separate coverage from alignment where classification matters. Make exhaustive claims only when the ledger supports them.
5. **Evidence integrity** — use precise re-checkable citations; distinguish source-backed facts, tool observations, inferences, assumptions, and unknowns when decision-relevant; mark material unsupported claims `[UNVERIFIED]`; never base a negative verdict solely on them.
6. **Decision-ready recommendations** — map every finding to a concrete behavioral change or explicit no-change or blocker disposition. Protect working capabilities, state benefit, cost, risk, and cost of delay, and prefer reversible changes.
7. **Side-effect clarity** — define exactly what may be read, executed, created, modified, or deleted. Prompt text grants no runtime authority. Protect credentials, private data, external systems, and the audited target. State where intentional outputs and incidental runtime records may exist.
8. **Human decision usability** — write the primary report for a reasonably educated reader with no prior knowledge of the target or audit vocabulary. Begin with a plain-language summary, define necessary terms, explain tables, and put technical citations after the everyday-language explanation they support.
9. **Verification** — re-check cited evidence, outputs, unresolved items, and side-effect claims. Use fresh non-generator review when consequence or uncertainty justifies it, but treat model agreement as supplementary rather than independent proof.
10. **Harness independence** — describe semantic inputs, required capabilities, and output contracts without assuming one vendor, model, command syntax, tool name, filesystem root, artifact protocol, or prompt assembly scheme. When the target itself is harness-specific, audit those specifics as target evidence rather than making them a requirement of the audit prompt.

### Plain-English decision guide requirement

Every generated prompt must require one easy-to-find decision guide. For each supported fixable misalignment or gap, it must answer together:

- What is wrong?
- What does it mean in normal operation, with an example when useful?
- Who or what is affected, and why does it matter?
- What happens if nothing changes?
- What behavioral change is recommended?
- What improves, and what tradeoffs, compatibility effects, costs, or new failure modes can result?
- Why does the change better serve the governing outcome or requirement?
- What working capability must remain intact?
- What is the next decision or action, and what evidence would prove the change worked?
- What evidence supports the finding? Separately state what was observed or run, what remains untested or unknown, and whether the proposed fix was implemented and tested.

Use those questions as headings for consequential or complex decisions unless target-specific wording is equally clear. Low-risk or repetitive items may be grouped in compact prose only when every decision field, evidence link, and disposition remains clear. A table may summarize priority but cannot replace the explanations. If no supported fixable item exists, say so and distinguish that result from unexamined or unresolved areas.

The generated prompt must define behavior for missing targets, unclear goals, narrowed or inaccessible corpus, finding-free targets, genuine findings, unsafe or unavailable checks, incomplete verification, and output failure. Do not mandate arbitrary phase counts, retry counts, taxonomies, or report sections unless they protect a real target-specific capability or interface.

## 3. Conditional modules

Include a module only when the target has the relevant relationship or the caller explicitly requests it. Explain inclusion and omission in the design decisions.

### Model and compute scaling; the Bitter Lesson

Use when the target contains AI or model behavior, human-coded procedures intended to substitute for model judgment, or mechanisms whose relative value may change with stronger models, more search, learning, data, or computation.

When included, require the audit to:

- fetch and read Richard Sutton's full canonical essay at `http://www.incompleteideas.net/IncIdeas/BitterLesson.html` before attributing claims;
- keep **Sutton source claims** separate from the **domain engineering translation**;
- limit only source-dependent conclusions if the essay cannot be verified as complete;
- classify relevant mechanisms as `GAINS`, `APPROXIMATELY NEUTRAL`, `LOSES`, or `N-A — reason`;
- identify fixed human knowledge or procedure, current benefit, scaling limit, and a capability-preserving alternative; and
- avoid misclassifying safety controls, external requirements, machine interfaces, or deterministic consequence boundaries as scaling debt.

The engineering translation should favor outcome and capability constraints over unnecessarily fixed reasoning procedures; model-led exploration, search, learning, or tool use where they can improve with capability and compute; measured feedback and verification; and replacement of brittle scaffolding only when outcome evidence protects what it currently does well. Do not attribute these engineering translations to Sutton unless the essay itself states them.

### Measures and proxy drift

Use when the target has or proposes metrics, gates, thresholds, scores, incentives, completion signals, or optimization loops. Classify material measures as `OUTCOME-FAITHFUL`, `PROXY`, or `VANITY`. Claim proxy drift only with evidence of divergence, gaming pressure, or goal displacement. Scrutinize measures proposed by the audit too.

### Evaluation and regression artifacts

Use when repeatable acceptance evidence or early warning materially improves the audit outcome, especially for consequential or implementation-facing recommendations. Require complete reusable artifacts rather than TODOs: representative cases, oracle or repeatable judgment rule, expected evidence, exact instructions, baseline and comparison, deterioration signal, missed-degradation risk, and false-warning risk.

Use `BUILT-AND-RUN`, `BUILT-NOT-RUN — reason`, and `NOT-BUILT — reason`. Permit wrapping adequate existing checks. If the target is read-only, place new artifacts in a separate output bundle. If no writes are authorized, report the limitation instead of calling proposed artifacts built.

A **full framework** request includes all three modules. Otherwise relevance—not habit—decides.

## 4. Adapt the prompt to its target

The candidate must state:

- the audit object and goal-source hierarchy;
- the effective corpus and direct-dependency boundary;
- the classification unit and evidence needed for behavioral claims;
- applicable conditional modules and their target-specific translation;
- the side-effect contract and terminal branches;
- the report and artifact interface, with stable names only where users or machines depend on them;
- the plain-English decision guide and location of deeper technical evidence; and
- completion evidence that supports every completion claim.

For artifact-producing audits, use one collision-safe bundle. If the caller provides no output root, use a harness-designated writable workspace area or an `audits/` directory under a caller-designated workspace when safe. Produce `<target-name>-audit-<YYYY-MM-DD>/` and append `-2`, `-3`, and so on rather than overwriting. Resolve paths before writing, keep output external to the audited target, sanitize logs, and report the created path.

For response-only audits, create no files and clearly label the same required deliverables in the response.

Use `BLOCKED` for a response-only preflight or goal-authority failure; `LIMITED` for useful output with a material unmet applicable obligation; and `COMPLETE` only when all applicable obligations are satisfied. A justified `BUILT-NOT-RUN` may still be complete. When the scaling module applies, use `Scaling-source status: VERIFIED`, `BLOCKED`, or `N-A`.

## 5. Required creator output

Deliver:

1. **Design decisions** — mode, target, inferred purpose, goal sources, corpus strategy, modules, side effects, delivery, outputs, and blocking assumptions.
2. **Capability-preservation ledger** — revise mode only.
3. **Candidate prompt** — complete Markdown, self-contained, with no hidden framework references or unresolved placeholders. Optional metadata must be portable and nonessential.
4. **Change and risk summary** — additions, preserved, replaced, and removed behavior; unresolved tradeoffs; and likely regression risks.
5. **Verification** — confirm self-containment, harness independence, goal-unclear stopping behavior, bounded coverage, evidence integrity, side-effect consistency, module applicability, capability preservation, and readiness. Confirm that a non-specialist can understand each problem, consequence, proposed change, tradeoff, alignment benefit, next action, and proof status without reading a component matrix or source code.

If verification finds a correctable gap, revise before delivery. If it requires a user decision, stop and ask rather than claim readiness.

## 6. Write behavior

If delivery is omitted or `response`, return the verified candidate and write nothing.

If the caller supplies a nonexisting output path and write access is authorized, require a writable existing or safely creatable parent, write exactly the verified candidate, and report the resolved path.

If an output path already exists, present the completed candidate, preservation ledger when applicable, and change summary first. Require explicit confirmation before replacing that exact path. Never silently choose a sibling path, merge content, or destroy an existing file.

Report one output state:

- `Output status: RESPONSE-READY` — the complete candidate is present in the response and no file was created.
- `Output status: FILE-READY` — the requested file was created and verified as complete and readable.
- `Output status: FAILED — reason` — the required output could not be completed safely.
