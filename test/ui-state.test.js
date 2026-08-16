import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSelectionSearch,
  findBlockSuggestions,
  parseSelection,
} from "../public/js/ui-state.js";

const TEST_BLOCKS = [
  { id: "alpha", name: "Game Engine" },
  { id: "engine-tools", name: "Builder" },
  { id: "other", name: "Other Files" },
];

test("test_parse_selection_restores_known_ids_and_reports_unknown_ids", () => {
  assert.deepEqual(
    parseSelection("?patterns=Alpha,missing,engine-tools,alpha", TEST_BLOCKS),
    {
      selectedIds: ["alpha", "engine-tools"],
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
  const engineSuggestionIds = findBlockSuggestions(
    "engine",
    [],
    TEST_BLOCKS,
  ).map((block) => block.id);

  assert.deepEqual(engineSuggestionIds, ["engine-tools", "alpha"]);
  assert.deepEqual(
    findBlockSuggestions("engine", ["alpha"], TEST_BLOCKS).map(
      (block) => block.id,
    ),
    ["engine-tools"],
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
    findBlockSuggestions("", ["engine-tools"], TEST_BLOCKS).map(
      (block) => block.id,
    ),
    ["alpha", "other"],
  );
});
