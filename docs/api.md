# API reference

CodeVault has two HTTP surfaces:

1. **`/api/v1`** — a token-authenticated REST API for the Chrome and VS Code
   extensions (and any script). Personal access tokens are minted in
   **Settings → API tokens**.
2. **Server actions + pages** — the dashboard still mutates through
   `src/server/actions/`, reads through the DAL (`src/server/queries.ts`), and
   authenticates with Better Auth cookies.

This document is the contract for both.

Conventions that hold everywhere:

- Input is validated with Zod **before** it touches the database —
  `src/server/validations.ts` for actions and `/api/v1`, inline parsing for
  auth routes.
- Server actions authenticate with `auth.api.getSession` on **every call**.
  `/api/v1` authenticates with `Authorization: Bearer cv_pat_…` (except token
  management, which uses the cookie session).
- No session / bad token → `401`. Not the owner → `404`-style
  `Snippet not found or you don't own it.` (ownership failure and absence are
  deliberately indistinguishable).
- Action returns are narrow (`{ id }`, `{ favorited }`, `{ token }`,
  `{ ok: true }`) — full rows never serialize to the client.
- Writes `revalidatePath` the affected dashboard routes, so the action
  response ships fresh UI in the same round-trip.
- Reads return the `Snippet` shape from `src/lib/snippet-types.ts` plus
  `starred` for the viewer (`HydratedSnippet`).

---

## REST API (`/api/v1`)

Base URL: your app origin, e.g. `http://localhost:3000/api/v1`.

```http
Authorization: Bearer cv_pat_<43 base64url chars>
Accept: application/json
Content-Type: application/json   # POST/PATCH only
```

Tokens are generated with 32 random bytes, returned **once**, and stored only
as a SHA-256 hash in `api_tokens` (`token_hash`, `prefix`, `last_used_at`,
`expires_at`, `revoked_at`). Each account may hold 20 active tokens; an
optional `expiresInDays` (1–365) bounds a token's lifetime.

Every error uses one envelope:

```json
{
  "error": {
    "code": "invalid_token",
    "message": "This token is invalid, revoked, or expired.",
    "details": [{ "path": "language", "message": "Invalid option" }]
  }
}
```

`details` is present for `validation_error` (Zod issues) and `rate_limited`
(`retryAt`). Codes: `unauthorized`, `invalid_token`, `validation_error`,
`invalid_json`, `payload_too_large`, `not_found`, `token_limit`, `rate_limited`,
`internal_error`.

CORS is enabled for `chrome-extension://*`, `moz-extension://*`,
`safari-web-extension://*`, `vscode-webview://*`, `vscode-file://*`, localhost
/ loopback on any port, and the configured `BETTER_AUTH_URL` origin. The VS
Code extension uses Node `fetch` (no Origin) and needs no CORS.

### Endpoint map

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| `GET` | `/api/v1` | public | Discovery document (name, version, endpoint map) |
| `GET` | `/api/v1/me` | Bearer | `{ user: { id, name, email, image, defaultPrivate, createdAt } }` |
| `GET` | `/api/v1/snippets` | Bearer | List/search the caller's vault |
| `POST` | `/api/v1/snippets` | Bearer | Create a snippet (`201`) |
| `GET` | `/api/v1/snippets/:id` | Bearer | Public-or-owned snippet |
| `PATCH` | `/api/v1/snippets/:id` | Bearer | Owner-only partial update |
| `DELETE` | `/api/v1/snippets/:id` | Bearer | Owner-only delete → `{ ok: true, id }` |
| `GET` | `/api/v1/tokens` | Cookie | List token metadata (never the secret) |
| `POST` | `/api/v1/tokens` | Cookie | Mint a token (`201`, raw value once) |
| `DELETE` | `/api/v1/tokens/:id` | Cookie | Revoke a token |

`OPTIONS` is implemented on every route for preflight; it answers `204` with
CORS headers (or no `Access-Control-Allow-Origin` for disallowed origins).

### `GET /api/v1/snippets`

Query parameters (all optional):

