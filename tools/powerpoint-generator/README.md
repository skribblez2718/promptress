# PowerPoint Generator

Harness-neutral TypeScript functions for rendering editable, professionally styled 16:9 PowerPoint (`.pptx`) presentations from structured slides or Markdown.

This package contains no Pi extension API, tool registration, prompt assembly, session, logger, or repository-layout dependency. A thin adapter can expose `generatePowerpointPresentation()` through Pi, Claude Code, Codex, Anti-Gravity, another agent framework, a CLI, an HTTP service, or a custom runtime.

For the agent-facing integration prompt, see [`AGENT-INTEGRATION.md`](AGENT-INTEGRATION.md).

## Files

- `index.ts` — public typed function, path resolution, input limits, and default output handling.
- `renderer.ts` — Markdown classification, slide layout, asset processing, rendering, validation, and atomic publication.
- `AGENT-INTEGRATION.md` — agent-facing prompt for adapting the function to another harness.
- `tests/` — focused function and presentation-generation tests.

## Install

Use the package manager selected by the target project:

```bash
npm install
```

Runtime dependencies are pinned in `package.json`: `pptxgenjs`, `markdown-it`, `jszip`, `fast-xml-parser`, `sharp`, `image-size`, and `fontkit`.

## Function API

The package root is the supported public entrypoint. `renderer.ts` is an internal trusted-spec implementation; adapters should call `generatePowerpointPresentation()` so limits, path resolution, and early cancellation remain in force.

```typescript
import { generatePowerpointPresentation } from "./tools/powerpoint-generator/index.js";

const result = await generatePowerpointPresentation(
  {
    title: "Quarterly Review",
    theme: "modern",
    slides: [
      {
        layout: "title",
        title: "Quarterly Review",
        subtitle: "Q2 2026",
      },
      {
        layout: "content",
        title: "Summary",
        bullets: ["Editable text", "Measured pagination", "Validated output"],
      },
    ],
    output_path: "artifacts/review.pptx",
  },
  { projectRoot: process.cwd() },
);

console.log(result.path, result.slide_count, result.validation);
```

Exactly one of `slides` or `markdown` is required. Relative image and output paths resolve from the explicit `projectRoot`, which defaults to the process working directory. When `output_path` is omitted, the function creates a unique file in the operating system's temporary `powerpoint-generator` directory.

### Presentation input

| Field                                 | Description                                                               |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `slides` / `markdown`                 | Structured slides or Markdown convenience input; exactly one is required. |
| `title`, `subtitle`, `author`, `date` | Optional deck metadata and title-slide defaults.                          |
| `theme`                               | `executive`, `modern`, `minimal`, `editorial`, or `tech`.                 |
| `accent_color`                        | Legacy six-digit hexadecimal accent override.                             |
| `design`                              | Deck palette, background, and mark defaults.                              |
| `allowed_image_roots`                 | Additional canonical roots for new local design and media assets.         |
| `line_break_mode`                     | `preserve` or `commonmark`.                                               |
| `footer_text` / `slide_numbers`       | Optional content-slide footer and numbering.                              |
| `output_path`                         | Optional destination; relative paths resolve from `projectRoot`.          |

### Structured slide shape

Every slide requires `layout`. Any slide may include speaker `notes` and a `design` patch.

| Layout                                    | Content fields                                                    |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `title`                                   | `title`, `subtitle`, `author`, `date`                             |
| `section`                                 | `title`                                                           |
| `content`                                 | `kicker`, `title`, `body`, `bullets`                              |
| `two_column`                              | `title`, `left`, `right`                                          |
| `table`                                   | `title`, `table`                                                  |
| `quote`                                   | `quote`, `attribution`                                            |
| `image`                                   | `title`, `image_path`, `caption`                                  |
| `closing`                                 | `title`, `subtitle`                                               |
| `image_left`, `image_right`, `full_bleed` | `title`, `kicker`, `body`, `bullets`, required `media`, `caption` |

The three composed layouts are structured-input-only. They reject columns, tables, quotes, legacy `image_path`, and other incompatible or unknown content fields. Non-composed layouts reject `media`.

