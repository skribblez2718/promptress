import {
  fetchTranscript,
  MAX_LANGUAGE_PREFERENCES,
  type TranscriptDependencies,
  type TranscriptResult,
} from "./client.js";

export const TRANSCRIPT_FORMATS = ["text", "json", "srt", "webvtt"] as const;
export const DEFAULT_TIMEOUT_MS = 30_000;
export const MAX_TIMEOUT_MS = 300_000;

export type TranscriptFormat = (typeof TRANSCRIPT_FORMATS)[number];

export interface TranscribeYoutubeInput {
  /** YouTube URL or raw 11-character video ID. */
  url: string;
  /** Output format. Defaults to text. */
  format?: TranscriptFormat;
  /** Ordered caption-track preferences. Empty or omitted defaults to English. */
  languages?: string[];
  /** End-to-end timeout in milliseconds. Defaults to 30 seconds; maximum 5 minutes. */
  timeoutMs?: number;
}

export interface TranscribeYoutubeOptions {
  /** Optional caller-owned cancellation signal. */
  signal?: AbortSignal;
  /** Injectable provider and metadata seams for testing or host-controlled networking. */
  dependencies?: TranscriptDependencies;
}

function validateInput(
  input: TranscribeYoutubeInput,
): Required<Pick<TranscribeYoutubeInput, "url">> &
  Omit<TranscribeYoutubeInput, "url"> {
  if (typeof input.url !== "string" || input.url.trim().length === 0) {
    throw new Error("url is required");
  }
  if (
    input.format !== undefined &&
    !TRANSCRIPT_FORMATS.includes(input.format)
  ) {
    throw new Error(`Unsupported transcript format: ${String(input.format)}`);
  }
  if (input.languages !== undefined) {
    if (!Array.isArray(input.languages)) {
      throw new Error("languages must be an array");
    }
    if (input.languages.length > MAX_LANGUAGE_PREFERENCES) {
      throw new Error(
        `At most ${MAX_LANGUAGE_PREFERENCES} language preferences are supported`,
      );
    }
    for (const [index, language] of input.languages.entries()) {
      if (typeof language !== "string") {
        throw new Error(`Language preference ${index + 1} must be a string`);
      }
    }
  }
  if (
    input.timeoutMs !== undefined &&
    (!Number.isSafeInteger(input.timeoutMs) ||
      input.timeoutMs <= 0 ||
      input.timeoutMs > MAX_TIMEOUT_MS)
  ) {
    throw new Error(`timeoutMs must be an integer from 1 to ${MAX_TIMEOUT_MS}`);
  }
  return { ...input, url: input.url.trim() };
}

function operationSignal(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(callerSignal?.reason);
  if (callerSignal?.aborted) {
    forwardAbort();
  } else {
    callerSignal?.addEventListener("abort", forwardAbort, { once: true });
  }
  const timer = setTimeout(
    () =>
      controller.abort(
        new Error(`YouTube transcript request timed out after ${timeoutMs} ms`),
      ),
    timeoutMs,
  );
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      callerSignal?.removeEventListener("abort", forwardAbort);
    },
  };
}

/**
 * Fetch an available caption track and video metadata without registering a harness tool.
 *
 * The function accepts only supported YouTube URLs or video IDs. A host adapter owns user
 * authorization, rate limits, logging, result presentation, and any stronger egress policy.
 */
export async function transcribeYoutube(
  suppliedInput: TranscribeYoutubeInput,
  options: TranscribeYoutubeOptions = {},
): Promise<TranscriptResult> {
  const input = validateInput(suppliedInput);
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const operation = operationSignal(options.signal, timeoutMs);
  try {
    return await fetchTranscript(
      input.url,
      {
        format: input.format,
        languages: input.languages,
        signal: operation.signal,
      },
      options.dependencies,
    );
  } finally {
    operation.cleanup();
  }
}

export {
  extractVideoId,
  TranscriptLanguagesUnavailableError,
  TranscriptProviderResponseError,
  transcriptToSRT,
  transcriptToWebVTT,
  YoutubeTranscriptDisabledErrorClass,
  YoutubeTranscriptNotAvailableLanguageErrorClass,
  YoutubeTranscriptVideoUnavailableErrorClass,
} from "./client.js";
export type {
  MetadataFetch,
  ProviderTimingUnit,
  ProviderTranscriptResult,
  TranscriptDependencies,
  TranscriptProvider,
  TranscriptResult,
  TranscriptSnippet,
} from "./client.js";
