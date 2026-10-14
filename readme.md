# CodeVault

**Your code, vaulted.**

CodeVault turns scattered gists, pasted utilities and copy-pasted Stack Overflow answers into one searchable home — a syntax-aware snippet library with tagging, privacy control, favorites, forks and unlisted share links, all inside a single Next.js app.

Sign in with Google, GitHub, or one click as the demo account. Everything saves to your vault.

[![CodeVault dashboard](https://media.licdn.com/dms/image/v2/D5622AQFp82Vv7zugug/feedshare-shrink_2048_1536/B56Zv7EitUI4Ak-/0/1769443830896?e=1770854400&v=beta&t=0HkdbWeX_qfL5ehdm78Jm55AQYDLHBkmnecvVla5Uvc)](https://codevault-olive.vercel.app/)

[Live demo](https://codevault-olive.vercel.app/) · [GitHub](https://github.com/Anos714/CodeVault)

---

## Table of contents

-   [Highlights](#highlights)
-   [Screenshots](#screenshots)
-   [Tech stack](#tech-stack)
-   [Quick start](#quick-start)
-   [Environment variables](#environment-variables)
-   [Commands](#commands)
-   [Project structure](#project-structure)
-   [Routes](#routes)
-   [Architecture](#architecture)
-   [Documentation](#documentation)
-   [Deployment](#deployment)
-   [Design system](#design-system)
-   [Future improvements](#future-improvements)
-   [License](#license)
-   [Contact](#contact)

---

## Highlights

-   **Full CRUD vault** — create, read, update and delete snippets through type-safe server actions. Every write is owner-scoped in SQL (`WHERE author_id = ?`), validated with Zod, and revalidates the dashboard on the way out.
-   **Monaco composer with live preview** — write code in a real editor while a rendered card updates beside it. Six starter templates (React component, Express route, SQL migration, hook, Python script, CSS utility) pre-seed the form.
-   **Search, filter, sort — in the URL** — title, description, language and tag search with 250 ms debounce, privacy chips, tag links and four sort orders. Filters live in `?q&tag&visibility&sort`, so a filtered vault survives refresh and shares.
-   **19 languages, flat tags** — syntax-aware editing and highlighting across nineteen languages; up to five lowercase tags per snippet, no folders. The tags page renders a count-sorted cloud plus a "languages you use" grid.
-   **Explore the commons** — a public feed of everyone's public snippets, searchable by title, description, author or tag, with a "starred only" toggle. Star what you reuse, fork what you want to own.
-   **Favorites & forks** — atomic counters (`SET favorites = favorites + 1`, never read-then-write). Forking clones any public snippet into your vault as a private draft, crediting the original author even if the original is later deleted.
-   **Unlisted share links** — mint 32-hex token links (`/s/[token]`) that never expire or expire in 1/7/30 days, revoke them all in one click. Private code stays private: links are looked up by primary key and re-checked for revocation and expiry on every read.
-   **Embeds & social previews** — chrome-free `/embed/[id]` iframe payloads for READMEs and Notion, plus generated 1200×630 OG cards so a pasted link unfurls as a title, language chip and code peek.
-   **Auth that degrades gracefully** — Google and GitHub OAuth plus a seeded demo account behind one click. Missing OAuth secrets? The provider is skipped and the demo keeps working. No database? The build still passes; pages stay dynamic.
-   **Privacy with an opinion** — a "new snippets default to private" preference travels from settings into the composer. Share by choice, not by accident.

## Screenshots

Browse and manage all snippets

Add or edit snippets with syntax highlighting

![Dashboard](https://media.licdn.com/dms/image/v2/D5622AQFp82Vv7zugug/feedshare-shrink_2048_1536/B56Zv7EitUI4Ak-/0/1769443830896?e=1770854400&v=beta&t=0HkdbWeX_qfL5ehdm78Jm55AQYDLHBkmnecvVla5Uvc)

![Editor](https://media.licdn.com/dms/image/v2/D5622AQFBKMfP3ml0sw/feedshare-shrink_1280/B56Zv7EiAZIYAk-/0/1769443827989?e=1770854400&v=beta&t=oRRDySxvrVmdB3GapZ3oIizCZNMkcVwLyI81vpfriq4)

Beautiful code viewer with copy feature

Fully responsive on all devices

![View Page](https://media.licdn.com/dms/image/v2/D5622AQGSMV2H5rZRFA/feedshare-shrink_1280/B56Zv7EiIDIUAc-/0/1769443828520?e=1770854400&v=beta&t=b1_vH17-_hwTaJNgKsQv9QknYSNRI)

![Mobile View](https://media.licdn.com/dms/image/v2/D5622AQFLC2SHUeEPpA/feedshare-shrink_1280/B56Zv7EhFxJ8Ac-/0/1769443824201?e=1770854400&v=beta&t=LX3lyRamB9XthJHfOAJtvpfUdr1YYoWZityis3h8ySQ)

## Tech stack

| Layer            | Choice                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, React Compiler)                               |
| UI               | React 19, TypeScript (strict)                                         |
| Styling          | Tailwind CSS v4                                                       |
| Primitives       | shadcn-style wrappers in `components/ui/`                             |
| Editor           | Monaco (`@monaco-editor/react`)                                       |
| Client state     | Zustand (transitional UI state only — reads come from the server)     |
| Database         | Neon Postgres (`@neondatabase/serverless`, HTTP driver)               |
| ORM              | Drizzle ORM — migrations own the schema                               |
| Auth             | Better Auth v1 (Google, GitHub, seeded demo credential account)       |
| Validation       | Zod v4 (one contract for composer limits and server actions)          |
| Package manager  | Bun                                                                   |

## Quick start

Requirements: **Bun 1+** and a **Neon** Postgres project (pooled + unpooled endpoints). Everything else degrades — no OAuth secrets, no problem.

```bash
cd frontend
bun install
cp .env.example .env.local   # fill in DATABASE_URL + BETTER_AUTH_SECRET at minimum
bun run db:migrate           # apply drizzle/ SQL to Neon (runs under Node, see Commands)
bun run db:seed              # idempotent demo vault: demo user + 12 snippets + favorites
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and hit **"Continue with a demo account"** — no OAuth needed. To exercise the full loop (OAuth sign-in → create → share link), add the provider keys below.

## Environment variables

All values live in `frontend/.env.local` (gitignored). Full annotated copy in [`frontend/.env.example`](frontend/.env.example).

| Variable | Required for | Notes |
| -------- | ------------ | ----- |
| `DATABASE_URL` | Everything real | Neon **pooled** endpoint. The app talks to it over the HTTP driver — no TCP pool, serverless-safe. |
| `DATABASE_URL_UNPOOLED` | Migrations | Neon **unpooled** endpoint. `drizzle-kit` needs the full SQL wire protocol, which the pooler doesn't offer. |
| `BETTER_AUTH_SECRET` | Sign-in | Session signing secret. Generate with `bunx @better-auth/cli secret`. |
| `BETTER_AUTH_URL` | Sign-in | Public origin, e.g. `http://localhost:3000`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in | [OAuth client credentials](https://console.cloud.google.com/apis/credentials). Left blank → the provider is skipped, demo still works. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub sign-in | [Create an OAuth app](https://github.com/settings/developers). Left blank → the provider is skipped. |
| `DEMO_EMAIL` / `DEMO_PASSWORD` | Demo account | Seeded credential login. Defaults to `demo@codevault.dev` / `codevault-demo`. |
| `NEXT_PUBLIC_SITE_URL` | Social previews | Optional. Sitemap/OG base; falls back to `BETTER_AUTH_URL`. |

## Commands

All run from `frontend/`.

```bash
bun run dev        # dev server
bun run build      # production build (passes with no live DB — pages stay dynamic)
bun run start      # serve the production build
bun run lint       # eslint
bun run typecheck  # tsc --noEmit (strict)
bun run db:generate  # diff src/server/db/schema.ts into new SQL under drizzle/
bun run db:migrate   # apply pending migrations (needs DATABASE_URL_UNPOOLED)
bun run db:push      # push schema directly (dev only)
bun run db:studio    # Drizzle Studio
bun run db:seed      # idempotent demo seed
```

### Database migrations

Drizzle migrations (`frontend/drizzle/*.sql`) are the source of truth for the database shape. After changing `src/server/db/schema.ts`, generate and review a migration, then apply it:

```bash
bun run db:generate  # review the generated SQL before it touches anything
bun run db:migrate   # applies pending migrations to DATABASE_URL_UNPOOLED
```

Two CodeVault-specific details: `db:*` commands run through `scripts/drizzle.mjs`, which re-executes drizzle-kit under **Node** with `.env.local` preloaded — drizzle-kit breaks silently under the Bun runtime (reports success, creates nothing). And the seed (`bun run db:seed`) mirrors the demo vault byte-for-byte — same `snip_*` ids, same counters — so flipping from mock to real shows an identical dashboard.

## Project structure

```
frontend/
  src/
    proxy.ts                      Optimistic auth gate (cookie presence → /dashboard* guard)
    app/
      page.tsx                    Landing
      auth/page.tsx               Sign-in (Google / GitHub / demo)
      api/auth/[...all]/route.ts  Better Auth handler
      api/auth/demo/route.ts      POST — demo credential sign-in, forwards Set-Cookie
      dashboard/
        page.tsx                  Overview (server: stats + recent via DAL)
        snippets/                 Vault list (URL-driven filters), detail, edit
        new/                      Composer (opens on your default visibility)
        explore/ tags/ settings/  Public feed, tag cloud, account preferences
      s/[token]/                  Unlisted share surface + opengraph-image
      embed/[id]/                 Chrome-free iframe payload
      robots.ts / sitemap.ts      Static public pages only
    server/
      auth.ts                     betterAuth instance (Google/GitHub/demo, Drizzle adapter)
      validations.ts              Zod schemas — the mutation contract
      queries.ts                  DAL — every read, store-compatible shapes + starred
      actions/snippets.ts         create/update/delete/favorite/fork/copies
      actions/share.ts            mint/revoke share links
      db/schema.ts                Auth + app tables (drizzle migration source)
      db/index.ts                 Lazy neon-http client (build-safe without a DB)
    lib/                          share/languages/templates/seed-data/highlight/…
    store/ui.store.ts             Sidebar/theme/drawer state (client UI only)
    components/dashboard/         Cards, dialogs, editors, sidebar, topbar
    components/site/              Landing + auth buttons
  drizzle/                        Generated SQL migrations (owned by db:generate/db:migrate)
  drizzle.config.ts               Schema in, SQL out, unpooled URL for migrations
  scripts/seed.ts                 Idempotent demo seed
  scripts/drizzle.mjs             Runs drizzle-kit under Node with .env.local preloaded
  .env.example                    Annotated template (the only tracked .env file)
docs/                             Architecture notes (working spec, git-ignored)
```

## Routes

| Route | Purpose |
| ----- | ------- |
| `/` | Landing page |
| `/auth` | Sign-in: Google, GitHub, demo account |
| `/dashboard` | Overview — stats plus recently updated |
| `/dashboard/snippets` | Your vault (`?q&tag&visibility&sort`) |
| `/dashboard/snippets/[id]` | Snippet detail: copy, star, share, fork, edit, delete |
| `/dashboard/snippets/[id]/edit` | Edit composer (owner only) |
| `/dashboard/new` | Create composer with live preview and templates |
| `/dashboard/explore` | Public feed (`?q&starred=1`) |
| `/dashboard/tags` | Tag cloud plus languages-you-use grid |
| `/dashboard/settings` | Profile, default privacy, sign-out |
| `/s/[token]` | Unlisted share page (usable link first, public id fallback) |
| `/embed/[id]` | Iframe payload (public, or owner) |
| `/api/auth/[...all]` | Better Auth — sign-in, callback, session, sign-out |
| `/api/auth/demo` | `POST` — demo sign-in |
| `/privacy-policy`, `/terms-and-conditions` | Static legal pages |

## Architecture

The short version:

-   **Everything is Next.js.** No separate backend: server components read, server actions write, route handlers serve auth. One `bun run dev`, one Vercel deploy.
-   **Reads go through a DAL.** `src/server/queries.ts` returns the exact `Snippet` shape the UI was built on (tags array, `authorName`, ISO dates) plus `starred` for the viewer. Pages fetch on the server and hand props to the existing client views — markup untouched.
-   **Writes are guarded twice.** Every action re-authenticates with `auth.api.getSession`, validates with Zod, and scopes mutations with `WHERE author_id = ?`. What the frontend hides is UX; the action is the security boundary.
-   **Counters are atomic, links are opaque.** Favorites and copies move with `SET x = x + 1`; share tokens are 32-hex primary keys, re-checked for revocation and expiry on every read.
-   **Auth is two gates.** `src/proxy.ts` redirects `/dashboard*` without a session cookie (cheap, optimistic); the dashboard layout validates the cookie against the database (authoritative).
-   **The database is lazy.** The Drizzle client throws only on first *query*, never on import — so `next build` passes with no credentials and every dashboard route stays dynamic.

Deep dive: `docs/Architecture.md` (working spec, git-ignored).

## Documentation

| Document | What's in it |
| -------- | ------------ |
| [`frontend/.env.example`](frontend/.env.example) | Every environment variable, annotated |
| `docs/Architecture.md` | Schema, auth flow, server actions, DAL contract, route inventory (local working spec) |
| [`frontend/drizzle/`](frontend/drizzle/) | The applied migrations — the schema's reviewable history |

## Deployment

Any host that runs `next build` / `next start` works — Vercel is the default. Minimum for a useful production instance:

1.  `DATABASE_URL` (Neon, pooled) — the app.
2.  `DATABASE_URL_UNPOOLED` (Neon) — run `bun run db:migrate` then `bun run db:seed` against it once.
3.  `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` — sessions.
4.  `NEXT_PUBLIC_SITE_URL` — correct sitemap and social-share previews.
5.  One OAuth provider, with its callback URL pointed at `https://<your-domain>/api/auth/callback/<provider>` (Better Auth's default path under its `/api/auth` base path).

Without OAuth keys the app still runs: Google/GitHub buttons are skipped and the demo account carries the whole experience. Without a database the build still passes, but every read fails closed — seed before sharing the URL.

## Design system

Dark developer canvas with warm syntax accents — near-black surfaces, muted borders, and per-language token colors (`text-syntax-number`, `text-syntax-function`, `text-syntax-keyword`, `text-syntax-string`, `text-syntax-comment`).

-   **Monaco** for writing, a bespoke highlighter for viewing, sharing and embeds — one code voice everywhere
-   **Cards everywhere** — vault grid, explore feed and the composer preview share the same snippet-card DNA: language dot, privacy badge, tag pills, star/copy/fork rail
-   **Motion with restraint** — staggered entrances (`staggerContainer`/`fadeUp` in `lib/motion.ts`), success-state button flashes, nothing that blocks input
-   **Mono for metadata** — counts, timestamps, tags and expiry labels all set in `font-mono` at `0.62–0.68rem` with wide tracking

## Future improvements

-   **E2E tests on top of hand-testing.** `typecheck` + `lint` + `build` gate every branch, but the create → share → unlisted-URL loop and the OAuth sign-in flow are still only exercised by hand. Playwright would close that gap.
-   **Pagination.** Lists currently fetch the whole vault in one query with SQL ordering and filtering. Cursor-based pagination on `(updated_at, id)` keeps page 500 as cheap as page 1 once vaults grow.
-   **Full-text search.** Title/description/tag matching is `ILIKE` today. A Postgres `tsvector` column with a GIN index would rank matches instead of just filtering them.
-   **Rate limiting.** Public surfaces (`/s/[token]`, `/embed/[id]`, demo login) have no throttles yet. A sliding window per IP on writes and share reads is the next hardening step.
-   **Collections.** Tags are flat by design, but named collections (folders with their own share links) keep coming up — the `share_links` pattern would extend to them cleanly.

## License

CodeVault is released under the **MIT License** — see [LICENSE](LICENSE). Copy, modify and ship it, including commercially; attribution is the only ask.

## Contact

Built by **Rahul Sain**.

-   **GitHub:** [github.com/Anos714](https://github.com/Anos714) — issues and pull requests are welcome there.
-   **Email:** [sainrahul374@gmail.com](mailto:sainrahul374@gmail.com)

Found a bug or have a feature in mind? Open an issue on [GitHub](https://github.com/Anos714/CodeVault/issues).
