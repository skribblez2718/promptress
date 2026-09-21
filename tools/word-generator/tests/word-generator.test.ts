import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { buildWordSpec, generateWordDocument, validateDocx } from "../index.js";
import { publish_docx_atomically } from "../renderer.js";

const temporaryDirectories: string[] = [];

function temporaryDirectory(): string {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "word-generator-test-"),
  );
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});

describe("word generator", () => {
  it("builds a deterministic, harness-neutral renderer spec", () => {
    const root = temporaryDirectory();
    const spec = buildWordSpec(
      { markdown: "# Report", title: "Quarterly Report" },
      {
        projectRoot: root,
        tempDirectory: root,
        now: new Date(2026, 8, 20, 12, 30, 15),
        invocationId: () => "test-id",
      },
    );

    expect(spec.project_root).toBe(root);
    expect(spec.output_path).toBe(
      path.join(root, "quarterly-report_20260920_123015_test-id.docx"),
    );
  });

  it("rejects ambiguous or oversized Markdown input", () => {
    const root = temporaryDirectory();
    expect(() => buildWordSpec({}, { projectRoot: root })).toThrow(
      /exactly one/,
    );
    expect(() =>
      buildWordSpec(
        { markdown: "too large" },
        { projectRoot: root, maxMarkdownBytes: 2 },
      ),
    ).toThrow(/exceeds/);
  });

  it("snapshots a Markdown file before rendering", () => {
    const root = temporaryDirectory();
    const markdownPath = path.join(root, "source.md");
    fs.writeFileSync(markdownPath, "# Original", "utf8");
    const spec = buildWordSpec(
      { markdown_path: markdownPath },
      { projectRoot: root },
    );
    fs.writeFileSync(markdownPath, "# Changed", "utf8");

    expect(spec.markdown).toBe("# Original");
    expect(spec.markdown_path).toBeUndefined();
  });

  it("does no work when cancellation is already requested", async () => {
    const root = temporaryDirectory();
    const outputPath = path.join(root, "cancelled.docx");
    const controller = new AbortController();
    controller.abort();

    await expect(
      generateWordDocument(
        { markdown: "# Cancelled", output_path: outputPath },
        { projectRoot: root, signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fs.existsSync(outputPath)).toBe(false);
  });

  it("does not publish when cancellation arrives before the atomic rename", async () => {
    const root = temporaryDirectory();
    const sourcePath = path.join(root, "source.docx");
    await generateWordDocument(
      { markdown: "# Source", output_path: sourcePath },
      { projectRoot: root },
    );
    const buffer = fs.readFileSync(sourcePath);
    const cancelledPath = path.join(root, "cancelled-after-validation.docx");
    const controller = new AbortController();
    controller.abort();

    await expect(
      publish_docx_atomically(buffer, cancelledPath, null, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fs.existsSync(cancelledPath)).toBe(false);
  });

  it("generates, validates, and publishes a minimal DOCX", async () => {
    const root = temporaryDirectory();
    const outputPath = path.join(root, "report.docx");
    const result = await generateWordDocument(
      {
        markdown: "# Report\n\n## Summary\n\nGenerated **successfully**.",
        output_path: outputPath,
        theme: "modern",
      },
      { projectRoot: root },
    );

    expect(result.path).toBe(outputPath);
    expect(fs.statSync(outputPath).size).toBeGreaterThan(0);
    await expect(validateDocx(outputPath)).resolves.toMatchObject({
      package_valid: true,
      reopen_valid: true,
    });
  });
});
