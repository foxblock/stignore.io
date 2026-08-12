import { IGNORE_BLOCKS } from "./blocks.js";

// Normalize comma-separated or array input while preserving first occurrence.
export function normalizePatternIds(input) {
  const rawIds = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : [];
  const ids = [];
  const seen = new Set();

  for (const rawId of rawIds) {
    const id = String(rawId ?? "")
      .trim()
      .toLowerCase();
    if (id.length === 0 || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }

  return ids;
}

// Build deterministic .stignore text and report recognized and unknown IDs.
export function generateIgnoreFile(input, blocks = IGNORE_BLOCKS) {
  const requestedIds = normalizePatternIds(input);
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const selectedBlocks = [];
  const unknownIds = [];

  for (const id of requestedIds) {
    const block = blocksById.get(id);
    if (block) {
      selectedBlocks.push(block);
    } else {
      unknownIds.push(id);
    }
  }

  const sections = selectedBlocks.map(
    (block) => `${block.title}\n${block.patterns.replace(/\r\n?/g, "\n").trimEnd()}`,
  );
  if (unknownIds.length > 0) {
    sections.unshift(
      `// WARNING: Unknown block IDs skipped: ${unknownIds.join(", ")}`,
    );
  }

  const text = sections.length > 0 ? `${sections.join("\n\n")}\n` : "";
  return {
    text,
    requestedIds,
    selectedIds: selectedBlocks.map((block) => block.id),
    unknownIds,
  };
}

