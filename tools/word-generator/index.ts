import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import {
  generate,
  type GeneratorHooks,
  type WordGenerationResult,
} from "./renderer.js";

export const WORD_THEMES = [
  "executive",
  "modern",
  "minimal",
  "editorial",
  "tech",
] as const;
export const DEFAULT_MAX_MARKDOWN_BYTES = 5 * 1024 * 1024;

export type WordTheme = (typeof WORD_THEMES)[number];
export type WordLineBreakMode = "preserve" | "commonmark";
export type WordOrientation = "portrait" | "landscape";
export type WordPageSize = "letter" | "a4";
export type WordTitleMode = "auto" | "none" | "inline" | "cover";
export type WordTableStyle = "banded" | "minimal" | "grid" | "none";
export type WordTableLayout = "content" | "equal";

export interface WordGenerateInput {
  /** Full Markdown content. Exactly one of markdown or markdown_path is required. */
  markdown?: string;
  /** UTF-8 Markdown file. Relative paths resolve from projectRoot. */
  markdown_path?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  theme?: WordTheme;
  accent_color?: string;
  font_size_pt?: number;
  line_spacing?: number;
  line_break_mode?: WordLineBreakMode;
  margin_inches?: number;
  orientation?: WordOrientation;
  page_size?: WordPageSize;
  title_mode?: WordTitleMode;
  /** Backward-compatible alias for title_mode="cover" while title_mode is auto. */
  cover_page?: boolean;
  include_toc?: boolean;
  include_page_numbers?: boolean;
  header_text?: string;
  footer_text?: string;
  table_style?: WordTableStyle;
  table_layout?: WordTableLayout;
  /** Destination .docx path. Relative paths resolve from projectRoot. */
  output_path?: string;
}

export interface WordGeneratorOptions {
  /** Root for relative Markdown, image, and output paths. Defaults to process.cwd(). */
  projectRoot?: string;
  /** Directory for generated files when output_path is omitted. */
  tempDirectory?: string;
  /** Maximum UTF-8 Markdown input size. Defaults to 5 MiB. */
  maxMarkdownBytes?: number;
  signal?: AbortSignal;
  hooks?: GeneratorHooks;
  /** Test seam for deterministic timestamps. */
  now?: Date;
  /** Test seam for deterministic unique names. */
  invocationId?: () => string;
}

export type WordGeneratorSpec = WordGenerateInput &
  Record<string, unknown> & {
    markdown_path?: string;
    output_path: string;
    project_root: string;
  };

/** Lowercase, alphanumeric-and-dash slug for filenames; never empty. */
export function slugify(input: string, fallback = "document"): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return slug || fallback;
}

/** Build a unique default .docx path outside the project tree. */
export function defaultOutputPath(
  title: string | undefined,
  now: Date = new Date(),
  baseDirectory = path.join(os.tmpdir(), "word-generator"),
  invocationId: () => string = randomUUID,
): string {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const name = `${slugify(title ?? "document")}_${stamp}_${time}_${invocationId()}.docx`;
  return path.join(path.resolve(baseDirectory), name);
}

export function resolveOutputPath(
  outputPath: string | undefined,
  title: string | undefined,
  projectRoot: string,
  tempDirectory?: string,
  now?: Date,
  invocationId?: () => string,
): string {
  if (!outputPath) {
    return defaultOutputPath(title, now, tempDirectory, invocationId);
  }
  const resolved = path.isAbsolute(outputPath)
    ? path.resolve(outputPath)
    : path.resolve(projectRoot, outputPath);
  return resolved.toLowerCase().endsWith(".docx")
    ? resolved
    : `${resolved}.docx`;
}

function requirePositiveByteLimit(value: number | undefined): number {
  const limit = value ?? DEFAULT_MAX_MARKDOWN_BYTES;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new Error("maxMarkdownBytes must be a positive safe integer");
  }
  return limit;
}

function decodeUtf8(buffer: Buffer, source: string): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new Error(`Markdown file is not valid UTF-8: ${source}`);
  }
}

function snapshotMarkdownFile(
  markdownPath: string,
  maxMarkdownBytes: number,
): string {
  const descriptor = fs.openSync(markdownPath, "r");
  try {
    const stats = fs.fstatSync(descriptor);
    if (!stats.isFile()) {
      throw new Error(`Markdown path is not a regular file: ${markdownPath}`);
    }
    if (stats.size > maxMarkdownBytes) {
      throw new Error(
        `Markdown file exceeds the ${maxMarkdownBytes}-byte limit`,
      );
    }
    const content = fs.readFileSync(descriptor);
    if (content.byteLength > maxMarkdownBytes) {
      throw new Error(
        `Markdown file exceeds the ${maxMarkdownBytes}-byte limit`,
      );
    }
    return decodeUtf8(content, markdownPath);
  } finally {
    fs.closeSync(descriptor);
  }
}

function validateMarkdownInput(
  input: WordGenerateInput,
  projectRoot: string,
  maxMarkdownBytes: number,
): { markdown: string } {
  const hasInline =
    typeof input.markdown === "string" && input.markdown.trim().length > 0;
  const hasFile =
    typeof input.markdown_path === "string" &&
    input.markdown_path.trim().length > 0;
  if (hasInline === hasFile) {
    throw new Error("Provide exactly one of 'markdown' or 'markdown_path'.");
  }

  if (hasInline) {
    const size = Buffer.byteLength(input.markdown ?? "", "utf8");
    if (size > maxMarkdownBytes) {
      throw new Error(
        `Markdown input exceeds the ${maxMarkdownBytes}-byte limit`,
      );
    }
    return { markdown: input.markdown ?? "" };
  }

  const suppliedPath = input.markdown_path;
  if (typeof suppliedPath !== "string") {
    throw new Error("markdown_path must be a string");
  }
  const markdownPath = path.isAbsolute(suppliedPath)
    ? path.resolve(suppliedPath)
    : path.resolve(projectRoot, suppliedPath);
  return { markdown: snapshotMarkdownFile(markdownPath, maxMarkdownBytes) };
}

/** Validate public input and build the renderer's harness-neutral specification. */
export function buildWordSpec(
  input: WordGenerateInput,
  options: WordGeneratorOptions = {},
): WordGeneratorSpec {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  const maxMarkdownBytes = requirePositiveByteLimit(options.maxMarkdownBytes);
  const { markdown } = validateMarkdownInput(
    input,
    projectRoot,
    maxMarkdownBytes,
  );

  const spec: WordGeneratorSpec = {
    ...input,
    markdown,
    output_path: resolveOutputPath(
      input.output_path,
      input.title,
      projectRoot,
      options.tempDirectory,
      options.now,
      options.invocationId,
    ),
    project_root: projectRoot,
  };
  delete spec.markdown_path;
  return spec;
}

/**
 * Generate and structurally validate a Word document.
 *
 * This function performs no tool registration and depends on no agent harness. A host adapter owns
 * authorization, user confirmation, progress presentation, and any stricter path policy.
 */
export async function generateWordDocument(
  input: WordGenerateInput,
  options: WordGeneratorOptions = {},
): Promise<WordGenerationResult> {
  if (options.signal?.aborted) {
    const error = new Error("Word generation cancelled before start");
    error.name = "AbortError";
    throw error;
  }
  const spec = buildWordSpec(input, options);
  return generate(spec, options.signal, options.hooks);
}

export { validate_docx as validateDocx } from "./renderer.js";
export type { GeneratorHooks, WordGenerationResult } from "./renderer.js";
