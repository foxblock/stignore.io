import assert from "node:assert/strict";
import test from "node:test";

import { createIgnoreBlocks, IGNORE_BLOCKS } from "../public/js/blocks.js";
import {
  generateIgnoreFile,
  normalizePatternIds,
} from "../public/js/generator.js";

test("test_catalog_has_valid_frozen_blocks", () => {
  assert.equal(IGNORE_BLOCKS.length, 5);
  assert.equal(new Set(IGNORE_BLOCKS.map((block) => block.id)).size, 5);
  assert.ok(Object.isFrozen(IGNORE_BLOCKS));
  for (const block of IGNORE_BLOCKS) {
    assert.ok(Object.isFrozen(block));
    assert.match(block.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(block.title.startsWith("//"));
    assert.equal(block.patterns.includes("\r"), false);
  }
});

test("test_catalog_rejects_invalid_and_duplicate_ids", () => {
  const validBlock = {
    id: "valid",
    name: "Valid",
    title: "// Valid",
    patterns: "*.tmp",
  };

  assert.throws(
    () => createIgnoreBlocks([{ ...validBlock, id: "Not Valid" }]),
    /invalid id/,
  );
  assert.throws(
    () => createIgnoreBlocks([validBlock, validBlock]),
    /duplicate id/,
  );
  assert.throws(
    () => createIgnoreBlocks([{ ...validBlock, title: "Not a comment" }]),
    /must start with/,
  );
});

test("test_catalog_normalizes_multiline_patterns", () => {
  const [block] = createIgnoreBlocks([
    {
      id: "sample",
      name: "Sample",
      title: "// Sample",
      patterns: "one  \r\ntwo\r\n\r\n",
    },
  ]);

  assert.equal(block.patterns, "one\ntwo");
});

test("test_normalize_pattern_ids_preserves_order_and_removes_duplicates", () => {
  assert.deepEqual(normalizePatternIds(" Unity, WINDOWS,unity, ,macos "), [
    "unity",
    "windows",
    "macos",
  ]);
  assert.deepEqual(normalizePatternIds(["linux", null, "LINUX", "macos"]), [
    "linux",
    "macos",
  ]);
  assert.deepEqual(normalizePatternIds(undefined), []);
});

test("test_generate_single_block_with_final_lf", () => {
  const result = generateIgnoreFile("windows");

  assert.deepEqual(result.selectedIds, ["windows"]);
  assert.deepEqual(result.unknownIds, []);
  assert.ok(result.text.startsWith("//---Windows-Specific---//\n"));
  assert.ok(result.text.includes("(?d)Thumbs.db\n"));
  assert.equal(result.text.endsWith("\n"), true);
  assert.equal(result.text.endsWith("\n\n"), false);
});

test("test_generate_multiple_blocks_preserves_request_order", () => {
  const result = generateIgnoreFile("unity,windows,unity");
  const unityIndex = result.text.indexOf("//---Unity-Generated---//");
  const windowsIndex = result.text.indexOf("//---Windows-Specific---//");

  assert.deepEqual(result.selectedIds, ["unity", "windows"]);
  assert.ok(unityIndex >= 0 && windowsIndex > unityIndex);
  assert.match(result.text, /\/\[Rr\]ecordings\n\n\/\/---Windows/);
});

test("test_generate_skips_unknown_ids_with_warning", () => {
  const result = generateIgnoreFile("missing,macos,other");

  assert.deepEqual(result.selectedIds, ["macos"]);
  assert.deepEqual(result.unknownIds, ["missing", "other"]);
  assert.ok(
    result.text.startsWith(
      "// WARNING: Unknown block IDs skipped: missing, other\n\n",
    ),
  );
  assert.ok(result.text.includes("//---macOS-Specific---//"));
});

test("test_generate_empty_input_returns_empty_text", () => {
  assert.deepEqual(generateIgnoreFile(""), {
    text: "",
    requestedIds: [],
    selectedIds: [],
    unknownIds: [],
  });
});

