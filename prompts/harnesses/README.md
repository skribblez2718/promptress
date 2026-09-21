# Harness Integration Prompts

These prompts and implementation briefs are for capabilities embedded in an agentic harness. They define portable behavior and trust boundaries without shipping runtime adapters or assuming one platform's hooks, session types, model SDK, configuration names, or repository layout.

## Prompt map

| File                                                               | Use it to                                                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| [`prompt-enhancer.md`](prompt-enhancer.md)                         | Rewrite one opted-in user request using authorized prior context from the same active session. |
| [`prompt-enhancer-integration.md`](prompt-enhancer-integration.md) | Guide an implementation agent in adapting the enhancer to a caller-designated harness.         |

## Getting started

Give an implementation agent:

1. the target harness workspace and its governing extension/security documentation;
2. [`prompt-enhancer-integration.md`](prompt-enhancer-integration.md) as the implementation brief;
3. the caller-approved installed location for [`prompt-enhancer.md`](prompt-enhancer.md);
4. the desired trailing trigger, or permission to use the default `-i`; and
5. the approved enhancement-model/provider data boundary and any target-specific privacy, timeout, audit, packaging, or test requirements.

Ask the agent to discover the host-native interception and session APIs before selecting an adapter, then implement the adapter, tests, and human documentation in the consuming project. The brief defines what must remain invariant and what the target harness may decide.

## Session-aware prompt enhancement

The default interaction uses a standalone trailing `-i` token:

```text
fix that failing authentication test -i
```

A host-native pre-dispatch hook recognizes the token on direct interactive input, removes it, supplies the approved active-session context and raw request to the enhancer, validates the rewrite, and dispatches the accepted text as the same user-role message. A failed or invalid enhancement dispatches the flag-stripped raw request instead. Unflagged messages remain unchanged.

The enhancement stage does not answer the request, ask questions, grant authority, or create a new prompt layer. It is an invocation-context transformation. Prior context may resolve “that test” or an established file path, but the current raw request remains the source of the task. Ambiguous references remain unresolved rather than becoming invented specifics.

## Integration boundary

Promptress intentionally provides no extension code. The integration guide requires an implementing agent to discover and use the target harness's native:

- pre-dispatch input transformation surface;
- direct-interactive source signal;
- compaction-aware active-session context;
- model completion and cancellation APIs;
- data classification, redaction, retention, and audit controls; and
- testing and documentation conventions.

The guide can be adapted to Pi, Claude Code, Codex, Open WebUI, another agent framework, or a custom application only when that target exposes an equivalent safe transformation point. Platform-specific adapter code belongs in the consuming project.

## Security and privacy

A second model call may see prior conversation text, tool results, and summaries. The integration must keep that call within an approved data boundary, remove secrets and hidden reasoning, preserve provenance, use a safe structured envelope, and avoid duplicating private session content into general logs. The `-i` token requests enhancement; it is not consent to send data to an unapproved provider.

Prompt text cannot enforce tool permissions, approval gates, filesystem access, or external consequences. Those remain runtime responsibilities. An enhanced message retains ordinary user-role authority.

## Design standard

The methodology improves outcome, scope, constraints, completion, evidence, failure behavior, and output interfaces only when relevant. It does not add universal chain-of-thought, Tree-of-Thought, confidence, role, retry, or self-critique rituals. Simple prompts remain simple, exact interfaces are protected, and runtime evaluation—not polished wording—decides whether the extra model call earns its latency and cost.

This is an engineering translation of the scaling lesson discussed in Richard Sutton's canonical essay, [“The Bitter Lesson”](http://www.incompleteideas.net/IncIdeas/BitterLesson.html). General model-led methods should retain room to improve with search, tools, learning, feedback, and computation, while safety, privacy, authority, approval, and machine-interface controls remain deterministic.

## Source lineage

The portable methodology and integration brief are informed by Promptress's archived `prompt_improver.md` and a proven session-aware enhancement design. They preserve intent, context-informed reference resolution, lean output, and raw-prompt fallback while removing legacy reasoning rituals and generalizing platform-specific mechanics. No source extension code is included.
