import { randomUUID } from "node:crypto";
import * as os from "node:os";
import * as path from "node:path";

import {
  generate,
  type GeneratorHooks,
  type PowerpointGenerationResult,
} from "./renderer.js";

export const POWERPOINT_THEMES = [
  "executive",
  "modern",
  "minimal",
  "editorial",
  "tech",
] as const;
export const SLIDE_LAYOUTS = [
  "title",
  "section",
  "content",
  "two_column",
  "table",
  "quote",
  "image",
  "closing",
  "image_left",
  "image_right",
  "full_bleed",
] as const;
export const DEFAULT_MAX_MARKDOWN_BYTES = 5 * 1024 * 1024;
export const DEFAULT_MAX_STRUCTURED_BYTES = 10 * 1024 * 1024;
export const DEFAULT_MAX_INPUT_SLIDES = 500;

export type PowerpointTheme = (typeof POWERPOINT_THEMES)[number];
export type SlideLayout = (typeof SLIDE_LAYOUTS)[number];
export type ImageFit = "crop" | "contain";
export type LineBreakMode = "preserve" | "commonmark";

export interface FocalPointInput {
  x: number;
  y: number;
}

export interface OverlayInput {
  color?: string;
  opacity: number;
}

export interface MediaInput {
  path: string;
  fit?: ImageFit;
  focal_point?: FocalPointInput;
  overlay?: OverlayInput;
}

export interface PlacedImageInput {
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fit?: ImageFit;
  focal_point?: FocalPointInput;
}

export interface PaletteInput {
  canvas?: string;
  surface?: string;
  accent?: string;
  text?: string;
  muted_text?: string;
}

export interface DeckDesignInput {
  palette?: PaletteInput;
  background?: MediaInput;
  mark?: PlacedImageInput;
}

export interface SlideDesignInput {
  palette?: PaletteInput;
  background?: MediaInput | null;
  mark?: PlacedImageInput | null;
}

export interface BulletInputObject {
  text: string;
  level?: number;
  bold?: boolean;
}

export type BulletInput = string | BulletInputObject;

export interface ColumnInput {
  heading?: string;
  body?: string;
  bullets?: BulletInput[];
}

export interface TableInput {
  headers: string[];
  rows: string[][];
}

export interface SlideInput {
  layout: SlideLayout;
  title?: string;
  subtitle?: string;
  kicker?: string;
  body?: string;
  bullets?: BulletInput[];
  left?: ColumnInput;
  right?: ColumnInput;
  table?: TableInput;
  quote?: string;
  attribution?: string;
  image_path?: string;
  caption?: string;
  design?: SlideDesignInput;
  media?: MediaInput;
  author?: string;
  date?: string;
  notes?: string;
}

export interface PowerpointGenerateInput {
  /** Structured slide list. Exactly one of slides or markdown is required. */
  slides?: SlideInput[];
  /** Markdown convenience input. Exactly one of slides or markdown is required. */
  markdown?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  theme?: PowerpointTheme;
  accent_color?: string;
  design?: DeckDesignInput;
  /** Additional canonical roots allowed for local background, media, and mark assets. */
  allowed_image_roots?: string[];
  line_break_mode?: LineBreakMode;
  footer_text?: string;
  slide_numbers?: boolean;
  /** Destination .pptx path. Relative paths resolve from projectRoot. */
  output_path?: string;
}

export interface PowerpointGeneratorOptions {
  /** Root for relative image and output paths. Defaults to process.cwd(). */
  projectRoot?: string;
  /** Directory for generated files when output_path is omitted. */
  tempDirectory?: string;
  /** Maximum UTF-8 Markdown input size. Defaults to 5 MiB. */
  maxMarkdownBytes?: number;
  /** Maximum JSON-serialized structured slide input size. Defaults to 10 MiB. */
  maxStructuredBytes?: number;
  /** Maximum number of authored slides before pagination. Defaults to 500. */
  maxInputSlides?: number;
  signal?: AbortSignal;
  hooks?: GeneratorHooks;
  /** Test seam for deterministic timestamps. */
  now?: Date;
  /** Test seam for deterministic unique names. */
  invocationId?: () => string;
}

