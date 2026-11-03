/**
 * Popup: account chip, "save selection", and a live search over the vault.
 * All DOM is built with `textContent` — snippet titles/code are untrusted and
 * must never be interpolated into HTML.
 */

import { CodeVaultApiError, CodeVaultClient } from "./shared/api";
import type { RuntimeMessage, RuntimeResponse } from "./shared/messages";
import { getSettings, isConnected } from "./shared/storage";
import type { Settings, Snippet } from "./shared/types";
import { snippetWebUrl, vaultWebUrl } from "./shared/url";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

const account = el("account");
const connectPanel = el("connect-panel");
const connectMessage = el("connect-message");
const vaultPanel = el("vault-panel");
const status = el("status");
const snippetsList = el("snippets");
const search = el<HTMLInputElement>("search");

let settings: Settings;
let client: CodeVaultClient | null = null;
let searchTimer: ReturnType<typeof setTimeout> | undefined;

function setStatus(message: string, kind: "muted" | "error" | "success" = "muted") {
  status.textContent = message;
  status.className = `status${kind === "muted" ? "" : ` ${kind}`}`;
}

function showConnect(message?: string) {
  vaultPanel.classList.add("hidden");
  connectPanel.classList.remove("hidden");
  account.textContent = "Not connected";
  if (message) connectMessage.textContent = message;
}

function showVault() {
  connectPanel.classList.add("hidden");
  vaultPanel.classList.remove("hidden");
}

function renderSnippets(snippets: Snippet[]) {
  snippetsList.replaceChildren();

  if (snippets.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = search.value.trim()
      ? "No snippets match that search."
      : "Your vault is empty. Save a selection to get started.";
    snippetsList.append(empty);
    return;
  }

  for (const snippet of snippets) {
    const item = document.createElement("li");
    item.className = "snippet";

    const body = document.createElement("div");
    body.className = "body";

    const title = document.createElement("button");
    title.type = "button";
    title.className = "title";
    title.textContent = snippet.title;
    title.title = snippet.title;
    title.addEventListener("click", () => {
      void chrome.tabs.create({
        url: snippetWebUrl(settings.baseUrl, snippet.id),
      });
    });

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = `${snippet.language} · ${snippet.visibility} · ${snippet.favorites}★`;

    body.append(title, meta);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "button copy";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => {
      void navigator.clipboard
        .writeText(snippet.code)
        .then(() => setStatus(`Copied “${snippet.title}”.`, "success"))
        .catch(() => setStatus("Could not copy — check clipboard permission.", "error"));
    });

    item.append(body, copy);
    snippetsList.append(item);
  }
}

async function loadSnippets() {
  if (!client) return;
  setStatus(search.value.trim() ? "Searching…" : "Loading…");
  try {
    const result = await client.listSnippets({
      q: search.value.trim(),
      limit: 12,
      sort: "updated",
    });
    renderSnippets(result.snippets);
    setStatus(
      result.total === 0
        ? ""
        : `${result.total} snippet${result.total === 1 ? "" : "s"}${result.nextCursor ? " · more available" : ""}`,
    );
  } catch (error) {
    if (error instanceof CodeVaultApiError && error.status === 401) {
      showConnect("Your token was rejected. Reconnect in settings.");
      return;
    }
    renderSnippets([]);
    setStatus(
      error instanceof Error ? error.message : "Could not load snippets.",
      "error",
    );
  }
}

async function loadAccount() {
  if (!client) return;
  try {
    const user = await client.me();
    account.textContent = `${user.name} · ${user.email}`;
    account.title = `${user.name} <${user.email}>`;
  } catch (error) {
    if (error instanceof CodeVaultApiError && error.status === 401) {
      showConnect("Your token was rejected. Reconnect in settings.");
      return;
    }
    setStatus(
      error instanceof Error ? error.message : "Could not load account.",
      "error",
    );
  }
}

async function saveSelection() {
  setStatus("Opening the save form…");
  try {
    const response = await chrome.runtime.sendMessage<
      RuntimeMessage,
      RuntimeResponse
    >({ type: "codevault:save-selection" });
    if (response?.ok) {
      window.close();
      return;
    }
    setStatus(response?.error ?? "Could not open the save form.", "error");
  } catch {
    setStatus("Could not reach the extension worker. Reload the extension.", "error");
  }
}

async function init() {
  settings = await getSettings();

  el("settings").addEventListener("click", () => {
    void chrome.runtime.openOptionsPage();
  });
  el("connect-button").addEventListener("click", () => {
    void chrome.runtime.openOptionsPage();
  });
  el("save-selection").addEventListener("click", () => void saveSelection());
  el("open-vault").addEventListener("click", () => {
    void chrome.tabs.create({ url: vaultWebUrl(settings.baseUrl) });
  });

  search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void loadSnippets(), 250);
  });

  if (!isConnected(settings) || !settings.token) {
    showConnect(
      "Connect your CodeVault account to save selections and search your snippets from any page.",
    );
    return;
  }

  showVault();
  client = new CodeVaultClient({
    baseUrl: settings.baseUrl,
    token: settings.token,
  });
  await Promise.all([loadAccount(), loadSnippets()]);
}

void init();
