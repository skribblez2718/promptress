import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  buildPowerpointSpec,
  generatePowerpointPresentation,
  validatePptx,
} from "../index.js";

const temporaryDirectories: string[] = [];

function temporaryDirectory(): string {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "powerpoint-generator-test-"),
  );
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});

describe("powerpoint generator", () => {
  it("builds a deterministic, harness-neutral renderer spec", () => {
    const root = temporaryDirectory();
    const spec = buildPowerpointSpec(
      {
        title: "Quarterly Review",
        slides: [{ layout: "title", title: "Quarterly Review" }],
      },
      {
        projectRoot: root,
        tempDirectory: root,
        now: new Date(2026, 8, 20, 12, 30, 15),
        invocationId: () => "test-id",
      },
    );

    expect(spec.project_root).toBe(root);
    expect(spec.output_path).toBe(
      path.join(root, "quarterly-review_20260920_123015_test-id.pptx"),
    );
  });

  it("rejects ambiguous and oversized structured input", () => {
    const root = temporaryDirectory();
    expect(() => buildPowerpointSpec({}, { projectRoot: root })).toThrow(
      /exactly one/,
    );
    expect(() =>
      buildPowerpointSpec(
        { slides: [{ layout: "title", title: "A" }] },
        { projectRoot: root, maxStructuredBytes: 1 },
      ),
    ).toThrow(/exceeds/);
  });

  it("does no work when cancellation is already requested", async () => {
    const root = temporaryDirectory();
    const outputPath = path.join(root, "cancelled.pptx");
    const controller = new AbortController();
    controller.abort();

    await expect(
      generatePowerpointPresentation(
        {
          slides: [{ layout: "title", title: "Cancelled" }],
          output_path: outputPath,
        },
        { projectRoot: root, signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fs.existsSync(outputPath)).toBe(false);
  });

  it("generates, validates, and publishes a minimal PPTX", async () => {
    const root = temporaryDirectory();
    const outputPath = path.join(root, "deck.pptx");
    const result = await generatePowerpointPresentation(
      {
        title: "Review",
        output_path: outputPath,
        theme: "modern",
        slides: [
          {
            layout: "title",
            title: "Review",
            subtitle: "Harness-neutral generation",
          },
          {
            layout: "content",
            title: "Summary",
            bullets: ["Editable", "Validated"],
          },
        ],
      },
      { projectRoot: root },
    );

    expect(result.path).toBe(outputPath);
    expect(result.slide_count).toBe(2);
    expect(fs.statSync(outputPath).size).toBeGreaterThan(0);
    await expect(validatePptx(outputPath, 2)).resolves.toMatchObject({
      package_valid: true,
      reopen_valid: true,
      slide_count: 2,
    });
  });
});