export type PowerpointGeneratorSpec = PowerpointGenerateInput &
  Record<string, unknown> & {
    output_path: string;
    project_root: string;
  };

/** Lowercase, alphanumeric-and-dash slug for filenames; never empty. */
export function slugify(input: string, fallback = "presentation"): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return slug || fallback;
}

/** Build a unique default .pptx path outside the project tree. */
export function defaultOutputPath(
  title: string | undefined,
  now: Date = new Date(),
  baseDirectory = path.join(os.tmpdir(), "powerpoint-generator"),
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
  const name = `${slugify(title ?? "presentation")}_${stamp}_${time}_${invocationId()}.pptx`;
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
  return resolved.toLowerCase().endsWith(".pptx")
    ? resolved
    : `${resolved}.pptx`;
}

function requirePositiveLimit(
  value: number | undefined,
  fallback: number,
  name: string,
): number {
  const limit = value ?? fallback;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new Error(`${name} must be a positive safe integer`);
  }
  return limit;
}

function jsonByteLength(value: unknown): number {
  let serialized: string | undefined;
  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Structured slide input must be JSON-serializable: ${message}`,
    );
  }
  if (serialized === undefined) {
    throw new Error("Structured slide input must be JSON-serializable");
  }
  return Buffer.byteLength(serialized, "utf8");
}

/** Validate public input and build the renderer's harness-neutral specification. */
export function buildPowerpointSpec(
  input: PowerpointGenerateInput,
  options: PowerpointGeneratorOptions = {},
): PowerpointGeneratorSpec {
  const hasSlides = Array.isArray(input.slides) && input.slides.length > 0;
  const hasMarkdown =
    typeof input.markdown === "string" && input.markdown.trim().length > 0;
  if (hasSlides === hasMarkdown) {
    throw new Error("Provide exactly one of 'slides' or 'markdown'.");
  }

  if (hasMarkdown) {
    const maxMarkdownBytes = requirePositiveLimit(
      options.maxMarkdownBytes,
      DEFAULT_MAX_MARKDOWN_BYTES,
      "maxMarkdownBytes",
    );
    const size = Buffer.byteLength(input.markdown ?? "", "utf8");
    if (size > maxMarkdownBytes) {
      throw new Error(
        `Markdown input exceeds the ${maxMarkdownBytes}-byte limit`,
      );
    }
  }

  if (hasSlides) {
    const slides = input.slides ?? [];
    const maxInputSlides = requirePositiveLimit(
      options.maxInputSlides,
      DEFAULT_MAX_INPUT_SLIDES,
      "maxInputSlides",
    );
    if (slides.length > maxInputSlides) {
      throw new Error(
        `Structured input exceeds the ${maxInputSlides}-slide limit`,
      );
    }
    const maxStructuredBytes = requirePositiveLimit(
      options.maxStructuredBytes,
      DEFAULT_MAX_STRUCTURED_BYTES,
      "maxStructuredBytes",
    );
    const size = jsonByteLength(slides);
    if (size > maxStructuredBytes) {
      throw new Error(
        `Structured slide input exceeds the ${maxStructuredBytes}-byte limit`,
      );
    }
  }

  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  const spec: PowerpointGeneratorSpec = {
    ...input,
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
  if (!hasMarkdown) delete spec.markdown;
  if (!hasSlides) delete spec.slides;
  return spec;
}

/**
 * Generate and structurally validate a PowerPoint presentation.
 *
 * This function performs no tool registration and depends on no agent harness. A host adapter owns
 * authorization, user confirmation, progress presentation, and any stricter path policy.
 */
export async function generatePowerpointPresentation(
  input: PowerpointGenerateInput,
  options: PowerpointGeneratorOptions = {},
): Promise<PowerpointGenerationResult> {
  if (options.signal?.aborted) {
    const error = new Error("PowerPoint generation cancelled before start");
    error.name = "AbortError";
    throw error;
  }
  const spec = buildPowerpointSpec(input, options);
  return generate(spec, options.signal, options.hooks);
}

export { validate_pptx as validatePptx } from "./renderer.js";
export type { GeneratorHooks, PowerpointGenerationResult } from "./renderer.js";
