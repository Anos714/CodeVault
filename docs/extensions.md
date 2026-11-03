# Extensions

Two first-party clients ship in this repo, each in its own folder:

| Folder | Client | Auth storage | Local run |
| ------ | ------ | ------------ | --------- |
| `chrome-extension/` | Manifest V3 Chrome extension | `chrome.storage.local` | `chrome://extensions` → Load unpacked |
| `vscode-extension/` | VS Code extension | `context.secrets` (SecretStorage) | F5 Extension Development Host / `.vsix` |

Both talk to the same token-authenticated REST API (`/api/v1`) and the same
CodeVault account.

## Prerequisite: backend API + token

The API and the `api_tokens` table are part of the app:

```bash
cd frontend
bun install
bun run db:migrate
bun run dev
```

1. Sign in (demo or OAuth).
2. Open **Dashboard → Settings → API tokens**.
3. Create a token named for the client (e.g. "Chrome extension").
4. Copy the `cv_pat_…` value — it is shown **once**.

Tokens are stored as SHA-256 hashes; the raw value never reaches the database.
Revoke a token from the same settings card at any time.

## Chrome extension

```bash
cd chrome-extension
bun install
bun run build          # src/ → dist/
```

1. `chrome://extensions` → enable **Developer mode**.
2. **Load unpacked** → select `chrome-extension/`.
3. Open the popup → **⚙** → enter `http://localhost:3000` and the token.
4. **Save & connect** (verified with `GET /api/v1/me`).

Surfaces:

- Right-click **Save selection to CodeVault** / **Save page to CodeVault**.
- `Alt+Shift+S` saves the selection.
- Popup: live search, copy, open in the web app, save selection.
- Save form: title, language, tags, visibility before writing.

See [`chrome-extension/README.md`](../chrome-extension/README.md).

## VS Code extension

```bash
cd vscode-extension
bun install
bun run build
```

- **F5** in VS Code (`.vscode/launch.json` opens the Extension Development
  Host), or
- `bun run package` → install `codevault-vscode-0.1.0.vsix` via **Extensions →
  … → Install from VSIX…**.

Connect with **CodeVault: Connect Account**; the token is verified before it
is written to SecretStorage. Commands: save selection/file, live search,
insert at cursor, copy, open in web app, open web settings.

See [`vscode-extension/README.md`](../vscode-extension/README.md).

## How the clients talk to the app

```text
Chrome extension ─┐
                  ├─ Authorization: Bearer cv_pat_… ─→ /api/v1
VS Code extension ┘                                   ├─ GET  /me
                                                      ├─ GET|POST /snippets
                                                      ├─ GET|PATCH|DELETE /snippets/:id
                                                      └─ (tokens via cookie session)
```

- The API returns the same `HydratedSnippet` shape as the dashboard (tags
  array, `authorName`, ISO dates, `starred`).
- Errors use `{ error: { code, message, details? } }`.
- CORS allows extension origins, localhost/loopback, and the configured app
  origin. VS Code uses Node `fetch` and is not subject to CORS.
- Rate limits: `api-read` 240/min, `api-write` 60/min per account.

## Verification

Backend:

```bash
cd frontend
bun run typecheck
bun run lint
bun run test:unit                       # token format + CORS decisions
bun run test:e2e e2e/api.spec.ts e2e/settings-tokens.spec.ts
DATABASE_URL="" bun run build
```

Each extension:

```bash
cd chrome-extension   # or vscode-extension
bun run check          # typecheck + lint + unit tests + build
```

The Playwright API suite mints a real token through the settings route, then
exercises create/list/search/get/update/delete, auth failures, validation,
CORS preflight, revocation, and the settings UI.

## Security notes

- Treat a PAT like a password: full read/write access to the vault.
- Chrome stores it in `chrome.storage.local` (this device, not sync).
- VS Code stores it in SecretStorage, never `settings.json`.
- Revocation is immediate: the next request gets `401 invalid_token`.
- The extensions send snippet content only to the configured CodeVault URL.
- Future work: device/OAuth flow so the token is issued without copy/paste.
