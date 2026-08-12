import { IGNORE_BLOCKS } from "./blocks.js";
import { normalizePatternIds } from "./generator.js";

// Parse shareable query state and separate valid from stale block IDs.
export function parseSelection(search, blocks = IGNORE_BLOCKS) {
  const parameters = new URLSearchParams(search);
  const requestedIds = normalizePatternIds(parameters.get("patterns"));
  const knownIds = new Set(blocks.map((block) => block.id));

  return {
    selectedIds: requestedIds.filter((id) => knownIds.has(id)),
    unknownIds: requestedIds.filter((id) => !knownIds.has(id)),
  };
}

// Build readable query text from already validated catalog IDs.
export function buildSelectionSearch(selectedIds) {
  const ids = normalizePatternIds(selectedIds);
  return ids.length > 0 ? `?patterns=${ids.join(",")}` : "";
}

// Rank prefix matches before substring matches while keeping catalog order.
export function findBlockSuggestions(
  query,
  selectedIds,
  blocks = IGNORE_BLOCKS,
) {
  const normalizedQuery = String(query ?? "")
    .trim()
    .toLowerCase();
  const selected = new Set(normalizePatternIds(selectedIds));
  const candidates = blocks.filter((block) => !selected.has(block.id));

  if (normalizedQuery.length === 0) {
    return candidates;
  }

  const prefixMatches = [];
  const substringMatches = [];
  for (const block of candidates) {
    const id = block.id.toLowerCase();
    const name = block.name.toLowerCase();
    if (id.startsWith(normalizedQuery) || name.startsWith(normalizedQuery)) {
      prefixMatches.push(block);
    } else if (id.includes(normalizedQuery) || name.includes(normalizedQuery)) {
      substringMatches.push(block);
    }
  }

  return [...prefixMatches, ...substringMatches];
}

