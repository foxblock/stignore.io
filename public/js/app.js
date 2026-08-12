import { IGNORE_BLOCKS } from "./blocks.js";
import { generateIgnoreFile } from "./generator.js";
import {
  buildSelectionSearch,
  findBlockSuggestions,
  parseSelection,
} from "./ui-state.js";

const elements = {
  apiLink: document.querySelector("#api-link"),
  apiOrigin: document.querySelector("#api-origin"),
  blockCount: document.querySelector("#block-count"),
  copyButton: document.querySelector("#copy-button"),
  copyButtonLabel: document.querySelector("#copy-button-label"),
  copyStatus: document.querySelector("#copy-status"),
  input: document.querySelector("#block-input"),
  lineCount: document.querySelector("#line-count"),
  output: document.querySelector("#ignore-output"),
  outputPanel: document.querySelector("#output-panel"),
  selectedBlocks: document.querySelector("#selected-blocks"),
  selectionStatus: document.querySelector("#selection-status"),
  suggestions: document.querySelector("#block-suggestions"),
  tokenInput: document.querySelector("#token-input"),
};

const blocksById = new Map(IGNORE_BLOCKS.map((block) => [block.id, block]));
let selectedIds = [];
let visibleSuggestions = [];
let activeSuggestionIndex = -1;
let copyStatusTimer;

// Announce state changes without interrupting current keyboard focus.
function announce(message) {
  elements.selectionStatus.textContent = "";
  window.requestAnimationFrame(() => {
    elements.selectionStatus.textContent = message;
  });
}

// Keep query state readable and compatible with the plain-text API.
function writeHistory(mode = "push") {
  const search = buildSelectionSearch(selectedIds);
  const nextUrl = `${window.location.pathname}${search}${window.location.hash}`;
  const method = mode === "replace" ? "replaceState" : "pushState";
  window.history[method]({ patterns: [...selectedIds] }, "", nextUrl);
}

// Build shareable page URL used as generated-file provenance.
function buildGeneratorUrl() {
  const url = new URL(window.location.href);
  url.search = buildSelectionSearch(selectedIds);
  url.hash = "";
  return url.href;
}

// Render selected blocks as removable, keyboard-accessible chips.
function renderSelectedBlocks() {
  elements.selectedBlocks.replaceChildren();
  for (const id of selectedIds) {
    const block = blocksById.get(id);
    const chip = document.createElement("span");
    chip.className = "block-chip";

    const name = document.createElement("span");
    name.textContent = block.name;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-chip";
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove ${block.name}`);
    removeButton.addEventListener("click", () => removeBlock(id));

    chip.append(name, removeButton);
    elements.selectedBlocks.append(chip);
  }

  const count = selectedIds.length;
  elements.blockCount.textContent = `${count} selected`;
  elements.input.placeholder =
    count === IGNORE_BLOCKS.length
      ? "All blocks selected"
      : count > 0
        ? "Add another block…"
        : "Try Windows, macOS, Unity…";
}

// Regenerate output and transition layout when selection becomes non-empty.
function renderOutput() {
  const result = generateIgnoreFile(selectedIds, buildGeneratorUrl());
  const hasSelection = selectedIds.length > 0;
  const lineCount = result.text
    ? result.text.trimEnd().split("\n").length
    : 0;

  document.body.classList.toggle("has-selection", hasSelection);
  elements.output.value = result.text;
  elements.outputPanel.inert = !hasSelection;
  elements.outputPanel.setAttribute("aria-hidden", String(!hasSelection));
  elements.copyButton.disabled = !hasSelection;
  elements.lineCount.textContent = `${lineCount} ${lineCount === 1 ? "line" : "lines"}`;
  elements.apiLink.href = `/api${buildSelectionSearch(selectedIds)}`;
}

// Update one option's visual and assistive-technology focus state.
function setActiveSuggestion(nextIndex) {
  if (visibleSuggestions.length === 0) {
    activeSuggestionIndex = -1;
    elements.input.removeAttribute("aria-activedescendant");
    return;
  }

  activeSuggestionIndex =
    (nextIndex + visibleSuggestions.length) % visibleSuggestions.length;
  const options = elements.suggestions.querySelectorAll('[role="option"]');
  options.forEach((option, optionIndex) => {
    const isActive = optionIndex === activeSuggestionIndex;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-selected", String(isActive));
  });

  const activeOption = options[activeSuggestionIndex];
  elements.input.setAttribute("aria-activedescendant", activeOption.id);
  activeOption.scrollIntoView({ block: "nearest" });
}

// Close suggestion popup and clear virtual listbox focus.
function closeSuggestions() {
  elements.suggestions.hidden = true;
  elements.input.setAttribute("aria-expanded", "false");
  elements.input.removeAttribute("aria-activedescendant");
  visibleSuggestions = [];
  activeSuggestionIndex = -1;
}

// Filter and render listbox options from ID and human-readable name.
function openSuggestions() {
  visibleSuggestions = findBlockSuggestions(
    elements.input.value,
    selectedIds,
  );
  elements.suggestions.replaceChildren();

  if (visibleSuggestions.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-suggestion";
    empty.textContent =
      selectedIds.length === IGNORE_BLOCKS.length
        ? "All available blocks are selected."
        : "No matching block.";
    elements.suggestions.append(empty);
    activeSuggestionIndex = -1;
    elements.input.removeAttribute("aria-activedescendant");
  } else {
    for (const [optionIndex, block] of visibleSuggestions.entries()) {
      const option = document.createElement("li");
      option.className = "suggestion";
      option.id = `block-option-${block.id}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");

      const name = document.createElement("span");
      name.className = "suggestion-name";
      name.textContent = block.name;

      const id = document.createElement("span");
      id.className = "suggestion-id";
      id.textContent = block.id;

      option.append(name, id);
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => addBlock(block.id));
      option.addEventListener("pointermove", () => setActiveSuggestion(optionIndex));
      elements.suggestions.append(option);
    }
  }

  elements.suggestions.hidden = false;
  elements.input.setAttribute("aria-expanded", "true");
  if (visibleSuggestions.length > 0) {
    setActiveSuggestion(0);
  }
}

