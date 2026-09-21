# Integrate the Session-Aware Prompt Enhancer

Implement an opt-in prompt-enhancement path in a caller-designated agentic harness. Use `prompt-enhancer.md` as the enhancement methodology. Do not copy another platform's extension code or assume its event names, session format, model SDK, configuration system, or repository layout.

The desired user experience is:

1. A user ends a direct interactive prompt with a trailing enhancement token such as `-i`.
2. The harness removes the token and makes one bounded model call that receives the enhancement methodology, authorized prior context from the same active session, and the raw prompt.
3. A valid rewrite replaces the current user message and executes immediately in the same session.
4. Any enhancement failure runs the flag-stripped raw prompt instead. The enhancement feature must not break the user's input path.
5. Prompts without the token behave exactly as they did before the integration.

This file is an implementation brief for an agent, not runtime code.

## Caller inputs

Obtain or discover:

- the target harness source or extension workspace;
- its supported pre-dispatch input interception or middleware mechanism;
- its canonical active-session context API;
- its model-completion API and successful terminal states;
- its distinction between human-interactive and programmatic input;
- its cancellation, timeout, UI, configuration, logging, privacy, and retention conventions;
- the caller's chosen trigger, defaulting to a trailing `-i` token;
- the approved enhancement model or model-selection rule;
- the methodology file's location in the consuming project; and
- any target-specific tests, packaging, or documentation requirements.

Apply caller-supplied integration instructions when they do not conflict with higher-priority policy, actual runtime constraints, privacy protections, or the behavioral contract below. If a missing fact could change data exposure, source eligibility, message authority, or the ability to replace input safely, ask the smallest targeted question before implementation. Infer ordinary naming and file placement only after inspecting the target.

## Explore the target before choosing an adapter

Find the host-native answers to these questions:

1. Where can a direct user message be observed before it is persisted or dispatched to the main model?
2. Can that surface replace the text while retaining the original user-role authority?
3. How does the harness identify direct interactive input, programmatic or injected input, replay, follow-up queues, and mid-stream steering?
4. What active context does the main model actually receive after compaction, branching, exclusions, or summarization?
5. Which context entries are safe and useful to serialize for a second model call?
6. How are model credentials, provider data boundaries, cancellation, deadlines, and completion states handled?
7. How can the integration record non-sensitive operational outcomes without copying private conversation content into general logs?
8. Which test seams can inject a fake completion provider and a fake session so the behavior is verifiable offline?

Prefer the smallest native adapter that satisfies the contract. If the host cannot replace a user message before dispatch, report that limitation and propose the closest honest alternative; do not pretend a post-dispatch hook is equivalent.

## Trigger and source contract

Use one documented trailing token. With the default `-i` behavior:

- activation requires a nonempty prompt followed by whitespace and the final token `-i`;
- trailing whitespace after the token may be accepted;
- `-i` inside a word, inside the prompt, or followed by other non-whitespace content does not activate enhancement;
- a bare token or whitespace plus the token is not a valid activation and remains unchanged;
- unflagged input is byte-for-byte unchanged; and
- once a nonempty valid activation is recognized, the trigger is consumed on every downstream path, including fallback.

Define the canonical raw prompt deterministically: remove trailing whitespace after the token, remove the token, and remove the entire whitespace run that immediately separated the token from the preceding content; preserve every earlier byte. For example, `do X   -i  ` becomes exactly `do X`.

Gate source eligibility before reading history or calling a model. By default, enhance only direct human-interactive submissions. Do not activate on tool output, model-generated messages, remote or RPC injection, replay, extension-generated prompts, background jobs, or mid-stream steering. A consuming harness may deliberately broaden this policy only through an explicit, tested configuration that prevents recursive enhancement.

For a recognized direct prompt in a noninteractive or headless execution path, the safe default is to strip the trigger and run the raw prompt without reading session history or calling the enhancer. Document a different policy only when the caller explicitly requires it.

