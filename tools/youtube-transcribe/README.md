# YouTube Transcribe

Harness-neutral TypeScript functions for retrieving an available YouTube caption track, reading basic video metadata, and formatting captions as plain text, JSON, SRT, or WebVTT.

This package contains no Pi extension API, tool registration, prompt assembly, logger, session, or project-layout dependency. A thin adapter can expose `transcribeYoutube()` through Pi, Claude Code, Codex, Anti-Gravity, another agent framework, a CLI, an HTTP service, or a custom runtime.

For an agent-facing integration prompt, see [`AGENT-INTEGRATION.md`](AGENT-INTEGRATION.md). For a harness-neutral task prompt that uses an installed transcript capability, see [`transcribe-youtube.md`](transcribe-youtube.md).

## Files

- `index.ts` — public, validated function boundary with cancellation and timeout handling.
- `client.ts` — YouTube provider adapter, metadata extraction, language fallback, and caption formatting.
- `transcribe-youtube.md` — agent-facing transcript task prompt.
- `AGENT-INTEGRATION.md` — agent-facing integration prompt.
- `tests/` — offline contract tests using injected network dependencies.

## Install

Install this directory's dependencies with the package manager used by the target project:

```bash
npm install
```

The runtime dependency is `youtube-transcript` 1.3.1, an unofficial YouTube client. YouTube can change its caption endpoints or availability independently of this package.

## Function API

The package root is the supported public entrypoint. `client.ts` is an internal provider implementation; adapters should call `transcribeYoutube()` so timeout, cancellation, validation, and output limits remain in force.

```typescript
import { transcribeYoutube } from "./tools/youtube-transcribe/index.js";

const result = await transcribeYoutube({
  url: "https://www.youtube.com/watch?v=ogTLWGBc3cE",
  format: "json",
  languages: ["fr", "en"],
  timeoutMs: 30_000,
});

console.log(result.metadata.title);
console.log(result.snippets);
```

### Input

| Field       | Required | Description                                                                                                                                                  |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `url`       | yes      | Supported YouTube URL or raw 11-character video ID.                                                                                                          |
| `format`    | no       | `text` (default), `json`, `srt`, or `webvtt`.                                                                                                                |
| `languages` | no       | Ordered caption-track preferences. Empty or omitted defaults to English; `auto` selects the provider's first available track and does not generate captions. |
| `timeoutMs` | no       | End-to-end timeout. Defaults to 30 seconds and is capped at 5 minutes.                                                                                       |

The returned metadata contains title, author, and video ID. JSON cue `start` and `duration` values use seconds.

## Supported URL forms

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- raw 11-character video ID

Only `http` and `https` YouTube hosts are accepted. The implementation derives its outbound metadata URL from the validated video ID; callers do not control an arbitrary destination.

## Host responsibilities

The function library deliberately does not decide who may use network or filesystem capabilities. An integrating host should add its own:

- tool or command schema and result envelope;
- user authorization and rate or cost controls;
- network egress policy for YouTube;
- logging and redaction policy;
- destination-path authorization when saving transcripts; and
- cancellation and progress presentation appropriate to the host.

The core bounds language preferences, cue count, cue text size, accepted metadata size, and wall time. Caption and metadata size checks occur after the upstream library or fetch implementation has materialized text, so they are rejection limits rather than complete transport-level memory confinement. Production services should add network-level response limits plus identity, concurrency, and global quotas.

## Verification

```bash
npm run typecheck
npm test
npm run format:check
```

The default tests are offline. If a host adds a live YouTube smoke test, keep it explicitly opt-in because network fixtures and public caption availability are mutable.
