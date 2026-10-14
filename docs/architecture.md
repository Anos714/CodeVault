# Architecture

How CodeVault is put together, and why. Read this before touching more than
one layer — most decisions here are load-bearing.

**Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 ·
Drizzle + Neon Postgres · Better Auth v1 · Zod v4 · Bun.

---

## 1. Mental model

Two planes, one direction of truth:

```
 browser                              server
 ┌──────────────────────────┐         ┌──────────────────────────────┐
 │  client views (props)    │ mutate  │  Neon Postgres               │
 │  (cards, forms, dialogs) ├────────►│  snippets / tags / links /   │
 │                          │ actions │  favorites + auth tables     │
 │  pages  ◄────────────────┼───RSC───┤                              │
 └──────────────────────────┘         └──────────────────────────────┘
```

- **Reading is server-first.** Pages are server components that fetch through
  the DAL (`src/server/queries.ts`) and hand props to the existing client
  views. There is no client-side copy of the vault to drift.
- **Writing is actions-only.** Mutations are `"use server"` functions
  (`src/server/actions/`). Every action re-authenticates, re-validates with
  Zod, and scopes writes with `WHERE author_id = ?`.
- **The UI contract is fixed.** `Snippet` / `ShareLink` / `Visibility`
  (`src/lib/snippet-types.ts`) were defined by the mock era; the DAL returns
  byte-compatible shapes plus `starred`, so components render unchanged.

## 2. Rendering: server pages, client views

Every dashboard route follows the same split:

1. `app/dashboard/*/page.tsx` — async server component. Reads the session,
   parses `searchParams`, fetches from the DAL, renders a view.
2. `app/dashboard/*/*-view.tsx` — `"use client"` view. Owns interactivity
   (filter inputs, dialogs, optimistic stars) and calls server actions; data
   itself arrives as props and refreshes via `router.refresh()`.

Page-level rules worth keeping:

- Filters live in the URL (`/dashboard/snippets?q&tag&visibility&sort`,
  `/dashboard/explore?q&starred`), so a filtered view survives refresh and
  shares. Filter changes navigate with `scroll: false`; the results grid is
  keyed by the serialized filter so card state never goes stale.
- The search box types locally and commits to the URL on a 250 ms debounce —
  one server round-trip per pause, not per keystroke.
- `params` / `searchParams` are **Promises** (Next 16) — `await` them, never
  `use()` them in a client component.
- `proxy.ts` (Next 16's middleware successor, nodejs runtime) redirects
  `/dashboard*` without a session cookie — an optimistic filter. The dashboard
  layout's `auth.api.getSession` against the database is the real gate.

Hydration safety: server data flows one way (props down). Cards keep *local*
star state seeded from props and confirmed by the action result; the grid
remounts on filter change, so there is no mirrored store to reconcile.

## 3. Data layer

`src/server/queries.ts` is deliberately boring:

- Imported only from server code (`import "server-only"` enforces it at
  build time). Client components that need data get props.
- The Drizzle client (`src/server/db/index.ts`) is created lazily over the
  **pooled** Neon endpoint via the HTTP driver — no TCP pool, safe in
  serverless and edge runtimes. It throws a clear "DATABASE_URL is not set"
  error on first *query*, never on import, so `next build` passes with no
  credentials and every dashboard route stays dynamic (`ƒ`).
- Hydration is batched: one query for rows, then one each for tags, author
  names, the viewer's favorites and (owner-only) share links — assembled into
  the `Snippet` shape with ISO dates and `starred`.
- Search input is stripped of `%_\\` before it becomes an `ILIKE` pattern, so
  user text can't widen a query. Ordering is always explicit with a stable
  `id` tiebreak.

Schema (`src/server/db/schema.ts`, single source of truth):

```
user / session / account / verification   -- Better Auth shape + user.default_private
snippets(id snip_<uuid>, title, description, language, code,
         visibility, author_id → user.id, favorites, copies,
         forked_from_id/author, timestamptz stamps)
snippet_tags(snippet_id, tag)             -- composite PK
share_links(token PK 32-hex, snippet_id, created_by, expires_at NULL=never, revoked)
favorites(user_id, snippet_id)            -- composite PK, duplicates are a constraint
```

Counters (`favorites`, `copies`) are denormalised on purpose and move only via
atomic `SET x = x ± 1` in actions — never read-modify-write. `forkedFromAuthor`
is denormalised so a deleted original still renders its credit. Share tokens
are looked up by primary key only — no enumeration possible.

## 4. Mutations: server actions

`src/server/actions/snippets.ts` and `src/server/actions/share.ts`:

- **Authenticate on every call** — `auth.api.getSession({ headers: await
  headers() })`, throwing `Unauthorized` with no session. Render-time gating
  is not a security boundary; the action is.
- **Validate with Zod first** — `src/server/validations.ts` mirrors the
  composer's limits (title 1–80, description ≤220, ≤5 normalized tags, code
  ≤200k chars, well under the 1 MB action body limit).
- **Authorize in SQL** — creates stamp `authorId` from the session; updates,
  deletes, link minting and revocation carry `AND author_id = ?`. Favorites,
  copies and forks additionally require the target to be public-or-owned.
