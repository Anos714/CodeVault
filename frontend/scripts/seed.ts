/**
 * Idempotent dev seed — mirrors the old in-memory demo vault byte-for-byte:
 * same `snip_*` ids, same author `user_demo`, same counters and starred ids.
 * A developer who flips from mock data to the real database sees an
 * identical dashboard.
 *
 * Run with:  bun run db:seed
 *
 * Every insert is conflict-ignored, so this is safe to re-run — it fills a
 * fresh database and leaves a touched one alone.
 */

import { hashPassword } from "better-auth/crypto";

import { db } from "../src/server/db";
import {
  account,
  favorites,
  snippetTags,
  snippets,
  user,
} from "../src/server/db/schema";
import { seedSnippets } from "../src/lib/seed-data";

/**
 * The demo account is a real Better Auth credential account: the demo route
 * (src/app/api/auth/demo/route.ts) signs in with these same values, so the
 * seeded `user` row's email must follow DEMO_EMAIL whenever it is set.
 */
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@codevault.dev";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "codevault-demo";

const DEMO_USER = {
  id: "user_demo",
  name: "Rahul Sain",
  email: DEMO_EMAIL,
  image: null,
  emailVerified: true,
};

/** the two snippets the demo user had starred in the mock store */
const DEMO_FAVORITES = ["snip_lru", "snip_go_graceful"];

async function seed() {
  console.log("→ seeding CodeVault database…\n");

  await db.insert(user).values(DEMO_USER).onConflictDoNothing({
    target: user.id,
  });

  // Better Auth's credential provider keys accounts by the user id (not the
  // email), with the hashed password in the dedicated column
  await db
    .insert(account)
    .values({
      id: "account_demo",
      accountId: DEMO_USER.id,
      providerId: "credential",
      userId: DEMO_USER.id,
      password: await hashPassword(DEMO_PASSWORD),
    })
    .onConflictDoNothing({ target: account.id });

  for (const seed of seedSnippets) {
    await db
      .insert(snippets)
      .values({
        id: seed.id,
        title: seed.title,
        description: seed.description,
        language: seed.language,
        code: seed.code,
        visibility: seed.visibility,
        authorId: seed.authorId,
        favorites: seed.favorites,
        copies: seed.copies,
        createdAt: new Date(seed.createdAt),
        updatedAt: new Date(seed.updatedAt),
      })
      .onConflictDoNothing({ target: snippets.id });

    if (seed.tags.length > 0) {
      await db
        .insert(snippetTags)
        .values(seed.tags.map((tag) => ({ snippetId: seed.id, tag })))
        .onConflictDoNothing({
          target: [snippetTags.snippetId, snippetTags.tag],
        });
    }
  }

  await db
    .insert(favorites)
    .values(
      DEMO_FAVORITES.map((snippetId) => ({
        userId: DEMO_USER.id,
        snippetId,
      })),
    )
    .onConflictDoNothing({ target: [favorites.userId, favorites.snippetId] });

  console.log(
    `  ✓ ${seedSnippets.length} snippets, ${seedSnippets.reduce(
      (sum, snippet) => sum + snippet.tags.length,
      0,
    )} tags, ${DEMO_FAVORITES.length} stars, 1 demo credential account`,
  );
  console.log("\ndone.");
}

seed().catch((error) => {
  console.error("seed failed:", error);
  process.exit(1);
});
