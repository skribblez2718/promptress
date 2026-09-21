# Word Generator

Harness-neutral TypeScript functions for rendering Markdown into a professionally styled, structurally validated Word (`.docx`) document.

This package contains no Pi extension API, tool registration, prompt assembly, session, logger, or repository-layout dependency. A thin adapter can expose `generateWordDocument()` through Pi, Claude Code, Codex, Anti-Gravity, another agent framework, a CLI, an HTTP service, or a custom runtime.

For the agent-facing integration prompt, see [`AGENT-INTEGRATION.md`](AGENT-INTEGRATION.md).

## Files

- `index.ts` — public typed function, path resolution, input-size limit, and default output handling.
- `renderer.ts` — Markdown parsing, styling, OOXML rendering, structural validation, and atomic publication.
- `AGENT-INTEGRATION.md` — agent-facing prompt for adapting the function to another harness.
- `tests/` — focused function and document-generation tests.

## Install

Use the package manager selected by the target project:

```bash
npm install
```

Runtime dependencies are pinned in `package.json`: `docx`, `markdown-it`, `jszip`, `fast-xml-parser`, and `image-size`.

## Function API

The package root is the supported public entrypoint. `renderer.ts` is an internal trusted-spec implementation; adapters should call `generateWordDocument()` so input snapshots, limits, path resolution, and early cancellation remain in force.

```typescript
import { generateWordDocument } from "./tools/word-generator/index.js";

const result = await generateWordDocument(
  {
    markdown: "# Quarterly Review\n\n## Summary\n\nWe shipped **14 releases**.",
    subtitle: "Q2 2026",
    author: "Platform Team",
    theme: "modern",
    title_mode: "cover",
    include_toc: true,
    footer_text: "Confidential",
    output_path: "artifacts/review.docx",
  },
  { projectRoot: process.cwd() },
);

console.log(result.path, result.validation);
```

Exactly one of `markdown` or `markdown_path` is required. Relative Markdown, image, and output paths resolve from the explicit `projectRoot`, which defaults to the process working directory. A Markdown file is opened, bounded, UTF-8 validated, and snapshotted before rendering. When `output_path` is omitted, the function creates a unique file in the operating system's temporary `word-generator` directory.

### Document input

| Field                                  | Description                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `markdown` / `markdown_path`           | Inline Markdown or one UTF-8 Markdown file; exactly one is required.                  |
| `title`, `subtitle`, `author`, `date`  | Optional title matter and metadata. A leading H1 supplies the title when appropriate. |
| `theme`                                | `executive`, `modern`, `minimal`, `editorial`, or `tech`.                             |
| `accent_color`                         | Six-digit hexadecimal accent override, with optional `#`.                             |
| `font_size_pt` / `line_spacing`        | Body size from 8–14 pt and spacing from 1.0–2.0.                                      |
| `line_break_mode`                      | `preserve` or `commonmark`.                                                           |
| `margin_inches`                        | Uniform margin from 0.4–2.0 inches.                                                   |
| `orientation` / `page_size`            | `portrait` or `landscape`; `letter` or `a4`.                                          |
| `title_mode`                           | `auto`, `none`, `inline`, or `cover`; `cover_page` is a legacy cover alias.           |
| `include_toc` / `include_page_numbers` | Optional TOC field and footer numbering.                                              |
| `header_text` / `footer_text`          | Running header and footer text.                                                       |
| `table_style` / `table_layout`         | `banded`, `minimal`, `grid`, or `none`; content-aware or equal widths.                |
| `output_path`                          | Optional destination; relative paths resolve from `projectRoot`.                      |

### Function options

| Field              | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| `projectRoot`      | Base for relative input, image, and output paths.                             |
| `tempDirectory`    | Default-output directory when no `output_path` is supplied.                   |
| `maxMarkdownBytes` | Positive UTF-8 input limit; defaults to 5 MiB.                                |
| `signal`           | Caller-owned `AbortSignal`. Already-aborted calls do no generation work.      |
| `hooks`            | Optional `before_render`, `before_pack`, and `before_publish` progress hooks. |

The complete TypeScript shapes are exported as `WordGenerateInput` and `WordGeneratorOptions`.

## Capabilities

- CommonMark, tables, strikethrough, blockquotes, horizontal rules, and fenced code
- headings H1–H6 with reusable Word paragraph and character styles
- bold, italic, strikethrough, inline code, and hyperlinks
- preserved soft line breaks by default, with optional CommonMark folding
- bulleted and ordered lists
- content-aware or equal-width tables
- local raster images sized to page bounds with alt text
- cover, inline, retained, or omitted title treatment
- TOC field, headers, footers, and page numbers
- five visual themes plus an accent-color override

The result includes content statistics, warnings, normalization choices, resolved palette information, and package-validation evidence.

## Reliability and file behavior

The renderer creates a unique owner-readable staging file beside the destination, writes and flushes the package, validates ZIP integrity, required OOXML parts, XML and relationships, and package reopening, checks cancellation again, then atomically renames the validated file over the target. A cancellation or other pre-publication failure leaves an existing target unchanged and removes only the current staging file.

The atomicity claim assumes normal local-filesystem rename semantics. Network and virtual filesystems may provide weaker guarantees.

The library accepts absolute paths because it is also usable as a local function. A host that exposes the function to untrusted callers must independently authorize canonical input, image, and output paths and define overwrite policy.

## Viewer constraints

- A TOC is a Word field. The document requests refresh on open, but some viewers require manual refresh.
- Font availability varies by operating system and viewers may substitute fonts.
- Ordered lists use explicit restart-safe markers rather than editable native numbering.

## Verification

```bash
npm run typecheck
npm test
npm run format:check
```

The generation test creates a real `.docx`, validates it, and removes the temporary output.