- **Return narrow values** — `{ id }`, `{ favorited }`, `{ token }`.
  Action results serialize to the client, so full rows never leave the server.
- **Revalidate after writes** — `revalidatePath` on the vault (and the detail
  path where relevant), so the action response ships a fresh RSC payload in
  the same round-trip.

The composer (`new/`) opens on the user's own default visibility: the page
reads `session.user.defaultPrivate` on the server and seeds the form with it.

## 5. Auth

`src/server/auth.ts`:

- Better Auth v1 with the Drizzle adapter (`provider: "pg"`).
- **Three doors:** Google and GitHub via the function form of
  `socialProviders` — a provider is wired only when *both* its id and secret
  are present, otherwise it is skipped with no warning — plus
  `emailAndPassword` with `disableSignUp: true`, which exists **only** for the
  seeded demo account.
- `user.additionalFields.defaultPrivate` backs the settings toggle, mirrored
  to the client with `inferAdditionalFields` so
  `session.user.defaultPrivate` stays type-safe end to end.
- Credential accounts key `accountId` by the **user id** (not the email),
  with the scrypt hash in the `password` column — `scripts/seed.ts`
  provisions `account_demo` to match.
- **Demo login** (`POST /api/auth/demo`) calls `auth.api.signInEmail({ …,
  asResponse: true })` and returns that `Response` untouched, so the session
  lands in the same httpOnly cookie a normal sign-in uses. The client just
  refreshes.
- `getSession()` failures return `null`, never throw — public surfaces
  (`/s/[token]`, `/embed/[id]`, OG images) resolve against the database
  without requiring a session.

## 6. Share, embed and OG conventions

- Resolution order is fixed everywhere: **usable link first** (exists, not
  revoked, not expired), then a **public snippet id** fallback.
- The share page badges accordingly: a link match renders "unlisted link" with
  its expiry; the id fallback renders "public". The OG route
  (`s/[token]/opengraph-image`) resolves identically — comparing a token
  against snippet ids was a real 404 bug, fixed by sharing the DAL path.
- Embeds (`/embed/[id]`) are linkable by id, so private code stays behind
  ownership: public snippets open for everyone, private ones only for the
  owner. The OG image is edge-rendered (`next/og`) straight from the DAL.
- The sitemap lists **static public pages only** (`/`, `/auth`, legal).
  Dashboard routes are gated, share links are unlisted by design, and embeds
  are iframe payloads — none belong in a crawler's mouth.

## 7. Tooling quirks worth knowing

- **drizzle-kit breaks silently under Bun** (reports success, creates
  nothing). `bun run db:*` routes through `scripts/drizzle.mjs`, which
  re-executes drizzle-kit under **Node** with `.env.local` preloaded. `pg` is
  therefore a real devDependency — the migrator needs the TCP wire protocol
  the app's HTTP driver deliberately avoids.
- **`scripts/` uses relative imports** — tsconfig paths don't resolve there.
- Migrations (`frontend/drizzle/*.sql`) own the schema; the seed
  (`scripts/seed.ts`) is idempotent and mirrors the demo vault byte-for-byte
  (same `snip_*` ids, same counters), so mock and real render identically.

## 8. Security model

| Concern | Mechanism |
| --- | --- |
| Unowned writes | `author_id = ?` on every mutation; the UI hiding a button is UX, the action is the boundary |
| Session forgery | httpOnly Better Auth cookies; layout validates against the DB on every dashboard load |
| Share enumeration | 32-hex opaque tokens, PK lookup, revocation + expiry re-checked on every read |
| Private code leaks | Detail/edit/DAL deny private-unowned; embeds deny private-stranger; OG only resolves usable links or public ids |
| Oversized input | Zod caps (code ≤200k) under the 1 MB action body limit; LIKE wildcards stripped from search |
| Secret exposure | All env read server-side; the browser sees `NEXT_PUBLIC_SITE_URL` and nothing else |
| Lost favorite/star races | Atomic counters + sequential action dispatch (no client `Promise.all` over actions) |

## 9. Performance & shipping details

- **React Compiler** enabled (`reactCompiler: true`) — write compiler-safe
  code (serializable action args, no unstable closures).
- Monaco loads only in the composer/detail editor; share and embed surfaces
  use a lightweight highlighter + the shared copy button instead.
- Dashboard routes are all dynamic (`ƒ`); only the landing, auth, legal pages
  and sitemap pre-render (`○`).
- `next/font` (Geist) with `display: swap`; no static screenshots to keep in
  sync — OG cards generate at request time.

## 10. Conventions worth keeping

- Server files carry a short JSDoc explaining *why* they exist.
- No comments in ordinary component code unless the reasoning is non-obvious.
- One feature per branch, conventional commits, `--no-ff` merges into `main`.
- Definition of done: `bun run typecheck`, `bun run lint`, `bun run build`
  all clean — and the build must pass with **no live database**.
- Pages own data-fetching; views own interactivity; actions own mutation.
  Components never reach past their props.