The default contract executes an accepted rewrite immediately without a preview or second confirmation because the trailing token is the user's opt-in. A preview workflow is a different interaction contract and requires an explicit caller decision.

## Session-context contract

Use the harness's canonical compaction-aware active-session view—the same effective conversational context the executing model will receive—as the source inventory. Build the enhancer payload from the filtered, policy-approved subset described below; do not automatically serialize the entire view. Do not read arbitrary session files, global history, another conversation, long-term memory, repository notes, or ambient state merely because it is accessible.

Preserve chronology and provenance. Include only text needed to resolve references and established constraints, such as:

- user-visible user and assistant messages;
- relevant compaction or branch summaries;
- bounded tool calls or results when they establish the referent; and
- other context-bearing entries the main model legitimately sees.

Exclude or replace with safe markers:

- host system or developer prompts, private harness instructions, and policy internals;
- hidden reasoning or model scratchpads;
- raw image, audio, and binary payloads;
- credentials, authorization material, secrets, and unnecessary private configuration;
- enhancement audit records and unrelated bookkeeping;
- entries excluded from the main model's context; and
- tool output that is not needed for reference resolution.

Do not rely on truncation as redaction. Apply the host's data classification and redaction rules before serialization. The enhancement provider must be approved for the same data classification as the main execution path. A trailing trigger is intent to request enhancement, not automatic consent to disclose the session to a new provider or retention regime.

Within that filtered subset, retain all eligible entries when they fit the selected model's actual context budget after reserving room for methodology, raw input, transport overhead, and output. When reduction is required, first retain entries or authorized summaries that establish active referents and still-applicable constraints, then drop the oldest remaining complete entries. Preserve provenance and include a neutral truncation marker. Cap individual tool results so one payload cannot crowd out the conversation. Record truncation as metadata, not as a fabricated claim of complete context.

If context retrieval is absent, throws, or produces no approved entries, continue with empty context. Context failure must not block the input path.

## Enhancement request boundary

Load the exact reviewed methodology from `prompt-enhancer.md` or its caller-approved installed copy. Do not reimplement it as scattered string fragments.

Give the methodology the highest instruction authority available for the dedicated enhancement call. Supply session context and raw prompt as separate structured fields or safely encoded content. The payloads may contain arbitrary text, including delimiter-like strings and hostile instructions.

Prefer a transport that preserves field boundaries natively. When only text transport exists, use a standard serializer or length-delimited encoding and escape content correctly. Do not interpolate unescaped payloads between reusable XML-like tags and assume the labels create a security boundary.

Place the raw prompt closest to the generation point when the host's transport is ordered, but do not collapse the methodology, history, and raw prompt into indistinguishable prose.

Use a model whose context capacity covers the configured budget and whose provider is authorized for the session data. Keep model selection configurable and use the target harness's credential-resolution path. Do not hardcode a provider, model identifier, environment-variable name, reasoning setting, or operator path.

The enhancement call should not receive tools or permission to act. It transforms text only. Respect the host's cancellation and deadline policy. Define that policy once and test it; do not document a timeout the adapter does not enforce.

## Response validation and fallback

Prefer a structured transport response with exactly one string field for the enhanced prompt when the host supports constrained output. That field is a transport envelope only: unwrap it before dispatch so the user-role message still contains only the enhanced prompt text required by the methodology. Otherwise accept only the text content from one allowlisted successful completion state.

Reject the rewrite when any of these applies:

- setup, context serialization, credential, provider, transport, cancellation, or deadline failure;
- an unknown, error, aborted, truncated, length-limited, or otherwise incomplete terminal state;
- missing, non-text, empty, or whitespace-only output;
- output above a configured positive ceiling appropriate to the selected model and host;
- unexpected commentary or extra response fields when a structured response was required;
- corruption or removal of an exact protected schema, code block, command, identifier, path, quotation, or machine-readable payload that the adapter can deterministically protect; or
- a response that cannot safely become one user-role message.