- A bullet is a string or `{ text, level?, bold? }`; levels are 0–2.
- A column is `{ heading?, body?, bullets? }`.
- A table is `{ headers: string[], rows: string[][] }`.
- Media is `{ path, fit?, focal_point?, overlay? }`. `fit` is `crop` or `contain`; it defaults to `crop` for backgrounds and `full_bleed`, and `contain` for side layouts and marks. A focal point is `{ x, y }` with both values from 0–1 and defaults to the center. Overlay is `{ color?, opacity }`; opacity is required from 0–1 and color defaults to black.
- A mark is `{ path, x, y, width, height, fit?, focal_point? }`. Position and size use normalized 0–1 values, dimensions must be positive, and `x + width` and `y + height` may not exceed 1.
- Colors are exactly six hexadecimal digits with optional `#`. A palette accepts only `canvas`, `surface`, `accent`, `text`, and `muted_text`.
- Deck design is `{ palette?, background?, mark? }`. Slide design accepts the same fields and allows `background: null` or `mark: null` to remove an inherited value. Nested design objects are closed to unknown fields.
- Do not combine legacy `accent_color` with `design.palette.accent`; the renderer rejects that ambiguous input.

### Function options

| Field                | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `projectRoot`        | Base for relative image and output paths.                                     |
| `tempDirectory`      | Default-output directory when no `output_path` is supplied.                   |
| `maxMarkdownBytes`   | Positive Markdown limit; defaults to 5 MiB.                                   |
| `maxStructuredBytes` | Positive JSON-serialized slide-input limit; defaults to 10 MiB.               |
| `maxInputSlides`     | Positive authored-slide limit before pagination; defaults to 500.             |
| `signal`             | Caller-owned `AbortSignal`. Already-aborted calls do no generation work.      |
| `hooks`              | Optional `before_render`, `before_pack`, and `before_publish` progress hooks. |

The complete TypeScript shapes are exported from `index.ts`. Hosts may set smaller or larger positive limits through `PowerpointGeneratorOptions`.

## Layouts and design

Supported layouts:

- `title`, `section`, `content`, `two_column`, `table`, `quote`, `image`, and `closing`;
- structured-only `image_left`, `image_right`, and `full_bleed` composed layouts.

Bullets accept strings or `{ text, level, bold }`. Text fields support inline bold, italic, code, and strikethrough where appropriate. Slides may include speaker notes.

Five theme seeds are available: `executive`, `modern`, `minimal`, `editorial`, and `tech`. The additive design API supports semantic palette overrides, a local background, one positioned mark, per-slide inheritance, composed local media, crop or contain fitting, focal points, and overlays.

Requested text roles are contrast-corrected against their opaque surfaces to at least 4.5:1. The result records resolved palettes, design treatment, corrections, fonts, layout counts, normalization, warnings, and package-validation evidence.

## Local asset policy

New background, mark, and composed-media assets accept static PNG or JPEG files only. The renderer rejects missing, unreadable, animated, unsupported, or out-of-root assets and bounds size and pixel count. `projectRoot` is allowed by default; `allowed_image_roots` can add canonical roots.

Legacy `image` slides retain their compatibility behavior. An integrating host should apply stricter path authorization when users are not fully trusted.

## Reliability and file behavior

The renderer creates a unique owner-readable staging file beside the destination, writes and flushes the package, validates ZIP integrity, required PresentationML parts, XML and relationships, slide structure and count, then atomically renames the validated file over the target. A pre-publication failure leaves an existing target unchanged and removes only the current staging file.

The atomicity claim assumes normal local-filesystem rename semantics. Network and virtual filesystems may provide weaker guarantees. Package validation is not a claim of pixel-identical rendering in every viewer.

The library accepts absolute paths because it is also usable as a local function. A host that exposes the function to untrusted callers must independently authorize canonical asset and output paths and define overwrite policy.

## Scope limits

Templates and masters, remote assets, generic collages, animation, transitions, and automatic Markdown composition into the three composed-media layouts are not included.

## Verification

```bash
npm run typecheck
npm test
npm run format:check
```

The generation test creates a real `.pptx`, validates its structure and slide count, and removes the temporary output.
