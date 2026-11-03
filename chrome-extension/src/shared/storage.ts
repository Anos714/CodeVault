/**
 * Settings persistence in `chrome.storage.local`.
 *
 * The token lives only on this device (never `storage.sync`), matching the
 * "treat it like a password" model. `coerceSettings` repairs partial or
 * hand-edited values so the UI always gets a complete `Settings` object.
 */

import { DEFAULT_SETTINGS, type Settings, type Visibility } from "./types";
import { normalizeBaseUrl } from "./url";

export const SETTINGS_KEY = "codevault.settings";

export function coerceSettings(value: unknown): Settings {
  const record =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  let baseUrl = DEFAULT_SETTINGS.baseUrl;
  if (typeof record.baseUrl === "string" && record.baseUrl.trim()) {
    try {
      baseUrl = normalizeBaseUrl(record.baseUrl);
    } catch {
      baseUrl = DEFAULT_SETTINGS.baseUrl;
    }
  }

  const token =
    typeof record.token === "string" && record.token.trim()
      ? record.token.trim()
      : null;

  const defaultVisibility: Visibility =
    record.defaultVisibility === "public" ? "public" : "private";

  return { baseUrl, token, defaultVisibility };
}

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  return coerceSettings(stored[SETTINGS_KEY]);
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next = coerceSettings({ ...current, ...patch });
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

export async function disconnect(): Promise<Settings> {
  return saveSettings({ token: null });
}

export function isConnected(settings: Settings): boolean {
  return typeof settings.token === "string" && settings.token.length > 0;
}
