# Deployment

CodeVault is a standard Next.js app: `bun run build` + `bun run start` on any
Node 20+ host (Bun runs the dev loop and scripts; production serves from
Node). The only stateful dependency is Postgres (Neon); OAuth is optional and
degrades cleanly.

---

## 1. Degradation matrix

Know what a missing variable costs before you ship:

| Missing | What still works | What you lose |
| ------- | ---------------- | ------------- |
| *(nothing — bare checkout)* | Landing, auth page shell, static legal pages | Everything behind a session or a query |
| `DATABASE_URL` | `next build` passes; pages stay dynamic | Every read and write fails closed (the client throws a clear "not set" error naming `.env.example`) |
| OAuth credentials (one provider) | Sign-in with the other provider + demo | That provider is skipped — no broken redirects |
| OAuth credentials (both) | Demo sign-in carries the whole experience | Google/GitHub buttons |
| `NEXT_PUBLIC_SITE_URL` | Everything else | Sitemap/OG fall back to `BETTER_AUTH_URL` |
| `UPSTASH_*` | Everything else | Sliding-window limits (demo/share/writes) fail open — nothing throttled |

## 2. Required environment

Copy `frontend/.env.example` to `frontend/.env.local` locally, or set them in
your host's dashboard. Full variable reference:
[../README.md](../README.md#environment-variables).

### Core (needed for a useful production instance)

```bash
DATABASE_URL=postgresql://user:password@host/db?sslmode=require                    # pooled
DATABASE_URL_UNPOOLED=postgresql://user:password@host/db?sslmode=require          # unpooled
BETTER_AUTH_SECRET=<bunx @better-auth/cli secret>
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
UPSTASH_REDIS_REST_URL=https://….upstash.io      # optional — rate limiting
UPSTASH_REDIS_REST_TOKEN=…                       # optional — rate limiting
```

- **Neon:** create a project, copy the **pooled** string into `DATABASE_URL`
  (the `-pooler` host) and the **direct** string into
  `DATABASE_URL_UNPOOLED`. Then, from `frontend/`:
  `bun run db:migrate` once (creates auth + app tables),
  `bun run db:seed` once (demo user, credential account, 12 snippets).
  Migrations are the only path that changes a production database's shape.
- **`BETTER_AUTH_URL` must be the public origin** (no trailing path). Better
  Auth compares it against the sign-in request's origin; a mismatch blocks
  sign-in silently.
- **`NEXT_PUBLIC_SITE_URL`** feeds the sitemap and metadata base so
  OG/iframe URLs resolve to absolute URLs for crawlers.
- **`db:*` commands run through `scripts/drizzle.mjs`**, which re-executes
  drizzle-kit under Node with `.env.local` preloaded — drizzle-kit breaks
  silently under Bun. Don't bypass the wrapper.

### OAuth

GitHub — [Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)

```
Homepage URL:               https://your-domain.com
Authorization callback URL: https://your-domain.com/api/auth/callback/github
```

Google — [Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
(Web application OAuth client):

```
Authorized redirect URI: https://your-domain.com/api/auth/callback/google
```

Both providers are optional and independent; a provider is only wired when
*both* its id and secret are non-empty. New OAuth apps also need the
**localhost pair** (`http://localhost:3000/api/auth/callback/<provider>`) for
dev — register both URIs on the same client.

## 3. Build & run

```bash
cd frontend
bun install
bun run db:migrate    # creates the schema (needs DATABASE_URL_UNPOOLED)
bun run db:seed       # demo account + vault (idempotent, safe to re-run)
bun run lint && bun run typecheck && bun run build
bun run start          # serves .next on PORT (default 3000)
```

Notes:

- **Run `db:migrate` before the first sign-in.** Auth reads/writes
  `user`/`session`/`account` on every request; an unmigrated database turns
  *every* login (including demo) into a 500/401.
- **Seed before sharing the URL.** The demo button returns
  `401 Demo sign-in failed — run bun run db:seed` until `account_demo`
  exists. The seed is conflict-ignored, so re-running never duplicates.
- `bun run build` must pass with **no live database** — that invariant is
  load-bearing (preview deploys have no secrets). If a build starts needing
  `DATABASE_URL`, a server import leaked into a statically-rendered path.
- The React Compiler flag (`reactCompiler: true`) lives in `next.config.ts`;
  don't strip it when upgrading Next.

## 4. Post-deploy verification

Run through this once on a fresh production URL:

1. `/` renders; `/auth` shows the providers you configured plus demo.
2. Demo sign-in → `/dashboard` with stats and the 12 seeded snippets.
3. Sign in with each configured provider; sign out from settings.
4. Create → snippet appears at the top of the vault (respects your default visibility).
5. Edit → retag → flip to public → appears in explore.
6. Star from explore → count moves; fork → private copy lands in your vault.
7. Mint an unlisted link → open `/s/<token>` in a private window → badge says "unlisted link".
8. Revoke → the same URL 404s.
9. `/embed/<public-id>` renders the iframe payload; a private id as a stranger 404s.
10. Paste a share URL into a link unfurler → OG card renders (title + language + code peek).
11. Without OAuth secrets in a staging deploy: demo still carries everything, no console errors, no failed redirects.

## 5. Production checklist

- [ ] `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) point at production, not staging
- [ ] `bun run db:migrate` + `bun run db:seed` run against the production database
- [ ] `BETTER_AUTH_SECRET` is a strong random value, not the dev one
- [ ] `BETTER_AUTH_URL` matches the public origin exactly
- [ ] `NEXT_PUBLIC_SITE_URL` set to the public origin
- [ ] `UPSTASH_REDIS_REST_URL`/`TOKEN` set (or consciously skipped — limiting fails open)
- [ ] OAuth callback URLs updated for the real domain (+ localhost pair kept on the same clients)
- [ ] `bun run lint`, `bun run typecheck`, `bun run build` all pass in CI
- [ ] HTTPS enforced by the host; secure cookie variant confirmed in devtools
- [ ] Error/uptime monitoring attached to the Node process
- [ ] Database backups/PITR enabled on Neon
- [ ] `frontend/.env.local` never committed (gitignored; only `.env.example` is tracked)

## 6. Local production smoke test

```bash
cd frontend
bun run build && bun run start
# then re-run the verification list against http://localhost:3000
```

Share links, embeds and OG cards resolve against the current origin, so test
them against the origin you actually care about.
