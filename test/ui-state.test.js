import assert from "node:assert/strict";
import test from "node:test";

import { IGNORE_BLOCKS } from "../public/js/blocks.js";
import {
  buildSelectionSearch,
  findBlockSuggestions,
  parseSelection,
} from "../public/js/ui-state.js";

test("test_parse_selection_restores_known_ids_and_reports_unknown_ids", () => {
  assert.deepEqual(
    parseSelection("?patterns=Unity,missing,windows,unity"),
    {
      selectedIds: ["unity", "windows"],
      unknownIds: ["missing"],
    },
  );
});

test("test_build_selection_search_is_readable_and_empty_when_clear", () => {
  assert.equal(
    buildSelectionSearch(["windows", "unity"]),
    "?patterns=windows,unity",
  );
  assert.equal(buildSelectionSearch([]), "");
});

test("test_suggestions_match_name_and_id_and_exclude_selected", () => {
  assert.deepEqual(
    findBlockSuggestions("engine", []).map((block) => block.id),
    ["unrealengine"],
  );
  assert.deepEqual(
    findBlockSuggestions("files", ["windows"]).map((block) => block.id),
    ["macos", "linux", "unity", "unrealengine"],
  );
});

test("test_suggestions_rank_prefix_before_substring_in_catalog_order", () => {
  const blocks = [
    { id: "first", name: "Alpha Tool" },
    { id: "toolbox", name: "Second" },
    { id: "third", name: "Tool Cache" },
  ];

  assert.deepEqual(
    findBlockSuggestions("tool", [], blocks).map((block) => block.id),
    ["toolbox", "third", "first"],
  );
});

test("test_empty_suggestion_query_returns_remaining_catalog_order", () => {
  assert.deepEqual(
    findBlockSuggestions("", ["macos", "unity"]).map((block) => block.id),
    IGNORE_BLOCKS.map((block) => block.id).filter(
      (id) => id !== "macos" && id !== "unity",
    ),
  );
});