| Param | Values | Default |
| ----- | ------ | ------- |
| `q` | free text (≤ 200) | `""` |
| `tag` | tag slug (≤ 40) | `""` |
| `visibility` | `all` \| `private` \| `public` | `all` |
| `sort` | `updated` \| `created` \| `copies` \| `favorites` | `updated` |
| `limit` | 1–50 | `20` |
| `cursor` | opaque cursor from the previous page | — |

Returns `{ snippets: HydratedSnippet[], total, nextCursor }`. `total` applies
the filters; `nextCursor` is `null` on the last page. The same cursor/keyset
logic as the dashboard is used, so inserts do not shift a page.

### `POST /api/v1/snippets`

Body is `createSnippetSchema`:

```jsonc
{
  "title": "Debounce a function",  // 1–80, required
  "description": "",               // ≤ 220, default ""
  "language": "typescript",        // one of the 19 slugs
  "tags": ["hooks"],               // ≤ 5, lowercased, '#' stripped, deduped
  "code": "…",                     // 1–200_000
  "visibility": "private"          // "private" | "public"
}
```

Returns `201 { snippet }` with the hydrated row.

### `PATCH /api/v1/snippets/:id`

Every `createSnippetSchema` field is optional, but at least one must be
present. Supplying `tags` **replaces** the whole set; omitting it leaves tags
untouched. `updatedAt` moves on every successful patch. Returns
`{ snippet }`.

### `DELETE /api/v1/snippets/:id`

Deletes the caller's snippet; tags, share links and favorites cascade.
Returns `{ ok: true, id }`. Foreign/unknown ids both answer `404 not_found`.

### Token management (cookie session)

These routes intentionally reject bearer tokens: creating or revoking a token
is a browser-session action. The settings page uses the equivalent server
actions (`src/server/actions/tokens.ts`), and the REST routes exist for scripts
and tests.

```http
POST /api/v1/tokens
{ "name": "Chrome extension", "expiresInDays": 30 }
→ 201 { "token": { "id", "name", "prefix", "lastUsedAt", "expiresAt", "revokedAt", "createdAt" }, "raw": "cv_pat_…" }
```

`raw` is returned exactly once. `GET` returns `{ tokens }` (metadata only).
`DELETE /api/v1/tokens/:id` is a soft revoke (`revoked_at`), so the audit trail
survives; already-revoked or foreign ids answer `404`.

---

## `createSnippet(input)`

Creates a snippet owned by the caller.

**Auth:** required. **Input** (`createSnippetSchema`):

```jsonc
{
  "title": "Debounce a function",  // required, 1–80 chars (trimmed)
  "description": "…",               // optional, ≤ 220 chars, defaults to ""
  "language": "typescript",         // required, one of the 19 slugs in lib/languages.ts
  "tags": ["hooks"],               // ≤ 5, lowercased, '#' stripped, deduped server-side
  "code": "…",                     // required, 1–200_000 chars
  "visibility": "private"          // "private" | "public", defaults to "private"
}
```

**Returns:** `{ id: "snip_<uuid>" }`. Tags insert conflict-ignored. The
composer opens on the caller's `defaultPrivate` preference, but the action
trusts only what it is sent.

---

## `updateSnippet(id, input)`

Patches a snippet. **Owner only.**

**Input:** `updateSnippetSchema` — every field of `createSnippetSchema`
optional, but at least one must be present. `tags`, when supplied, **replace**
the whole set (delete + insert); omitted `tags` leave them untouched.
`updatedAt` is touched on every path, including tags-only updates.

**Returns:** `{ id }`. Unknown id or someone else's snippet → throw.

---

## `deleteSnippet(id)`

Deletes a snippet. **Owner only.** Tags, share links and favorites cascade in
the database.

**Returns:** `{ id }`.

---

## `toggleFavorite(id)`

Stars or unstars a snippet for the caller, with an atomic counter move
(`favorites + 1`, `GREATEST(favorites - 1, 0)` — never read-then-write).

The target must be **public or owned** — private snippets of strangers throw
`Forbidden`.

**Returns:** `{ favorited: boolean }` — the server truth; clients seed
optimistic state from it.

