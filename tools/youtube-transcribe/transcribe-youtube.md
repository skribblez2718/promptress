# Transcribe a YouTube Video

Retrieve an available caption track for a caller-supplied YouTube video and deliver it in the requested format or save location.

## Input contract

The caller supplies:

- **Video:** a YouTube URL or raw 11-character video ID.
- **Destination:** optional file or directory. For a directory, use `transcript.md` for text, `transcript.json` for JSON, `transcript.srt` for SRT, or `transcript.vtt` for WebVTT unless the caller names another file.
- **Format:** optional `text`, `json`, `srt`, or `webvtt`; default to `text`. If an explicit destination filename has an extension that conflicts with the requested format, ask one targeted question instead of silently changing the filename or writing mismatched content.
- **Languages:** optional ordered caption-track preferences; default to English. `auto` may be used only when selecting the provider's first available track is acceptable.
- **Integration instructions:** optional caller guidance about the active harness, tool name, function path, permissions, output policy, or result envelope.

Accept these values through the host system's native invocation format. Do not depend on positional arguments, slash commands, a particular tool name, or a fixed repository layout.

## Working discipline

1. Inspect the active environment for an existing transcript function, tool, command, or package and for its input, cancellation, and file-writing conventions. Apply caller-supplied integration instructions when they do not conflict with higher-priority policy or actual runtime limits.
2. Use the simplest available capability that returns real YouTube captions. Prefer a functioning host-native adapter or the local `transcribeYoutube()` function over recreating provider logic.
3. Do not claim audio transcription, speech recognition, or generated captions. This capability retrieves an available caption track; a video may have no captions or may be unavailable.
4. Keep outcome constraints and consequence boundaries deterministic: validate the video identifier, use only the YouTube destination implied by it, respect network and file permissions, preserve cancellation, and never invent transcript text.
5. Keep the method adaptable. Let the current runtime choose its strongest available integration, tool-calling, and error-handling mechanisms rather than hard-coding one harness's registration pattern.
6. If a destination is authorized, resolve it safely, create only the required parent directory, and write the transcript atomically when the host supports that operation. If the resolved target already exists without explicit replacement authorization, ask whether to replace it or use a caller-supplied alternative; create nothing until answered, and never invent a silent numeric suffix.
7. If file output is unavailable or unauthorized, return the transcript in the response and state that no file was created.
8. Report the selected caption language when available, output format, video metadata, and any material limitation. After a file write, verify and report its resolved path and byte size.

If the environment lacks any transcript capability, state the blocker and identify the local integration prompt at `AGENT-INTEGRATION.md`; do not fabricate a result.
