/**
 * VS Code extension entry point.
 *
 * Commands:
 * - connect / disconnect (token in SecretStorage)
 * - save selection / save file (create a snippet)
 * - search / insert (QuickPick with live server-side search)
 * - open in web app
 *
 * The token never leaves SecretStorage and is never written to settings.
 */

import * as path from "node:path";

import * as vscode from "vscode";

import { CodeVaultClient } from "./api";
import { toCodeVaultLanguage } from "./language";
import { isApiToken } from "./token";
import type { Snippet, Visibility } from "./types";
import {
  normalizeBaseUrl,
  settingsWebUrl,
  snippetWebUrl,
  vaultWebUrl,
} from "./url";

const TOKEN_KEY = "codevault.token";
const BASE_URL_KEY = "codevault.baseUrl";
const VISIBILITY_KEY = "codevault.defaultVisibility";
const LAST_USER_KEY = "codevault.lastUser";

type SnippetItem = vscode.QuickPickItem & { snippet: Snippet };

let output: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;

function config(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("codevault");
}

function getBaseUrl(): string {
  return normalizeBaseUrl(
    config().get<string>(BASE_URL_KEY) ?? "https://codevault-olive.vercel.app",
  );
}

function defaultVisibility(): Visibility {
  return config().get<string>(VISIBILITY_KEY) === "public"
    ? "public"
    : "private";
}

function reportError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  output.appendLine(`[error] ${message}`);
  void vscode.window.showErrorMessage(`CodeVault: ${message}`);
}

async function getClient(
  context: vscode.ExtensionContext,
): Promise<CodeVaultClient | null> {
  const token = await context.secrets.get(TOKEN_KEY);
  if (!token) {
    const action = await vscode.window.showWarningMessage(
      "CodeVault is not connected.",
      "Connect",
    );
    if (action === "Connect") {
      await vscode.commands.executeCommand("codevault.connect");
    }
    return null;
  }

  try {
    return new CodeVaultClient({ baseUrl: getBaseUrl(), token });
  } catch (error) {
    reportError(error);
    return null;
  }
}

async function refreshStatus(
  context: vscode.ExtensionContext,
): Promise<void> {
  const token = await context.secrets.get(TOKEN_KEY);
  if (token) {
    const name = context.globalState.get<string>(LAST_USER_KEY);
    statusBar.text = name ? `$(cloud) ${name.slice(0, 22)}` : "$(cloud) CodeVault";
    statusBar.tooltip = "CodeVault connected — click to reconnect";
  } else {
    statusBar.text = "$(cloud-upload) Connect CodeVault";
    statusBar.tooltip = "Connect your CodeVault account";
  }
  statusBar.command = "codevault.connect";
  statusBar.show();
}

async function connect(context: vscode.ExtensionContext): Promise<void> {
  const currentUrl =
    config().get<string>(BASE_URL_KEY) ?? "https://codevault-olive.vercel.app";

  const rawUrl = await vscode.window.showInputBox({
    title: "CodeVault: Connect",
    prompt: "CodeVault URL",
    value: currentUrl,
    ignoreFocusOut: true,
    validateInput: (value) => {
      try {
        normalizeBaseUrl(value);
        return undefined;
      } catch (error) {
        return error instanceof Error ? error.message : "Enter a valid URL.";
      }
    },
  });
  if (!rawUrl) return;

  const baseUrl = normalizeBaseUrl(rawUrl);

  const token = await vscode.window.showInputBox({
    title: "CodeVault: Connect",
    prompt:
      "Personal access token — create one in CodeVault → Settings → API tokens",
    password: true,
    ignoreFocusOut: true,
    placeHolder: "cv_pat_…",
    validateInput: (value) =>
      isApiToken(value) ? undefined : "Paste a cv_pat_… token.",
  });
  if (!token) return;

  try {
    const user = await new CodeVaultClient({
      baseUrl,
      token: token.trim(),
    }).me();
    await context.secrets.store(TOKEN_KEY, token.trim());
    await config().update(
      BASE_URL_KEY,
      baseUrl,
      vscode.ConfigurationTarget.Global,
    );
    await context.globalState.update(LAST_USER_KEY, user.name);
    await refreshStatus(context);
    const action = await vscode.window.showInformationMessage(
      `CodeVault connected as ${user.name} <${user.email}>.`,
      "Open vault",
    );
    if (action === "Open vault") {
      await vscode.env.openExternal(vscode.Uri.parse(vaultWebUrl(baseUrl)));
    }
  } catch (error) {
    reportError(error);
  }
}

