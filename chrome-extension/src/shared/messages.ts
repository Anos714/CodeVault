/** Cross-context messages and the pending-save handoff. */

import type { PendingSave } from "./types";

export const PENDING_SAVE_KEY = "codevault.pendingSave";

export type RuntimeMessage =
  | { type: "codevault:save-selection" }
  | { type: "codevault:save-page" };

export type RuntimeResponse = { ok: boolean; error?: string };

export async function setPendingSave(pending: PendingSave): Promise<void> {
  await chrome.storage.session.set({ [PENDING_SAVE_KEY]: pending });
}

function isPendingSave(value: unknown): value is PendingSave {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.title === "string" &&
    typeof record.code === "string" &&
    typeof record.url === "string" &&
    typeof record.language === "string" &&
    (record.visibility === "private" || record.visibility === "public")
  );
}

/** Read the pending save and clear it in the same round-trip. */
export async function takePendingSave(): Promise<PendingSave | null> {
  const stored = await chrome.storage.session.get(PENDING_SAVE_KEY);
  await chrome.storage.session.remove(PENDING_SAVE_KEY);
  const value = stored[PENDING_SAVE_KEY];
  return isPendingSave(value) ? value : null;
}
