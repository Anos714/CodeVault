/**
 * Options page: base URL + personal access token.
 *
 * "Save & connect" proves the token with `GET /api/v1/me` before persisting,
 * so the popup never starts in a half-connected state. The stored token is
 * never rendered back into the input — leaving the field blank keeps it.
 */

import { CodeVaultApiError, CodeVaultClient } from "./shared/api";
import { disconnect, getSettings, saveSettings } from "./shared/storage";
import { isApiToken } from "./shared/token";
import type { Settings, Visibility } from "./shared/types";
import { normalizeBaseUrl, settingsWebUrl } from "./shared/url";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

const form = el<HTMLFormElement>("settings-form");
const baseUrlInput = el<HTMLInputElement>("base-url");
const tokenInput = el<HTMLInputElement>("token");
const visibilitySelect = el<HTMLSelectElement>("default-visibility");
const status = el("status");
const createLink = el<HTMLAnchorElement>("create-token-link");
const saveButton = el<HTMLButtonElement>("save");
const testButton = el<HTMLButtonElement>("test");
const disconnectButton = el<HTMLButtonElement>("disconnect");

let current: Settings;
let busy = false;

function setStatus(message: string, kind: "muted" | "error" | "success" = "muted") {
  status.textContent = message;
  status.className = `status${kind === "muted" ? "" : ` ${kind}`}`;
}

function setBusy(value: boolean) {
  busy = value;
  saveButton.disabled = value;
  testButton.disabled = value;
  disconnectButton.disabled = value;
}

function updateCreateLink() {
  try {
    createLink.href = settingsWebUrl(baseUrlInput.value);
  } catch {
    createLink.href = "#";
  }
}

function selectedVisibility(): Visibility {
  return visibilitySelect.value === "public" ? "public" : "private";
}

function resolveToken(): string | null {
  const typed = tokenInput.value.trim();
  return typed || current.token;
}

async function verify(baseUrl: string, token: string) {
  return new CodeVaultClient({ baseUrl, token }).me();
}

async function handleSave(event: SubmitEvent) {
  event.preventDefault();
  if (busy) return;
  setBusy(true);
  setStatus("Checking the token…");

  try {
    const baseUrl = normalizeBaseUrl(baseUrlInput.value);
    const token = resolveToken();
    if (!token) {
      setStatus("Paste a personal access token first.", "error");
      return;
    }
    if (!isApiToken(token)) {
      setStatus("That does not look like a CodeVault token (cv_pat_…).", "error");
      return;
    }

    const user = await verify(baseUrl, token);
    current = await saveSettings({
      baseUrl,
      token,
      defaultVisibility: selectedVisibility(),
    });
    tokenInput.value = "";
    tokenInput.placeholder = "•••••••• connected — leave blank to keep";
    baseUrlInput.value = current.baseUrl;
    setStatus(`Connected as ${user.name} <${user.email}>.`, "success");
  } catch (error) {
    setStatus(
      error instanceof CodeVaultApiError || error instanceof Error
        ? error.message
        : "Could not connect.",
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function handleTest() {
  if (busy) return;
  setBusy(true);
  setStatus("Testing…");
  try {
    const baseUrl = normalizeBaseUrl(baseUrlInput.value);
    const token = resolveToken();
    if (!token) {
      setStatus("Paste a personal access token first.", "error");
      return;
    }
    if (!isApiToken(token)) {
      setStatus("That does not look like a CodeVault token (cv_pat_…).", "error");
      return;
    }
    const user = await verify(baseUrl, token);
    setStatus(`Token works — ${user.name} <${user.email}>.`, "success");
  } catch (error) {
    setStatus(
      error instanceof Error ? error.message : "Connection failed.",
      "error",
    );
  } finally {
    setBusy(false);
  }
}

async function handleDisconnect() {
  if (busy) return;
  setBusy(true);
  try {
    current = await disconnect();
    tokenInput.value = "";
    tokenInput.placeholder = "cv_pat_…";
    setStatus("Disconnected. The token was removed from this device.", "success");
  } catch {
    setStatus("Could not clear the token.", "error");
  } finally {
    setBusy(false);
  }
}

async function init() {
  current = await getSettings();
  baseUrlInput.value = current.baseUrl;
  visibilitySelect.value = current.defaultVisibility;
  updateCreateLink();

  if (current.token) {
    tokenInput.placeholder = "•••••••• connected — leave blank to keep";
    try {
      const user = await verify(current.baseUrl, current.token);
      setStatus(`Connected as ${user.name} <${user.email}>.`, "success");
    } catch (error) {
      setStatus(
        error instanceof CodeVaultApiError && error.status === 401
          ? "The saved token was revoked or expired. Paste a new one."
          : "Saved token could not be verified — check the URL.",
        "error",
      );
    }
  } else {
    setStatus("Not connected yet.");
  }

  form.addEventListener("submit", (event) => void handleSave(event));
  testButton.addEventListener("click", () => void handleTest());
  disconnectButton.addEventListener("click", () => void handleDisconnect());
  baseUrlInput.addEventListener("input", updateCreateLink);
}

void init();
