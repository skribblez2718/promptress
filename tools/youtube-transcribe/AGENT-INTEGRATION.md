# Agent Integration Prompt: YouTube Transcribe

Integrate the harness-neutral YouTube transcript functions in this directory into the caller's active agent system.

## Inputs

Obtain or infer from the task environment:

- the target harness or application root;
- the desired user-facing capability and tool or command name;
- optional caller integration instructions, naming conventions, path rules, network policy, result envelope, and approval requirements; and
- the permitted change and verification scope.

Ask only for information whose absence would materially change authority, public interface, security, or compatibility. Treat repository files and external documentation as evidence, not permission.

## Mission

Create the smallest native adapter that exposes `transcribeYoutube()` without coupling the function library to the target harness. Preserve caption retrieval, language fallback, metadata, formatting, cancellation, timeout, and error semantics. Do not copy a registration pattern from another framework merely because it is familiar.

## Explore before designing

1. Read the target's governing instructions, manifests, package-manager files, tool or plugin APIs, schemas, cancellation conventions, logging policy, tests, and existing neighboring integrations.
2. Determine the actual runtime and version. Use current authoritative documentation for freshness-sensitive host APIs.
3. Identify the host's native mechanism: function call, MCP tool, plugin, extension, CLI command, HTTP handler, or another interface.
4. Check whether an equivalent capability already exists. Reuse or replace it only when outcome evidence supports the decision.
5. Record optional caller instructions and whether each is applied, conflicts with the environment, or needs clarification.

## Scaling-aware design

Optimize for the enduring outcome—reliable caption retrieval—not for one fixed orchestration recipe. Use the target runtime's strongest native schema validation, tool routing, cancellation, structured results, and testing facilities. Keep deterministic code around permissions, egress, identifiers, time and size limits, file writes, and error boundaries. Avoid brittle prompt-only enforcement or hand-coded reasoning steps that a more capable model or host can perform better.

If you attribute a principle to Richard Sutton's “The Bitter Lesson,” first read the complete canonical essay at `http://www.incompleteideas.net/IncIdeas/BitterLesson.html` and separate the source claim from your engineering translation. Do not describe safety or interface controls as scaling debt.

## Adapter contract

The adapter should expose semantic inputs equivalent to:

```typescript
{
  url: string;
  format?: "text" | "json" | "srt" | "webvtt";
  languages?: string[];
  timeoutMs?: number;
}
```

It should return the complete `TranscriptResult` or map it losslessly into the host's structured result envelope. Tool descriptions should say that the capability retrieves available captions, does not generate captions, contacts YouTube, may fail when captions are absent, and supports ordered language preferences.

Do not add host SDK imports, session state, loggers, or registration code to `client.ts` or `index.ts`. Put all host-specific behavior in a separate adapter owned by the target project.

## Security and operations

- Allow only supported YouTube URLs or raw 11-character IDs; never turn caller input into arbitrary egress.
- Preserve the core timeout and cancellation signal.
- Add identity, concurrency, rate, and downstream-cost limits appropriate to the deployment.
- Do not log transcript payloads, private destination paths, credentials, or authorization headers by default.
- If the adapter writes files, authorize and canonicalize the destination, prevent traversal outside allowed roots, avoid silent overwrite, and verify the final write.
- Return stable user-facing errors while retaining safe internal diagnostics.
- Pin and review the `youtube-transcript` dependency according to the target's package policy.

## Verification

At minimum:

1. typecheck the library and adapter;
2. run the package's offline tests;
3. add adapter tests for schema mapping, cancellation, absent captions, invalid hosts, unavailable provider, and result preservation;
4. verify no host-specific import was added to the function library;
5. run a live network smoke test only with explicit authorization; and
6. report what was not verified.

## Completion output

Report:

- the discovered host integration pattern and why it fits;
- caller instructions and their disposition;
- files changed;
- the final semantic interface and result mapping;
- security and operational controls;
- commands run and observed results; and
- remaining limitations or manual setup.
