/**
 * MV3 service worker.
 *
 * Owns the context menus and the keyboard shortcut. Both paths collect the
 * selection (or page URL), stash a `PendingSave`, and open `save.html` — a
 * small form so the user can pick a language/visibility before writing to the
 * vault. The popup delegates to the same messages, so behavior is identical.
 */

import {
  PENDING_SAVE_KEY,
  type RuntimeMessage,
  type RuntimeResponse,
} from "./shared/messages";
import type { PendingSave } from "./shared/types";

const SAVE_SELECTION_MENU = "codevault-save-selection";
const SAVE_PAGE_MENU = "codevault-save-page";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: SAVE_SELECTION_MENU,
      title: "Save selection to CodeVault",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: SAVE_PAGE_MENU,
      title: "Save page to CodeVault",
      contexts: ["page"],
    });
  });
});

async function readSelection(tabId: number): Promise<string> {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.getSelection()?.toString() ?? "",
    });
    return typeof result?.result === "string" ? result.result.trim() : "";
  } catch {
    return "";
  }
}

async function openSave(pending: PendingSave): Promise<void> {
  await chrome.storage.session.set({ [PENDING_SAVE_KEY]: pending });
  await chrome.windows.create({
    url: chrome.runtime.getURL("save.html"),
    type: "popup",
    width: 560,
    height: 780,
  });
}

function pageSnippet(title: string, url: string): string {
  return `# ${title || "Saved page"}\n\n${url}`;
}

async function saveFromTab(
  tab: chrome.tabs.Tab | undefined,
  preferPage: boolean,
): Promise<RuntimeResponse> {
  if (!tab?.id) return { ok: false, error: "No active tab." };

  const selection = preferPage ? "" : await readSelection(tab.id);
  const code = selection || pageSnippet(tab.title ?? "", tab.url ?? "");
  const language = selection ? "typescript" : "markdown";

  await openSave({
    title: (tab.title ?? "Untitled page").slice(0, 80),
    code: code.slice(0, 200_000),
    url: tab.url ?? "",
    language,
    visibility: "private",
  });
  return { ok: true };
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  void (async () => {
    if (info.menuItemId === SAVE_SELECTION_MENU) {
      const selection = info.selectionText?.trim() ?? "";
      if (!tab?.id) return;
      await openSave({
        title: (tab.title ?? "Untitled page").slice(0, 80),
        code: (selection || (await readSelection(tab.id))).slice(0, 200_000),
        url: tab.url ?? "",
        language: "typescript",
        visibility: "private",
      });
      return;
    }
    if (info.menuItemId === SAVE_PAGE_MENU) {
      await saveFromTab(tab, true);
    }
  })();
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "save-selection") return;
  void (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await saveFromTab(tab, false);
  })();
});

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, _sender, sendResponse) => {
    if (message.type !== "codevault:save-selection") return false;
    void (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      sendResponse(await saveFromTab(tab, false));
    })();
    return true;
  },
);
