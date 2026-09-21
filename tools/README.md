# Tools

Reusable function libraries and legacy tool implementations.

## Harness-neutral TypeScript libraries

| Directory                                        | Capability                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [`youtube-transcribe/`](youtube-transcribe/)     | Retrieve available YouTube caption tracks and metadata as text, JSON, SRT, or WebVTT.   |
| [`word-generator/`](word-generator/)             | Generate styled, validated Word documents from Markdown.                                |
| [`powerpoint-generator/`](powerpoint-generator/) | Generate styled, validated PowerPoint presentations from structured slides or Markdown. |

Each library keeps its functional core independent of an agent harness. Its human-facing `README.md` documents installation and the function API. Its separate `AGENT-INTEGRATION.md` is a prompt for an agent integrating that function into Pi, Claude Code, Codex, Anti-Gravity, another framework, or a custom runtime.

Host adapters belong in the consuming project. They should map native schemas, permissions, cancellation, progress, logging, and result envelopes to the semantic function contract without adding framework dependencies to the core library.

## Legacy Python tools

- `office_document_tool.py`
- `pdf_document_tool.py`

These files are retained unchanged for later review and are not part of the harness-neutral TypeScript packages.