async function disconnect(context: vscode.ExtensionContext): Promise<void> {
  await context.secrets.delete(TOKEN_KEY);
  await context.globalState.update(LAST_USER_KEY, undefined);
  await refreshStatus(context);
  void vscode.window.showInformationMessage(
    "CodeVault disconnected — the token was removed from SecretStorage.",
  );
}

async function promptTitle(defaultTitle: string): Promise<string | undefined> {
  const title = await vscode.window.showInputBox({
    title: "CodeVault: Save snippet",
    prompt: "Snippet title",
    value: defaultTitle.slice(0, 80),
    ignoreFocusOut: true,
    validateInput: (value) =>
      value.trim() ? undefined : "Give the snippet a title.",
  });
  return title?.trim() || undefined;
}

async function promptVisibility(): Promise<Visibility | undefined> {
  const picked = await vscode.window.showQuickPick(
    [
      { label: "private", description: "Only you can see it" },
      { label: "public", description: "Visible on the public explore feed" },
    ],
    {
      title: "CodeVault: Save snippet",
      placeHolder: `Visibility (default: ${defaultVisibility()})`,
      ignoreFocusOut: true,
    },
  );
  if (!picked) return undefined;
  return picked.label === "public" ? "public" : "private";
}

async function saveCode(
  context: vscode.ExtensionContext,
  code: string,
  defaultTitle: string,
  languageId: string,
): Promise<void> {
  const client = await getClient(context);
  if (!client) return;

  const title = await promptTitle(defaultTitle);
  if (!title) return;

  const visibility = await promptVisibility();
  if (!visibility) return;

  try {
    const snippet = await client.createSnippet({
      title,
      code,
      language: toCodeVaultLanguage(languageId),
      visibility,
    });

    const action = await vscode.window.showInformationMessage(
      `Saved “${snippet.title}” to CodeVault.`,
      "Open in CodeVault",
      "Copy link",
    );
    if (action === "Open in CodeVault") {
      await vscode.env.openExternal(
        vscode.Uri.parse(snippetWebUrl(getBaseUrl(), snippet.id)),
      );
    } else if (action === "Copy link") {
      await vscode.env.clipboard.writeText(
        snippetWebUrl(getBaseUrl(), snippet.id),
      );
      void vscode.window.showInformationMessage("CodeVault link copied.");
    }
  } catch (error) {
    reportError(error);
  }
}

async function saveSelection(
  context: vscode.ExtensionContext,
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showWarningMessage("Open a file to save a selection.");
    return;
  }
  const code = editor.document.getText(editor.selection);
  if (!code.trim()) {
    void vscode.window.showWarningMessage("Select some code first.");
    return;
  }
  await saveCode(
    context,
    code,
    `${path.basename(editor.document.fileName)} selection`,
    editor.document.languageId,
  );
}

async function saveFile(context: vscode.ExtensionContext): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showWarningMessage("Open a file to save.");
    return;
  }
  const code = editor.document.getText();
  if (!code.trim()) {
    void vscode.window.showWarningMessage("This file is empty.");
    return;
  }
  await saveCode(
    context,
    code,
    path.basename(editor.document.fileName),
    editor.document.languageId,
  );
}

