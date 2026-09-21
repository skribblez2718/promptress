# Promptress

Promptress is a library of adaptable prompt patterns and supporting tools for conversational assistants, agentic workflows, and custom AI applications.

The material is not designed as a turnkey integration for any particular model, vendor, or framework. Review each asset completely, decide which behavior is appropriate for your use case, and adapt it to your users, runtime capabilities, authority model, data boundaries, and output requirements.

## Repository structure

### `prompts/`

Contains reusable prompt assets organized by how they are intended to be used. Each subdirectory owns its current prompt map, usage notes, and any collection-specific conventions.

#### `prompts/assistants/`

Contains instruction sets for reusable conversational assistants. These are suitable starting points for configurations in chat products, agent frameworks, or custom applications where one instruction set governs an ongoing interaction.

Review and adapt the intended audience, capabilities, knowledge sources, clarification behavior, authority boundaries, and output contract before deployment.

#### `prompts/audits/`

Contains prompts for evidence-based review, evaluation, and improvement work. These prompts generally establish an outcome, define a review boundary, distinguish evidence from inference, preserve useful capabilities, and produce decision-ready findings.

Adapt the audited object, authoritative sources, evidence types, side-effect limits, delivery mode, and assurance requirements to the target environment.

#### `prompts/harnesses/`

Contains prompt methodologies and implementation briefs for capabilities embedded in an agentic harness. These assets describe portable behavior and integration requirements without providing or assuming one platform's runtime adapter.

An implementation should map the documented behavior to the consuming harness's native hooks, context model, tool permissions, data controls, cancellation behavior, observability, and test conventions.

### `tools/`

Contains reusable implementation libraries and related documentation that may support prompt-driven capabilities. Tool packages define their own dependencies, public interfaces, security boundaries, verification steps, and integration guidance.

Treat these packages as reference implementations. Inspect and test them in the target environment, add the host's authorization and operational controls, and keep platform-specific adapters in the consuming project.

## Using prompt assets

1. **Read the asset completely.** Understand its outcome, inputs, assumptions, boundaries, output contract, and failure behavior before changing or deploying it.
2. **Define the target environment.** Identify the intended users, model or models, available context, tools, permissions, data classification, approval path, and machine interfaces.
3. **Adapt deliberately.** Keep behavior that serves the desired outcome, remove irrelevant ceremony, and replace generic language with target-specific facts and interfaces. Do not preserve wording merely because it appears in the source.
4. **Protect deterministic boundaries.** Prompt text does not grant tools, credentials, filesystem or network access, approval, or authority. Enforce privacy, safety, exact schemas, external effects, and consequential actions through the runtime wherever possible.
5. **Evaluate behavior.** Test representative normal, ambiguous, unavailable-capability, failure, and adversarial cases. Judge outcomes, evidence, preserved constraints, and user control rather than exact wording or section presence.
6. **Iterate from observed results.** Retain working capabilities, make reversible changes where practical, and update the adapted prompt when the target model, runtime, policy, or user need changes.

The README within each collection is the appropriate place for its current inventory and more specific usage instructions.

## Design principles

Promptress assets aim to:

- define the real user-visible or operational outcome;
- use semantic inputs rather than positional commands or one framework's invocation syntax;
- distinguish authoritative sources, direct observations, inferences, assumptions, and unknowns when that distinction matters;
- favor specific capability and outcome constraints over universal reasoning rituals;
- keep clarification proportional to unresolved risk and consequence;
- require honest capability, evidence, verification, and completion claims;
- preserve useful behavior and exact interfaces during revision;
- keep credentials, private data, approvals, external effects, and irreversible actions under real runtime and user control;
- remain useful when tools or optional capabilities are unavailable; and
- test behavior and outcomes rather than rewarding prompt length, rigid templates, phase counts, or confidence theater.

When model-and-compute scaling is relevant, separate source claims from engineering interpretation. Favor approaches that can benefit from stronger models, search, learning, tools, feedback, data, and additional computation, while preserving deterministic safety, authority, privacy, approval, and machine-interface controls.

## Portability

Generic actions such as reading, searching, writing, executing, or reviewing describe behavior that may be useful; they do not guarantee that a runtime exposes or authorizes those capabilities. An adapted prompt should use only capabilities actually available and should report an honest limitation or bounded result when a required capability is missing.

Named products or frameworks may appear as examples or source lineage. They are not required dependencies unless an individual asset explicitly says otherwise. Prefer the target platform's native fields, hooks, schemas, and approval mechanisms over compatibility layers that weaken its controls.