// Add a catalog block once and record shareable browser history.
function addBlock(id) {
  const block = blocksById.get(id);
  if (!block || selectedIds.includes(id)) {
    return;
  }

  selectedIds = [...selectedIds, id];
  elements.input.value = "";
  renderSelectedBlocks();
  renderOutput();
  writeHistory();
  closeSuggestions();
  elements.input.focus();
  announce(`${block.name} added. ${selectedIds.length} selected.`);
}

// Remove a selected block while preserving remaining selection order.
function removeBlock(id) {
  const block = blocksById.get(id);
  if (!block || !selectedIds.includes(id)) {
    return;
  }

  selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
  renderSelectedBlocks();
  renderOutput();
  writeHistory();
  closeSuggestions();
  elements.input.focus();
  announce(`${block.name} removed. ${selectedIds.length} selected.`);
}

// Restore URL state without producing another history entry.
function restoreFromLocation({ replaceInvalid = false } = {}) {
  const parsed = parseSelection(window.location.search);
  selectedIds = parsed.selectedIds;
  elements.input.value = "";
  renderSelectedBlocks();
  renderOutput();
  closeSuggestions();

  if (replaceInvalid && parsed.unknownIds.length > 0) {
    writeHistory("replace");
    announce(`Unknown block IDs removed: ${parsed.unknownIds.join(", ")}.`);
  }
}

// Copy generated text with a selection fallback for restricted browsers.
async function copyOutput() {
  if (elements.output.value.length === 0) {
    return;
  }

  window.clearTimeout(copyStatusTimer);
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard API unavailable");
    }
    await navigator.clipboard.writeText(elements.output.value);
    elements.copyButtonLabel.textContent = "Copied";
    elements.copyStatus.textContent = "Copied .stignore to clipboard.";
    copyStatusTimer = window.setTimeout(() => {
      elements.copyButtonLabel.textContent = "Copy file";
      elements.copyStatus.textContent = "";
    }, 1800);
  } catch {
    elements.output.focus();
    elements.output.select();
    elements.copyButtonLabel.textContent = "Select text";
    elements.copyStatus.textContent =
      "Clipboard access unavailable. Text selected for manual copy.";
  }
}

elements.tokenInput.addEventListener("click", (event) => {
  if (event.target === elements.tokenInput) {
    elements.input.focus();
  }
});

elements.input.addEventListener("focus", openSuggestions);
elements.input.addEventListener("input", openSuggestions);
elements.input.addEventListener("keydown", (event) => {
  const isOpen = elements.input.getAttribute("aria-expanded") === "true";

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!isOpen) {
      openSuggestions();
    } else {
      setActiveSuggestion(activeSuggestionIndex + 1);
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen) {
      openSuggestions();
      setActiveSuggestion(visibleSuggestions.length - 1);
    } else {
      setActiveSuggestion(activeSuggestionIndex - 1);
    }
  } else if (
    event.key === "Enter" &&
    isOpen &&
    activeSuggestionIndex >= 0
  ) {
    event.preventDefault();
    addBlock(visibleSuggestions[activeSuggestionIndex].id);
  } else if (event.key === "Escape" && isOpen) {
    event.preventDefault();
    closeSuggestions();
  } else if (
    event.key === "Backspace" &&
    elements.input.value.length === 0 &&
    selectedIds.length > 0
  ) {
    event.preventDefault();
    removeBlock(selectedIds.at(-1));
  } else if (event.key === "Tab") {
    closeSuggestions();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (
    !elements.tokenInput.contains(event.target) &&
    !elements.suggestions.contains(event.target)
  ) {
    closeSuggestions();
  }
});

elements.copyButton.addEventListener("click", copyOutput);
window.addEventListener("popstate", () => restoreFromLocation());

elements.apiOrigin.textContent = window.location.origin;
restoreFromLocation({ replaceInvalid: true });
