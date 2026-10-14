# 🚀 CodeVault – Your Modern Code Snippet Library

**CodeVault** is a powerful, developer-friendly application designed to store, manage, and share your code snippets efficiently. It offers a seamless experience with syntax highlighting, instant search, and a beautiful dark-themed UI.

🔗 **Live Demo:** https://codevault-olive.vercel.app/

---

## 📸 Screenshots & Demo

|                                                                                          Home / Dashboard                                                                                           |                                                                                       Code Editor (Monaco)                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Dashboard](https://media.licdn.com/dms/image/v2/D5622AQFp82Vv7zugug/feedshare-shrink_2048_1536/B56Zv7EitUI4Ak-/0/1769443830896?e=1770854400&v=beta&t=0HkdbWeX_qfL5ehdm78Jm55AQYDLHBkmnecvVla5Uvc) | ![Editor](https://media.licdn.com/dms/image/v2/D5622AQFBKMfP3ml0sw/feedshare-shrink_1280/B56Zv7EiAZIYAk-/0/1769443827989?e=1770854400&v=beta&t=oRRDySxvrVmdB3GapZ3oIizCZNMkcVwLyI81vpfriq4) |
|                                                                                   Browse and manage all snippets                                                                                    |                                                                          Add or edit snippets with syntax highlighting                                                                           |

|                                                                                          View Snippet                                                                                          |                                                                                      Responsive Mobile View                                                                                      |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![View Page](https://media.licdn.com/dms/image/v2/D5622AQGSMV2H5rZRFA/feedshare-shrink_1280/B56Zv7EiIDIUAc-/0/1769443828520?e=1770854400&v=beta&t=b1_vH17-_hwTaJNgKsQv9zZAWmRjjJucVf9QknYSNRI) | ![Mobile View](https://media.licdn.com/dms/image/v2/D5622AQFLC2SHUeEPpA/feedshare-shrink_1280/B56Zv7EhFxJ8Ac-/0/1769443824201?e=1770854400&v=beta&t=LX3lyRamB9XthJHfOAJtvpfUdr1YYoWZityis3h8ySQ) |
|                                                                            Beautiful code viewer with copy feature                                                                             |                                                                                 Fully responsive on all devices                                                                                  |

---

## ✨ Features

- 🔐 **Secure Authentication** – Google + GitHub OAuth and a seeded demo account via Better Auth, httpOnly session cookies
- 📝 **Full CRUD Support** – Create, read, update, and delete snippets (server actions, owner-scoped)
- 🎨 **Syntax Highlighting** – Monaco Editor for writing, syntax highlighter for viewing
- 🔍 **Advanced Search** – Debounced search by title, description, language, or tag
- 🏷️ **Tagging System** – Organize snippets with custom tags (up to 5 per snippet)
- 🌓 **Dark Mode UI** – Clean developer-focused UI with Tailwind CSS
- 📋 **One-Click Copy** – Instantly copy code snippets (with copy counter)
- ⭐ **Favorites & Forks** – Star snippets, fork anyone's public snippet into your vault
- 🔗 **Unlisted Share Links** – Time-boxed `/s/[token]` links with revocation + README embeds
- 🔒 **Privacy Control** – Public or private snippets

---

## 🛠️ Tech Stack

Everything lives inside Next.js — there is no separate backend.

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, TS strict, `reactCompiler`) |
| Language / runtime | TypeScript + Bun (package manager) |
| Styling / UI | Tailwind CSS v4, shadcn, Framer Motion (`motion`), Lucide icons |
| Editor | Monaco Editor |
| Client state | Zustand (transitional — reads move to server components) |
| Database | Neon Postgres via Drizzle ORM (`drizzle-orm/neon-http`) |
| Auth | Better Auth v1 (Google + GitHub + seeded demo credential account) |
| Validation | Zod (shared UI limits ↔ server schemas) |
| Deployment | Vercel |

Key conventions: `src/proxy.ts` is the optimistic auth gate (Next 16 renamed middleware → proxy); mutations are `"use server"` actions that re-check `auth.api.getSession` and scope every write with `WHERE authorId = userId`; counters move atomically (`SET favorites = favorites + 1`).

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1+
- A [Neon](https://neon.tech) Postgres project (pooled + unpooled endpoints)
- Google and/or GitHub OAuth credentials (optional — the demo account works without them)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Anos714/CodeVault.git
cd CodeVault/frontend
```

### 2️⃣ Install Dependencies

```bash
bun install
```

### 3️⃣ Configure Environment

Copy the template and fill it in (real values never get committed):

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** endpoint — used by the app (Drizzle HTTP driver) |
| `DATABASE_URL_UNPOOLED` | Neon **unpooled** endpoint — used by drizzle-kit migrations |
| `BETTER_AUTH_SECRET` | Session encryption secret (`bunx @better-auth/cli secret`) |
| `BETTER_AUTH_URL` | Public app URL (`http://localhost:3000` in dev) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth ( absent → provider is skipped, demo still works) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (same fallback) |
| `DEMO_EMAIL` / `DEMO_PASSWORD` | Seeded demo account (default `demo@codevault.dev` / `codevault-demo`) |

### 4️⃣ Migrate & Seed

```bash
bun run db:migrate   # apply drizzle/ SQL to Neon
bun run db:seed      # idempotent seed: demo user + 12 snippets + favorites
```

The seed mirrors the demo vault byte-for-byte (same `snip_*` ids, same counters), so the dashboard looks identical before and after going real.

### 5️⃣ Run the Dev Server

```bash
bun run dev
# → http://localhost:3000
```

Click **“Continue with a demo account”** — it signs you in as the seeded user, no OAuth needed.

---

## 📜 Scripts (`frontend/`)

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the Next.js dev server |
| `bun run build` | Production build (passes without a live DB — pages stay dynamic) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `eslint` |
| `bun run db:generate` | Generate SQL from the Drizzle schema (works offline) |
| `bun run db:migrate` | Apply migrations to Neon (needs `DATABASE_URL_UNPOOLED`) |
| `bun run db:push` | Push schema directly (dev only) |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed` | Idempotent demo seed |

---

## 🗺️ Project Status

- ✅ **Phase 1 — MVP (live):** auth, CRUD, search/filter/sort, tags, explore, share links, embeds, OG previews, responsive UI
- ✅ **Real persistence:** Drizzle + Neon schema, Better Auth sessions, server actions for every mutation
- 🚧 **In progress:** server-side reads (DAL + server components replacing the zustand mock store), then final docs polish

---

# 🤝 Contributing

Contributions are always welcome and greatly appreciated!
If you have ideas, improvements, or bug fixes, feel free to contribute.

## 🛠️ Steps to Contribute

1. **Fork the repository**

2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes** (conventional messages, one feature per branch)
   ```bash
   git commit -m "feat: add AmazingFeature"
   ```

4. **Push and open a pull request** 🚀
   ```bash
   git push origin feature/AmazingFeature
   ```

   Clearly describe the changes you've made and reference related issues if applicable.

---

### 📞 Contact

Created by [Rahul Sain]

GitHub: https://github.com/Anos714

Email: sainrahul374@gmail.com

## License
This project is licensed under the MIT License.
