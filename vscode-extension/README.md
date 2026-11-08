# CodeVault — VS Code extension

Save selections and files to CodeVault, search your vault from a QuickPick, and
insert snippets straight into the editor. Talks to the same `/api/v1` REST API
as the Chrome extension.

## Features

- **Save selection** (`Ctrl+Alt+S` / `Cmd+Alt+S`, or the editor context menu).
- **Save file** as a snippet, with the language inferred from the editor.
- **Search snippets** with live server-side search as you type.
- **Insert snippet** at the cursor (replaces a non-empty selection).
- **Open in CodeVault** in your browser.
- Token stored in VS Code **SecretStorage** — never in `settings.json`.
- Status bar shows the connected account.

## 1. Start CodeVault

```bash
cd frontend
bun install
bun run db:migrate        # creates the api_tokens table
bun run dev
```

Sign in → **Dashboard → Settings → API tokens** → create a token → copy the
`cv_pat_…` value (shown once).

## 2. Run the extension locally

```bash
cd vscode-extension
bun install
bun run build
```

Then either:

- **F5** in VS Code (the checked-in `.vscode/launch.json` opens an Extension
  Development Host with this folder loaded), or
- `bun run package` → `codevault-vscode-0.1.0.vsix` → **Extensions → … →
  Install from VSIX…**.

## 3. Connect

1. Run **CodeVault: Connect Account** from the Command Palette.
2. Accept the URL (default `https://codevault-olive.vercel.app`).
3. Paste the `cv_pat_…` token. The extension verifies it with
   `GET /api/v1/me` before saving it to SecretStorage.

Run **CodeVault: Disconnect** to remove the token.

## Commands

| Command | What it does |
| --- | --- |
| `CodeVault: Connect Account` | URL + token, verified against `/api/v1/me` |
| `CodeVault: Disconnect` | Deletes the token from SecretStorage |
| `CodeVault: Save Selection` | Title + visibility, saves the selected text |
| `CodeVault: Save File` | Saves the whole active file |
| `CodeVault: Search Snippets` | Live search; insert, copy, or open the result |
| `CodeVault: Insert Snippet` | Search and insert at the cursor |
| `CodeVault: Open Snippet in Web App` | Search and open the detail page |
| `CodeVault: Open Web Settings` | Opens the token-management page |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `codevault.baseUrl` | `https://codevault-olive.vercel.app` | Base URL of your instance |
| `codevault.defaultVisibility` | `private` | Default for new snippets |

## Verification

```bash
bun run typecheck
bun run lint
bun run test              # unit tests: API client, URL, token, language map
bun run build
bun run check             # all of the above
```

The backend's Playwright suite exercises the exact endpoints:

```bash
cd frontend
bun run test:e2e e2e/api.spec.ts
```

## Security

- The raw token lives only in SecretStorage on this machine.
- Requests use `Authorization: Bearer cv_pat_…`; the server stores only a
  SHA-256 hash.
- Revoking a token in CodeVault settings invalidates it immediately; the next
  command shows the server's `401 invalid_token` message.
- The extension sends snippet content only to the configured CodeVault URL.

## Troubleshooting

- **"CodeVault is not connected"** — run **Connect Account**; the token may
  have been revoked.
- **"Could not reach …"** — start the dev server and check
  `curl http://localhost:3000/api/v1`.
- **Status bar still shows the old account** — reconnect; the display name is
  refreshed on connect.
- **F5 opens an empty window** — run `bun run build` first; `main` points at
  `dist/extension.js`.