---

## `forkSnippet(id)`

Clones a **public-or-owned** snippet into the caller's vault.

The fork is born `private`, resets `favorites`/`copies` to 0, drops the
original's share links, copies its tags, and sets `forkedFromId` plus
`forkedFromAuthor` (the *name*, resolved from `user`) so credit survives
deletion of the original.

**Returns:** `{ id }` — the fork; clients route to
`/dashboard/snippets/<id>`.

---

## `incrementCopies(id)`

Atomic `copies + 1` when code is copied. Same public-or-owned visibility rule
as favorites.

**Returns:** `{ ok: true }`. Fire-and-forget from copy buttons — the count is
observational, not transactional.

---

## `incrementSharedCopies(id, token?)`

Anonymous counterpart used by `/s/[token]` and `/embed/[id]`. Public snippets
are always eligible; private ones require the unlisted `token` that resolves
to the same snippet. Rate-limited by IP (`share-read`). Failures are ignored
by the copy button.

**Returns:** `{ ok: true }`.

---

## `createShareLink(id, expiry)`

Mints an unlisted `/s/[token]` link. **Owner only.**

| `expiry` | Meaning |
| -------- | ------- |
| `null` | Never expires |
| `1` / `7` / `30` | Expires that many days from minting |

Matches `SHARE_EXPIRY_OPTIONS` in `lib/share.ts`. The token is 32 hex chars
(`crypto.randomUUID()` dashes stripped), stored by primary key.

**Returns:** `{ token, expiresAt: string | null }` (ISO, or `null`).

---

## `revokeShareLinks(id)`

Marks **every** outstanding link for the snippet `revoked`. **Owner only.**
Revocation is terminal — links are never un-revoked; mint a fresh one.

**Returns:** `{ ok: true }`.

---

## Collections

Folders of snippets with their own unlisted `/c/[token]` links. Every
mutation is **owner-only** (`author_id = caller`); a membership row stores
only `(collectionId, snippetId)`.

### `createCollection({ name, description? })`

**Returns:** `{ id }`.

### `updateCollection(id, { name?, description? })`

Renames/redescribes. **Returns:** `{ id }`.

### `deleteCollection(id)`

Deletes the folder; memberships and links cascade. **Returns:** `{ id }`.

### `addSnippetToCollection(collectionId, snippetId)`

The caller must own the collection and be able to view the snippet (public,
or their own private row). Adding a public snippet from another author is
allowed — curation, not a copy. **Returns:** `{ ok: true }`.

> Read paths re-check visibility: a foreign snippet disappears from the
> collection (and from `/c/[token]`) as soon as its author makes it private.
> The link never widens a snippet's visibility.

### `removeSnippetFromCollection(collectionId, snippetId)`

**Returns:** `{ ok: true }`.

### `createCollectionLink(collectionId, expiry)`

Mints an unlisted `/c/[token]` link with the same expiry options as snippet
links. **Returns:** `{ token, expiresAt }`.

### `revokeCollectionLinks(collectionId)`

Marks every outstanding link for the collection revoked. **Returns:**
`{ ok: true }`.

---

## DAL reads (`src/server/queries.ts`)

Server components and route handlers only (`import "server-only"`).

