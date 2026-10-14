# API reference

CodeVault has no REST API. Mutations are **server actions** under
`src/server/actions/`, reads are **DAL queries** (`src/server/queries.ts`)
consumed by server components, and the only HTTP surface is auth plus pages.
This document is the contract for all three.

Conventions that hold everywhere:

- Input is validated with Zod **before** it touches the database —
  `src/server/validations.ts` for actions, inline parsing for routes.
- Every action authenticates with `auth.api.getSession` on **every call**.
  No session → throw `Unauthorized`. Not the owner → throw `Forbidden`-style
  `Snippet not found or you don't own it.` (ownership failure and absence are
  deliberately indistinguishable).
- Action returns are narrow (`{ id }`, `{ favorited }`, `{ token }`,
  `{ ok: true }`) — full rows never serialize to the client.
- Writes `revalidatePath` the affected dashboard routes, so the action
  response ships fresh UI in the same round-trip.
- Reads return the `Snippet` shape from `src/lib/snippet-types.ts` plus
  `starred` for the viewer (`HydratedSnippet`).

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

**Returns:** `{ id }`. Unknown id or чужой snippet → throw.

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

## DAL reads (`src/server/queries.ts`)

Server components and route handlers only (`import "server-only"`).

| Query | Purpose |
| ----- | ------- |
| `listOwnSnippets(userId, { q, tag, visibility, sort })` | The vault: `ILIKE` search over title/description/language/tag, tag containment, privacy filter, `updated/created/copies/favorites` ordering. Returns `{ snippets, total }` (total is unfiltered, for "X of Y shown"). |
| `getVaultStats(userId)` | `{ total, publicCount, privateCount, totalCopies }` for the overview and settings. |
| `getRecentSnippets(userId, limit?)` | Newest-first (default 6) for the overview grid. |
| `getTagCounts(userId)` / `getLanguageCounts(userId)` | `[[tag, n]]` count-desc for the tags page and vault filter chips. |
| `getSnippetById(id, viewerId)` | Detail/edit: public-or-owned, else `null`. Includes `shareLinks` **only** for the owner. |
| `getPublicSnippetById(id, viewerId)` | Share/OG fallback: public rows only. |
| `exploreSnippets({ viewerId, q, starredOnly })` | Public feed, favorites-first. `starredOnly` without a viewer is `[]`, not the feed. `q` also matches author name. |
| `resolveShareToken(token, viewerId)` | Usable link (not revoked, not expired) → `{ snippet, link }`, any visibility — the link *is* the authorization. Else `null`. |
| `getEmbedSnippet(id, viewerId)` | Public, or private-but-owned. Private-stranger → `null`. |

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
| `307` | Anonymous at `/dashboard*` → `/auth` (proxy gate) |
| `401` | No session (action throw, demo without seed, CSRF-less POST) |
| `403` | Private snippet of a stranger (action throw) |
| `404` | Unknown id/token — pages render the not-found card, OG returns `Not found` |
| `500` | Unexpected; raw detail only in dev |
