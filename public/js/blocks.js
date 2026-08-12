const BLOCK_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Normalize hand-edited multiline values without changing pattern order.
function normalizeMultiline(value) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd();
}

// Validate and freeze editable block definitions at startup.
export function createIgnoreBlocks(rawBlocks) {
  if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
    throw new TypeError("Ignore block catalog must be a non-empty array.");
  }

  const ids = new Set();
  const blocks = rawBlocks.map((rawBlock, blockIndex) => {
    if (rawBlock === null || typeof rawBlock !== "object") {
      throw new TypeError(`Ignore block ${blockIndex} must be an object.`);
    }

    const id = typeof rawBlock.id === "string" ? rawBlock.id.trim() : "";
    const name = typeof rawBlock.name === "string" ? rawBlock.name.trim() : "";
    const title = typeof rawBlock.title === "string" ? rawBlock.title.trim() : "";
    const patterns =
      typeof rawBlock.patterns === "string"
        ? normalizeMultiline(rawBlock.patterns)
        : "";

    if (!BLOCK_ID_PATTERN.test(id)) {
      throw new TypeError(
        `Ignore block ${blockIndex} has invalid id "${id}". Use lowercase ASCII letters, numbers, and internal hyphens.`,
      );
    }
    if (ids.has(id)) {
      throw new TypeError(`Ignore block ${blockIndex} has duplicate id "${id}".`);
    }
    if (name.length === 0) {
      throw new TypeError(`Ignore block ${blockIndex} has an empty name.`);
    }
    if (!title.startsWith("//")) {
      throw new TypeError(
        `Ignore block ${blockIndex} title must start with "//".`,
      );
    }
    if (patterns.length === 0) {
      throw new TypeError(`Ignore block ${blockIndex} has empty patterns.`);
    }

    ids.add(id);
    return Object.freeze({ id, name, title, patterns });
  });

  return Object.freeze(blocks);
}

// Edit this list to add or update available Syncthing ignore blocks.
export const IGNORE_BLOCKS = createIgnoreBlocks([
  {
    id: "windows",
    name: "Windows Temp Files",
    title: "//---Windows-Specific---//",
    patterns: `(?d)desktop.ini
(?d)Thumbs.db
(?d)ehthumbs.db
(?d)$RECYCLE.BIN
(?d)System Volume Information`,
  },
  {
    id: "macos",
    name: "macOS Metadata Files",
    title: "//---macOS-Specific---//",
    patterns: `(?d).DS_Store
(?d).AppleDouble
(?d)._*
(?d).LSOverride
(?d).Spotlight-V100
(?d).TemporaryItems
(?d).Trashes
(?d).fseventsd
(?d).com.apple.timemachine.donotpresent`,
  },
  {
    id: "linux",
    name: "Linux Temp Files",
    title: "//---Linux-Specific---//",
    patterns: `(?d)*~
(?d).directory
(?d).Trash-*`,
  },
  {
    id: "unity",
    name: "Unity Generated Files",
    title: "//---Unity-Generated---//",
    patterns: `/[Ll]ibrary
/[Tt]emp
/[Oo]bj
/[Bb]uild
/[Bb]uilds
/[Ll]ogs
/[Uu]ser[Ss]ettings
/[Mm]emoryCaptures
/[Rr]ecordings`,
  },
  {
    id: "unrealengine",
    name: "Unreal Engine Generated Files",
    title: "//---Unreal-Engine-Generated---//",
    patterns: `/.vs
/Binaries
/DerivedDataCache
/Intermediate
/Saved
/*.VC.db
/*.opensdf
/*.sdf
/*.sln
/*.suo`,
  },
]);

