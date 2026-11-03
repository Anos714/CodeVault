/**
 * Save window opened by the context menu / keyboard shortcut.
 *
 * Reads the `PendingSave` handed over through `chrome.storage.session`, lets
 * the user confirm language + visibility, then POSTs to `/api/v1/snippets`.
 */

import { CodeVaultApiError, CodeVaultClient } from "./shared/api";
import { takePendingSave } from "./shared/messages";
import { getSettings, isConnected } from "./shared/storage";
import {
  LANGUAGES,
  type Language,
  type PendingSave,
  type Settings,
  type Visibility,
} from "./shared/types";
import { snippetWebUrl } from "./shared/url";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

const savePanel = el("save-panel");
const successPanel = el("success-panel");
const successMessage = el("success-message");
const source = el("source");
const titleInput = el<HTMLInputElement>("title");
const languageSelect = el<HTMLSelectElement>("language");
const visibilitySelect = el<HTMLSelectElement>("visibility");
const tagsInput = el<HTMLInputElement>("tags");
const codeInput = el<HTMLTextAreaElement>("code");
const status = el("status");
const saveButton = el<HTMLButtonElement>("save");

let pending: PendingSave | null = null;
let settings: Settings;
let client: CodeVaultClient | null = null;
let saving = false;

function setStatus(message: string, kind: "muted" | "error" | "success" = "muted") {
  status.textContent = message;
  status.className = `status${kind === "muted" ? "" : ` ${kind}`}`;
}

function label(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fillLanguages(selected: Language) {
  languageSelect.replaceChildren();
  for (const language of LANGUAGES) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = label(language);
    if (language === selected) option.selected = true;
    languageSelect.append(option);
  }
}

function parseTags(): string[] {
  return tagsInput.value
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
    .filter(Boolean)
    .slice(0, 5);
}

async function save() {
  if (saving || !pending) return;

  const title = titleInput.value.trim();
  const code = codeInput.value;
  if (!title) {
    setStatus("Give the snippet a title.", "error");
    titleInput.focus();
    return;
  }
  if (!code.trim()) {
    setStatus("There is no code to save.", "error");
    codeInput.focus();
    return;
  }
  if (!client) {
    setStatus("Connect your account in the extension settings first.", "error");
    return;
  }

  saving = true;
  saveButton.disabled = true;
  setStatus("Saving…");

  try {
    const snippet = await client.createSnippet({
      title,
      language: languageSelect.value as Language,
      code,
      visibility: visibilitySelect.value as Visibility,
      tags: parseTags(),
    });

    savePanel.classList.add("hidden");
    successPanel.classList.remove("hidden");
    successMessage.textContent = `Saved “${snippet.title}” to your vault.`;
    el("open-snippet").addEventListener("click", () => {
      void chrome.tabs.create({
        url: snippetWebUrl(settings.baseUrl, snippet.id),
      });
      window.close();
    });
  } catch (error) {
    if (error instanceof CodeVaultApiError && error.status === 401) {
      setStatus("Token rejected — open the extension settings and reconnect.", "error");
    } else {
      setStatus(
        error instanceof Error ? error.message : "Could not save the snippet.",
        "error",
      );
    }
    saveButton.disabled = false;
  } finally {
    saving = false;
  }
}

async function init() {
  pending = await takePendingSave();
  if (!pending) {
    savePanel.classList.add("hidden");
    setStatus("No pending save. Open this window from the extension menu.", "error");
    return;
  }

  settings = await getSettings();
  titleInput.value = pending.title;
  codeInput.value = pending.code;
  visibilitySelect.value = pending.visibility;
  fillLanguages(pending.language);
  source.textContent = pending.url || "—";
  source.title = pending.url;

  if (isConnected(settings) && settings.token) {
    client = new CodeVaultClient({
      baseUrl: settings.baseUrl,
      token: settings.token,
    });
  } else {
    setStatus("Not connected — open the extension settings first.", "error");
    saveButton.disabled = true;
  }

  saveButton.addEventListener("click", () => void save());
  el("cancel").addEventListener("click", () => window.close());
  el("close").addEventListener("click", () => window.close());
  titleInput.focus();
  titleInput.select();
}

void init();
