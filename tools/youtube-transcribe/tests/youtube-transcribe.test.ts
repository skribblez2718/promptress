import { describe, expect, it } from "vitest";

import {
  extractVideoId,
  transcribeYoutube,
  transcriptToSRT,
  type TranscriptProvider,
} from "../index.js";

const VIDEO_ID = "ogTLWGBc3cE";

function providerWithCue(text = "caption"): TranscriptProvider {
  return {
    async fetchTranscript() {
      return {
        snippets: [{ text, offset: 0, duration: 1_500, lang: "en" }],
        timingUnit: "milliseconds",
      };
    },
  };
}

describe("youtube transcript functions", () => {
  it("accepts supported URLs and rejects non-YouTube hosts or malformed IDs", () => {
    expect(extractVideoId(VIDEO_ID)).toBe(VIDEO_ID);
    expect(extractVideoId(`https://youtu.be/${VIDEO_ID}?feature=share`)).toBe(
      VIDEO_ID,
    );
    expect(
      extractVideoId(`https://www.youtube.com/watch?v=${VIDEO_ID}&t=12`),
    ).toBe(VIDEO_ID);
    expect(() =>
      extractVideoId(`https://example.com/watch?v=${VIDEO_ID}`),
    ).toThrow(/Unsupported YouTube host/);
    expect(() => extractVideoId(`https://youtu.be/${VIDEO_ID}extra`)).toThrow(
      /11-character video ID/,
    );
  });

  it("fetches through injected harness-neutral dependencies", async () => {
    const result = await transcribeYoutube(
      { url: VIDEO_ID, format: "json", languages: ["en"] },
      {
        dependencies: {
          provider: providerWithCue("Hello"),
          metadataFetch: async () => ({
            async text() {
              return '<title>Fixture - YouTube</title><script>var x={"author":"Example"}</script>';
            },
          }),
        },
      },
    );

    expect(result.metadata.videoId).toBe(VIDEO_ID);
    expect(result.metadata.title).toBe("Fixture");
    expect(result.snippets).toEqual([
      { start: 0, duration: 1.5, text: "Hello" },
    ]);
    expect(result.durationSeconds).toBe(1.5);
  });

  it("formats standards-shaped SRT cue timing", () => {
    expect(
      transcriptToSRT([{ start: 1.25, duration: 2.5, text: "Hello" }]),
    ).toBe("1\n00:00:01,250 --> 00:00:03,750\nHello\n\n");
  });

  it("propagates the timeout signal to an injected provider", async () => {
    const provider: TranscriptProvider = {
      async fetchTranscript(_videoId, _language, signal) {
        return new Promise((_, reject) => {
          signal?.addEventListener(
            "abort",
            () =>
              reject(
                signal.reason instanceof Error
                  ? signal.reason
                  : new Error("aborted"),
              ),
            { once: true },
          );
        });
      },
    };

    await expect(
      transcribeYoutube(
        { url: VIDEO_ID, timeoutMs: 1 },
        {
          dependencies: {
            provider,
            metadataFetch: async () => ({ text: async () => "" }),
          },
        },
      ),
    ).rejects.toThrow(/timed out/);
  });
});
