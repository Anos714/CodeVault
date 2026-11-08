# CodeVault — Chrome extension

A Manifest V3 extension that talks to your CodeVault account through the
`/api/v1` REST API.

- **Save selection** from the right-click menu, the popup, or `Alt+Shift+S`.
- **Save the current page** (title + URL as a Markdown snippet).
- **Search your vault** from the popup; copy a snippet or open it in the web app.
- **Connect with a personal access token** created in CodeVault settings.

The extension defaults to the hosted app at
`https://codevault-olive.vercel.app`; point it at `http://localhost:3000` (or
any other deployment) from the options page.

## 1. Start CodeVault

```bash
cd frontend
bun install
bun run db:migrate        # creates the api_tokens table
bun run dev
```

Sign in, open **Dashboard → Settings → API tokens**, create a token, and copy
the `cv_pat_…` value (it is shown once).

## 2. Build the extension

```bash
cd chrome-extension
bun install
bun run build             # bundles src/ → dist/
```

`bun run watch` rebuilds on change.

## 3. Load it unpacked

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. **Load unpacked** → select the `chrome-extension/` folder (the one with
   `manifest.json`).
4. Click the CodeVault icon → **⚙** (or the connect prompt).
5. Set the URL (default `https://codevault-olive.vercel.app`) and paste the token.
6. **Save & connect** — the extension verifies the token with `GET /api/v1/me`.

## Usage

| Action | How |
| --- | --- |
| Save selected code | Select text → right-click → **Save selection to CodeVault** |
| Save selection (keyboard) | `Alt+Shift+S` |
| Save current page | Right-click anywhere → **Save page to CodeVault** |
| Search vault | Click the toolbar icon and type in **Search** |
| Copy a snippet | **Copy** on any search result |
| Open in CodeVault | Click the snippet title |
| Reconnect / revoke | Extension settings, or CodeVault → Settings → API tokens |

The save form lets you confirm the title, language, tags, and visibility before
anything is written.

## Verification

```bash
bun run typecheck
bun run lint
bun run test              # 17 unit tests (API client, storage, URLs, tokens)
bun run build
bun run check             # all of the above
```

The backend has an end-to-end suite that exercises the same API the extension
uses:

```bash
cd frontend
bun run test:e2e e2e/api.spec.ts
```

## How auth works

- The token is stored in `chrome.storage.local` (this device only — never
  `storage.sync`).
- Every request sends `Authorization: Bearer cv_pat_…`.
- Tokens can be revoked at any time from CodeVault settings; the next request
  gets `401 invalid_token` and the popup shows the reconnect prompt.
- `manifest.json` allows `http://localhost/*`, `http://127.0.0.1/*`, and
  `https://*/*` so the same build works against a deployed instance. Narrow
  `host_permissions` before publishing to the Chrome Web Store.

## Troubleshooting

- **"Could not reach …"** — the CodeVault dev server is not running, or the URL
  is wrong. Check `curl http://localhost:3000/api/v1`.
- **401 invalid_token** — the token was revoked/expired, or it belongs to a
  different CodeVault instance. Create a new token and reconnect.
- **CORS** — the backend allows `chrome-extension://*`, `moz-extension://*`,
  `vscode-webview://*`, localhost, and the configured app origin. No CORS
  configuration is needed for the local workflow.
- **Changes not visible** — run `bun run build`, then click **Reload** on the
  extension card in `chrome://extensions`.