/** Live QuickPick: typing re-queries `/api/v1/snippets?q=…`. */
async function pickSnippet(
  client: CodeVaultClient,
): Promise<Snippet | undefined> {
  const quickPick = vscode.window.createQuickPick<SnippetItem>();
  quickPick.title = "CodeVault: Search snippets";
  quickPick.placeholder = "Type to search titles, code, and tags…";
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;
  quickPick.busy = true;

  let timer: NodeJS.Timeout | undefined;
  let sequence = 0;

  const load = async (query: string) => {
    const current = ++sequence;
    quickPick.busy = true;
    try {
      const result = await client.listSnippets({
        q: query,
        limit: 50,
        sort: "updated",
      });
      if (current !== sequence) return;
      quickPick.items = result.snippets.map((snippet) => ({
        label: snippet.title,
        description: `${snippet.language} · ${snippet.visibility}${
          snippet.tags.length ? ` · #${snippet.tags.join(" #")}` : ""
        }`,
        detail:
          snippet.description || snippet.code.split("\n")[0]?.slice(0, 120),
        snippet,
      }));
    } catch (error) {
      if (current === sequence) {
        quickPick.items = [];
        reportError(error);
      }
    } finally {
      if (current === sequence) quickPick.busy = false;
    }
  };

  const changeSubscription = quickPick.onDidChangeValue((value) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void load(value.trim()), 250);
  });

  const accepted = new Promise<Snippet | undefined>((resolve) => {
    quickPick.onDidAccept(() => {
      resolve(quickPick.selectedItems[0]?.snippet);
      quickPick.hide();
    });
    quickPick.onDidHide(() => resolve(undefined));
  });

  void load("");
  quickPick.show();
  const picked = await accepted;
  if (timer) clearTimeout(timer);
  changeSubscription.dispose();
  quickPick.dispose();
  return picked;
}

async function insertCode(code: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showWarningMessage(
      "Open a file to insert a snippet into.",
    );
    return;
  }

  try {
    const inserted = await editor.edit((builder) => {
      if (editor.selection.isEmpty) {
        builder.insert(editor.selection.active, code);
      } else {
        builder.replace(editor.selection, code);
      }
    });
    if (!inserted) {
      reportError(new Error("Could not insert the snippet into the editor."));
    }
  } catch (error) {
    reportError(error);
  }
}

async function insertSnippet(
  context: vscode.ExtensionContext,
): Promise<void> {
  if (!vscode.window.activeTextEditor) {
    void vscode.window.showWarningMessage(
      "Open a file to insert a snippet into.",
    );
    return;
  }

  const client = await getClient(context);
  if (!client) return;

  const snippet = await pickSnippet(client);
  if (!snippet) return;
  await insertCode(snippet.code);
}

async function searchSnippets(
  context: vscode.ExtensionContext,
): Promise<void> {
  const client = await getClient(context);
  if (!client) return;

  const snippet = await pickSnippet(client);
  if (!snippet) return;

  const action = await vscode.window.showQuickPick(
    [
      { label: "Insert at cursor", value: "insert" as const },
      { label: "Copy to clipboard", value: "copy" as const },
      { label: "Open in CodeVault", value: "open" as const },
    ],
    { placeHolder: `“${snippet.title}”` },
  );
  if (!action) return;

  if (action.value === "insert") {
    await insertCode(snippet.code);
  } else if (action.value === "copy") {
    await vscode.env.clipboard.writeText(snippet.code);
    void vscode.window.showInformationMessage(
      `Copied “${snippet.title}” to the clipboard.`,
    );
  } else {
    await vscode.env.openExternal(
      vscode.Uri.parse(snippetWebUrl(getBaseUrl(), snippet.id)),
    );
  }
}

async function openInWeb(
  context: vscode.ExtensionContext,
): Promise<void> {
  const client = await getClient(context);
  if (!client) return;

  const snippet = await pickSnippet(client);
  if (!snippet) return;
  await vscode.env.openExternal(
    vscode.Uri.parse(snippetWebUrl(getBaseUrl(), snippet.id)),
  );
}

export function activate(context: vscode.ExtensionContext): void {
  output = vscode.window.createOutputChannel("CodeVault");
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    90,
  );
  context.subscriptions.push(output, statusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand("codevault.connect", () =>
      connect(context),
    ),
    vscode.commands.registerCommand("codevault.disconnect", () =>
      disconnect(context),
    ),
    vscode.commands.registerCommand("codevault.saveSelection", () =>
      saveSelection(context),
    ),
    vscode.commands.registerCommand("codevault.saveFile", () =>
      saveFile(context),
    ),
    vscode.commands.registerCommand("codevault.search", () =>
      searchSnippets(context),
    ),
    vscode.commands.registerCommand("codevault.insert", () =>
      insertSnippet(context),
    ),
    vscode.commands.registerCommand("codevault.openInWeb", () =>
      openInWeb(context),
    ),
    vscode.commands.registerCommand("codevault.openSettings", async () => {
      try {
        await vscode.env.openExternal(
          vscode.Uri.parse(settingsWebUrl(getBaseUrl())),
        );
      } catch (error) {
        reportError(error);
      }
    }),
  );

  void refreshStatus(context);
}

export function deactivate(): void {
  // nothing to dispose manually — subscriptions handle it
}
