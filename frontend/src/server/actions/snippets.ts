/**
 * Snippet mutations — every write path the dashboard UI needs.
 *
 * Each action authenticates from scratch (`auth.api.getSession`), validates
 * its inputs with zod, scopes writes with `WHERE authorId = userId`, bumps
 * counters atomically (`SET favorites = favorites + 1`, never read-then-write),
 * and revalidates the dashboard routes so the next read is fresh.
 *
 * Returns are deliberately narrow (`{ id }`, `{ favorited }`) — action
 * results are serialized to the client, so full rows never leave the server.
 */

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { favorites, snippetTags, snippets, user } from "@/server/db/schema";
import {
  createSnippetSchema,
  snippetIdSchema,
  updateSnippetSchema,
} from "@/server/validations";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

function revalidateVault(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/snippets");
  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/explore");
  if (id) revalidatePath(`/dashboard/snippets/${id}`);
}

/* ------------------------------------------------------------------ *
 * create
 * ------------------------------------------------------------------ */

export async function createSnippet(input: unknown): Promise<{ id: string }> {
  const actor = await requireUser();
  const data = createSnippetSchema.parse(input);

  const [row] = await db
    .insert(snippets)
    .values({
      title: data.title,
      description: data.description,
      language: data.language,
      code: data.code,
      visibility: data.visibility,
      authorId: actor.id,
    })
    .returning({ id: snippets.id });

  if (!row) throw new Error("Failed to create snippet.");

  if (data.tags.length > 0) {
    await db
      .insert(snippetTags)
      .values(data.tags.map((tag) => ({ snippetId: row.id, tag })))
      .onConflictDoNothing();
  }

  revalidateVault(row.id);
  return { id: row.id };
}

/* ------------------------------------------------------------------ *
 * update — owner only
 * ------------------------------------------------------------------ */

export async function updateSnippet(
  id: unknown,
  input: unknown,
): Promise<{ id: string }> {
  const actor = await requireUser();
  const snippetId = snippetIdSchema.parse(id);
  const data = updateSnippetSchema.parse(input);

  const { tags, ...fields } = data;
  const patch: Partial<typeof snippets.$inferInsert> = { ...fields };
  if (Object.keys(patch).length > 0) {
    patch.updatedAt = new Date();
  } else if (tags === undefined) {
    throw new Error("Nothing to update.");
  }

  if (Object.keys(patch).length > 0) {
    const [row] = await db
      .update(snippets)
      .set(patch)
      .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, actor.id)))
      .returning({ id: snippets.id });
    if (!row) throw new Error("Snippet not found or you don't own it.");
  } else {
    // tags-only update still needs an ownership proof
    const [owned] = await db
      .select({ id: snippets.id })
      .from(snippets)
      .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, actor.id)))
      .limit(1);
    if (!owned) throw new Error("Snippet not found or you don't own it.");
    await db
      .update(snippets)
      .set({ updatedAt: new Date() })
      .where(eq(snippets.id, snippetId));
  }

  if (tags !== undefined) {
    await db.delete(snippetTags).where(eq(snippetTags.snippetId, snippetId));
    if (tags.length > 0) {
      await db
        .insert(snippetTags)
        .values(tags.map((tag) => ({ snippetId, tag })))
        .onConflictDoNothing();
    }
  }

  revalidateVault(snippetId);
  return { id: snippetId };
}

/* ------------------------------------------------------------------ *
 * delete — owner only (tags / links / favorites cascade)
 * ------------------------------------------------------------------ */

export async function deleteSnippet(id: unknown): Promise<{ id: string }> {
  const actor = await requireUser();
  const snippetId = snippetIdSchema.parse(id);

  const [row] = await db
    .delete(snippets)
    .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, actor.id)))
    .returning({ id: snippets.id });
  if (!row) throw new Error("Snippet not found or you don't own it.");

  revalidateVault();
  return { id: snippetId };
}

/* ------------------------------------------------------------------ *
 * toggleFavorite — atomic counter, viewable snippets only
 * ------------------------------------------------------------------ */

export async function toggleFavorite(
  id: unknown,
): Promise<{ favorited: boolean }> {
  const actor = await requireUser();
  const snippetId = snippetIdSchema.parse(id);

  const [target] = await db
    .select({ id: snippets.id, authorId: snippets.authorId, visibility: snippets.visibility })
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);
  if (!target) throw new Error("Snippet not found.");
  if (target.visibility !== "public" && target.authorId !== actor.id) {
    throw new Error("Forbidden");
  }

  const [existing] = await db
    .select({ snippetId: favorites.snippetId })
    .from(favorites)
    .where(
      and(eq(favorites.userId, actor.id), eq(favorites.snippetId, snippetId)),
    )
    .limit(1);

  if (existing) {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, actor.id), eq(favorites.snippetId, snippetId)),
      );
    await db
      .update(snippets)
      .set({ favorites: sql`GREATEST(${snippets.favorites} - 1, 0)` })
      .where(eq(snippets.id, snippetId));
    revalidateVault(snippetId);
    return { favorited: false };
  }

  await db
    .insert(favorites)
    .values({ userId: actor.id, snippetId })
    .onConflictDoNothing();
  await db
    .update(snippets)
    .set({ favorites: sql`${snippets.favorites} + 1` })
    .where(eq(snippets.id, snippetId));

  revalidateVault(snippetId);
  return { favorited: true };
}

/* ------------------------------------------------------------------ *
 * forkSnippet — copy a public (or your own) snippet into your vault
 * ------------------------------------------------------------------ */

export async function forkSnippet(id: unknown): Promise<{ id: string }> {
  const actor = await requireUser();
  const snippetId = snippetIdSchema.parse(id);

  const [original] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);
  if (!original) throw new Error("Snippet not found.");
  if (original.visibility !== "public" && original.authorId !== actor.id) {
    throw new Error("Forbidden");
  }

  const [author] = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, original.authorId))
    .limit(1);

  const originalTags = await db
    .select({ tag: snippetTags.tag })
    .from(snippetTags)
    .where(eq(snippetTags.snippetId, snippetId));

  const [fork] = await db
    .insert(snippets)
    .values({
      title: original.title,
      description: original.description,
      language: original.language,
      code: original.code,
      visibility: "private",
      authorId: actor.id,
      favorites: 0,
      copies: 0,
      forkedFromId: original.id,
      forkedFromAuthor: author?.name ?? "unknown",
    })
    .returning({ id: snippets.id });

  if (!fork) throw new Error("Failed to fork snippet.");

  if (originalTags.length > 0) {
    await db
      .insert(snippetTags)
      .values(originalTags.map((row) => ({ snippetId: fork.id, tag: row.tag })))
      .onConflictDoNothing();
  }

  revalidateVault(fork.id);
  return { id: fork.id };
}

/* ------------------------------------------------------------------ *
 * incrementCopies — atomic +1 when code is copied
 * ------------------------------------------------------------------ */

export async function incrementCopies(id: unknown): Promise<{ ok: true }> {
  const actor = await requireUser();
  const snippetId = snippetIdSchema.parse(id);

  const [target] = await db
    .select({ id: snippets.id, authorId: snippets.authorId, visibility: snippets.visibility })
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1);
  if (!target) throw new Error("Snippet not found.");
  if (target.visibility !== "public" && target.authorId !== actor.id) {
    throw new Error("Forbidden");
  }

  await db
    .update(snippets)
    .set({ copies: sql`${snippets.copies} + 1` })
    .where(eq(snippets.id, snippetId));

  revalidatePath(`/dashboard/snippets/${snippetId}`);
  return { ok: true as const };
}