| Query | Purpose |
| ----- | ------- |
| `listOwnSnippets(userId, { q, tag, visibility, sort })` | The vault: `ILIKE` search over title/description/language/tag, tag containment, privacy filter, `updated/created/copies/favorites` ordering. Returns `{ snippets, total }`; `total` applies the same filters as the page (cursor excluded). |
| `listSnippetOptions(userId)` | `{ id, title }[]` for pickers (collection membership); intentionally unpaginated. |
| `getVaultStats(userId)` | `{ total, publicCount, privateCount, totalCopies }` for the overview and settings. |
| `getRecentSnippets(userId, limit?)` | Newest-first (default 6) for the overview grid. |
| `getTagCounts(userId)` / `getLanguageCounts(userId)` | `[[tag, n]]` count-desc for the tags page and vault filter chips. |
| `getSnippetById(id, viewerId)` | Detail/edit: public-or-owned, else `null`. Includes `shareLinks` **only** for the owner. |
| `getPublicSnippetById(id, viewerId)` | Share/OG fallback: public rows only. |
| `exploreSnippets({ viewerId, q, starredOnly })` | Public feed, favorites-first. `starredOnly` without a viewer is `[]`, not the feed. `q` also matches author name. |
| `resolveShareToken(token, viewerId)` | Usable link (not revoked, not expired) → `{ snippet, link }`, any visibility — the link *is* the authorization. Else `null`. |
| `getEmbedSnippet(id, viewerId)` | Public, or private-but-owned. Private-stranger → `null`. |
| `listCollections(userId)` | Owner's folders with member counts. |
| `getCollectionById(id, viewerId)` | Owner-only management view: members + links. |
| `resolveCollectionToken(token, viewerId)` | Usable collection link → `{ collection, link }`. Members include the owner's private snippets and foreign snippets only while public. |

---

## `POST /api/auth/demo`

One-click demo sign-in. Signs the caller in as the seeded demo user
(`DEMO_EMAIL`/`DEMO_PASSWORD`, matching `scripts/seed.ts`) by calling
`auth.api.signInEmail({ …, asResponse: true })` and returning that `Response`
untouched — the `Set-Cookie` lands the session in the standard httpOnly
cookie. The client then refreshes.

| Status | When |
| ------ | ---- |
| `200` | `{ redirect: false, token, user }` plus the session cookie. |
| `401` | No seeded account — run `bun run db:seed`. Body says exactly that. |

---

## `GET|POST /api/auth/[...all]`

The Better Auth handler (Google/GitHub sign-in, OAuth callbacks, session,
sign-out, `updateUser` for name + `defaultPrivate`) mounted at its default
`/api/auth` base path.

- Sign-in is Google + GitHub + demo-credential; a social provider exists only
  when both its id and secret are configured.
- Callback URLs are `/api/auth/callback/google` and
  `/api/auth/callback/github` on your origin.
- `POST /api/auth/update-user` (used by settings) requires an `Origin` header
  — Better Auth's CSRF check rejects headerless non-GETs.

---

## Status code map (quick reference)

| Status | Meaning in CodeVault |
| ------ | -------------------- |
| `200` | Success — page, `{ id }`/`{ token }`/`{ ok: true }`, or demo payload |
| `201` | REST create — `{ snippet }` or `{ token, raw }` |
| `204` | REST `OPTIONS` preflight |
| `307` | Anonymous at `/dashboard*` → `/auth` (proxy gate) |
| `400` | REST validation / malformed JSON (`validation_error`, `invalid_json`) |
| `401` | No session / bad token (action throw, demo without seed, CSRF-less POST) |
| `403` | Private snippet of a stranger (action throw) |
| `404` | Unknown id/token — pages render the not-found card, REST returns `not_found`, OG returns `Not found` |
| `409` | REST token limit (20 active per account) |
| `413` | REST body over 1 MB |
| `429` | Rate limit tripped (see below) |
| `500` | Unexpected; raw detail only in dev |

## Rate limits (`src/server/ratelimit.ts`)

Sliding windows over Upstash Redis (REST, edge-safe). Unconfigured
credentials or a Redis outage both fail **open** (allowed) — limiting is
protection, never a dependency.

| Bucket | Window | Identity | Enforced in |
| ------ | ------ | -------- | ----------- |
| `demo` | 30/min | IP | `POST /api/auth/demo` → `429` past the budget |
| `share-read` | 100/min | IP | `proxy.ts` on `/s/*`, `/embed/*`, `/c/*` → `429`; OG route → `429` |
| `write` | 60/min | user id | every mutating server action → throw past the budget |
| `api-read` | 240/min | user id | authenticated `/api/v1` reads → `429` |
| `api-write` | 60/min | user id | authenticated `/api/v1` mutations → `429` |

Keys are namespaced `codevault:<bucket>` in Redis. The E2E suite signs in
~10× per run from one IP — comfortably inside the demo budget.
