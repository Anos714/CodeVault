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

import { db } from "../src/server/db";
import { favorites, snippetTags, snippets, user } from "../src/server/db/schema";
import { seedSnippets } from "../src/lib/snippet-data";

const DEMO_USER = {
  id: "user_demo",
  name: "Rahul Sain",
  email: "rahul@codevault.dev",
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
    )} tags, ${DEMO_FAVORITES.length} stars for the demo user`,
  );
  console.log("\ndone.");
}

seed().catch((error) => {
  console.error("seed failed:", error);
  process.exit(1);
});