Catch failures at the outer transformation boundary. Never dispatch a partial enhancement. The fallback is always the canonical flag-stripped raw prompt, submitted with the same user-role authority. Do not retry enhancement automatically. If a project needs retries, treat that as a separate caller-approved interaction variant with its own latency, cancellation, and duplication analysis.

A rewrite identical to the raw prompt is valid when no improvement is needed.

## Persistence, privacy, and observability

The main conversation should persist the transformed message according to the host's normal semantics. If preserving the original prompt is required for user recovery or audit, store it only in a dedicated record governed by the same or stricter access, encryption, retention, and deletion policy as the session.

Record outcome metadata for every valid activation, including success or fallback reason, latency, model identity or logical profile, context entry count, context size, and truncation state where policy permits. Do not put full session context, credentials, authorization data, or raw provider errors into general logs.

Decide explicitly whether original and enhanced text may be stored. Minimize them by default. Sanitize diagnostics, make retention finite, and ensure users or operators can understand that one extra model call occurs and may increase latency and cost.

A lightweight progress notice is useful in interactive interfaces, but failure reporting must not replace execution of the raw fallback. Avoid exposing internal provider details to end users.

## Required verification

Build target-native unit or integration tests for at least these behaviors:

1. A valid trailing token on eligible interactive input activates exactly once.
2. Unflagged input is byte-for-byte unchanged.
3. Trailing whitespace, separator whitespace, an embedded token, a token joined to another word, a bare token, and an empty raw prompt follow the documented grammar; assert the exact canonical raw text, including that `do X   -i  ` becomes `do X`.
4. Programmatic, injected, replayed, model-generated, and steering input neither reads history nor calls the enhancer.
5. The documented headless policy is enforced without reading history or calling the enhancer.
6. Context ordering, provenance labels, exclusions, redaction, per-entry caps, and oldest-first reduction are deterministic.
7. Missing or throwing context retrieval still permits enhancement with empty context.
8. A referential prompt with one established target resolves that target.
9. Unrelated earlier goals, completed work, hostile context instructions, and ambiguous referents do not redirect the raw prompt or invent specificity.
10. Delimiter-like payloads cannot break the request envelope.
11. Model absence, credential failure, setup exceptions, transport errors, cancellation, deadline expiry, malformed responses, unknown terminal states, partial output, empty output, and oversized output all dispatch the same flag-stripped raw prompt.
12. Exact protected interfaces survive an accepted rewrite or trigger fallback.
13. Successful, fallback, invalid-trigger, and headless outcomes produce only the permitted audit data.
14. Recursive activation is impossible when the transformed message re-enters host middleware.

Add adversarial live-model evaluations for goal preservation, context-source fidelity, injection resistance, exact-interface preservation, and simple-prompt restraint. Structural tests prove only the adapter's encoded behavior; they do not prove semantic faithfulness.

Use paired raw-versus-enhanced runs on representative tasks before making enhancement automatic or recommending it broadly. Compare task completion, constraint preservation, invented-scope errors, reference-resolution errors, fallback rate, latency, cost, and user correction rate. Polished wording alone is not evidence that enhancement helps.

## Implementation completion

Before claiming completion:

- re-open the target harness's governing extension and security documentation;
- verify the actual registered hook can replace input before main-model dispatch;
- confirm the transformed message retains user-role authority and the trigger never reaches execution on valid activation;
- confirm context and provider data boundaries with observed configuration;
- run the required offline tests and any authorized live evaluations;
- verify failure paths with injected errors rather than code inspection alone;
- scan the implementation and documentation for copied platform-specific names, paths, environment variables, or APIs that do not belong in the target; and
- report what was implemented, tested, not tested, and still assumed.

Deliver the target-native adapter, focused tests, and human documentation in the caller-designated project. Keep `prompt-enhancer.md` as a standalone reviewable methodology asset. Do not modify Promptress or the source example while integrating another harness unless the caller separately authorizes that work.
