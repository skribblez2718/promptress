# Assistant Prompts

These prompts are designed to run as reusable assistants in chat products, agent frameworks, and custom applications. They describe semantic inputs and behavior rather than assuming one vendor's fields, commands, tool names, or repository layout.

## Prompt map

| Prompt                                                     | Use it to                                                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [`system-prompt-generator.md`](system-prompt-generator.md) | Generate or capability-preservingly revise a deployable system prompt for a task-specific assistant or agent.           |
| [`prompt-improver.md`](prompt-improver.md)                 | Improve an existing one-time, reusable, or system prompt without changing its intended outcome or protected interfaces. |

## System Prompt Generator

Use `system-prompt-generator.md` as the instruction or system-prompt content for an Open WebUI Model, an eligible or existing OpenAI Custom GPT, a Claude Project, or an equivalent assistant configuration. Give the configured assistant a task brief in ordinary conversation. Platform details, tools, interfaces, constraints, examples, and an existing prompt are optional unless they materially change the requested result.

**OpenAI lifecycle note (verified September 20, 2026):** Custom GPT creation is limited to eligible managed workspaces, and OpenAI has announced a transition from Custom GPTs to Plugins. Existing eligible GPTs can still use this prompt while supported. Check OpenAI's current [creating and editing GPTs](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts) guidance before planning a new deployment.

The generator normally returns:

1. one copy-ready system prompt;
2. material assumptions and deployment notes; and
3. compact behavioral evaluation cases for nontrivial prompts.

It asks questions only when an unresolved decision would materially change the outcome, authority, exact interface, or safe feasibility.

## Prompt Improver

Use `prompt-improver.md` in the same conversational products when the user already has a prompt and wants a faithful, copy-ready improvement. It preserves the prompt's type: a short one-time request should remain concise, while a reusable or governing prompt receives only the additional contract needed for its task. Use the System Prompt Generator for a new assistant or a material redesign from a task brief; use the Prompt Improver when fidelity to an existing prompt is primary.

The improver may ask a targeted question when a missing answer would materially change the outcome, exact interface, or consequence boundary. Otherwise it proceeds with low-risk assumptions. It normally returns the improved prompt, only material change notes, and behavioral cases for nontrivial reusable prompts. A prompt-only request produces only the copy-ready revision.

For an inline, session-aware `-i` transformation embedded in an agentic harness, use the separate [Harness Integration Prompts](../harnesses/) collection.

## Design standard

The assistant prompts and the prompts they create or revise:

- define the real user-visible outcome and observable success;
- prefer capability and outcome constraints over mandatory reasoning scripts;
- do not request private chain-of-thought or prescribe universal Tree-of-Thought, self-consistency, confidence-label, or self-critique rituals;
- distinguish adaptive model work from deterministic safety, authority, approval, privacy, and machine-interface boundaries;
- treat prompt text as guidance rather than runtime permission;
- use only tools and evidence actually available;
- report blockers and verification limits instead of fabricating actions or results;
- remain portable when no target platform is supplied; and
- protect useful capabilities when revising an existing prompt.

The scaling guidance is an engineering translation of the lesson discussed in Richard Sutton's canonical essay, [“The Bitter Lesson”](http://www.incompleteideas.net/IncIdeas/BitterLesson.html): general methods that can use increasing computation, especially search and learning, have historically overtaken heavily handcrafted approaches. The prompt does not treat that lesson as a ban on structure. Exact interfaces, external requirements, safety controls, and consequential-action boundaries remain deterministic.

## Source lineage

- The System Prompt Generator replaces the locally archived `system_prompt_generator.md`. It preserves the original goal—creating task-focused system prompts—while retiring fabricated secrecy threats, universal reasoning rituals, mandatory exhaustive clarification, fixed token and temperature prescriptions, and other brittle scaffolding.
- The Prompt Improver replaces the conversational use of the locally archived `prompt_improver.md`. It preserves faithful revision, copy-ready output, and material clarification while removing universal prompt templates, confidence theater, research-term appendices, and mandatory reasoning procedures.
