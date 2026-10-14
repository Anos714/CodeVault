/**
 * Collection mutations — folders of snippets with their own unlisted links.
 *
 * Same rules as the snippet actions: authenticate on every call, validate
 * with zod, scope every write to rows the caller owns (`author_id = ?` on
 * the collection, plus a viewability check on any snippet being added), and
 * revalidate the collections routes after writes. Returns stay narrow.
 */

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { auth } from "@/server/auth";
import { checkLimit } from "@/server/ratelimit";
import { db } from "@/server/db";
import {
  collectionLinks,
  collectionSnippets,
  collections,
  snippets,
} from "@/server/db/schema";
import {
  collectionIdSchema,
  createCollectionSchema,
  shareExpirySchema,
  snippetIdSchema,
  updateCollectionSchema,
} from "@/server/validations";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function requireOwnedCollection(collectionId: string, ownerId: string) {
  const [row] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, ownerId),
      ),
    )
    .limit(1);
  if (!row) throw new Error("Collection not found or you don't own it.");
  return row;
}

function revalidateCollections(id?: string) {
  revalidatePath("/dashboard/collections");
  if (id) revalidatePath(`/dashboard/collections/${id}`);
}

/* ------------------------------------------------------------------ *
 * create / rename / delete — owner only
 * ------------------------------------------------------------------ */

export async function createCollection(
  input: unknown,
): Promise<{ id: string }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const data = createCollectionSchema.parse(input);

  const [row] = await db
    .insert(collections)
    .values({
      name: data.name,
      description: data.description,
      authorId: actor.id,
    })
    .returning({ id: collections.id });

  if (!row) throw new Error("Failed to create collection.");

  revalidateCollections(row.id);
  return { id: row.id };
}

export async function updateCollection(
  id: unknown,
  input: unknown,
): Promise<{ id: string }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const collectionId = collectionIdSchema.parse(id);
  const data = updateCollectionSchema.parse(input);

  const [row] = await db
    .update(collections)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, actor.id),
      ),
    )
    .returning({ id: collections.id });
  if (!row) throw new Error("Collection not found or you don't own it.");

  revalidateCollections(collectionId);
  return { id: collectionId };
}

export async function deleteCollection(
  id: unknown,
): Promise<{ id: string }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const collectionId = collectionIdSchema.parse(id);

  // members + links cascade in the database
  const [row] = await db
    .delete(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, actor.id),
      ),
    )
    .returning({ id: collections.id });
  if (!row) throw new Error("Collection not found or you don't own it.");

  revalidateCollections();
  return { id: collectionId };
}

/* ------------------------------------------------------------------ *
 * members — the collection must be yours, the snippet viewable by you
 * ------------------------------------------------------------------ */

export async function addSnippetToCollection(
  collectionId: unknown,
  snippetId: unknown,
): Promise<{ ok: true }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const cid = collectionIdSchema.parse(collectionId);
  const sid = snippetIdSchema.parse(snippetId);

  await requireOwnedCollection(cid, actor.id);

  const [target] = await db
    .select({
      id: snippets.id,
      authorId: snippets.authorId,
      visibility: snippets.visibility,
    })
    .from(snippets)
    .where(eq(snippets.id, sid))
    .limit(1);
  if (!target) throw new Error("Snippet not found.");
  if (target.visibility !== "public" && target.authorId !== actor.id) {
    throw new Error("Forbidden");
  }

  await db
    .insert(collectionSnippets)
    .values({ collectionId: cid, snippetId: sid })
    .onConflictDoNothing();
  await db
    .update(collections)
    .set({ updatedAt: new Date() })
    .where(eq(collections.id, cid));

  revalidateCollections(cid);
  return { ok: true as const };
}

export async function removeSnippetFromCollection(
  collectionId: unknown,
  snippetId: unknown,
): Promise<{ ok: true }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const cid = collectionIdSchema.parse(collectionId);
  const sid = snippetIdSchema.parse(snippetId);

  await requireOwnedCollection(cid, actor.id);

  await db
    .delete(collectionSnippets)
    .where(
      and(
        eq(collectionSnippets.collectionId, cid),
        eq(collectionSnippets.snippetId, sid),
      ),
    );
  await db
    .update(collections)
    .set({ updatedAt: new Date() })
    .where(eq(collections.id, cid));

  revalidateCollections(cid);
  return { ok: true as const };
}

/* ------------------------------------------------------------------ *
 * unlisted links — owner only, same pattern as snippet share links
 * ------------------------------------------------------------------ */

export async function createCollectionLink(
  id: unknown,
  expiry: unknown,
): Promise<{ token: string; expiresAt: string | null }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const collectionId = collectionIdSchema.parse(id);
  const days = shareExpirySchema.parse(expiry);

  await requireOwnedCollection(collectionId, actor.id);

  const token = crypto.randomUUID().replace(/-/g, "");
  const expiresAt = days ? new Date(Date.now() + days * 86_400_000) : null;

  await db.insert(collectionLinks).values({
    token,
    collectionId,
    createdBy: actor.id,
    expiresAt,
  });

  revalidateCollections(collectionId);
  return { token, expiresAt: expiresAt?.toISOString() ?? null };
}

export async function revokeCollectionLinks(
  id: unknown,
): Promise<{ ok: true }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const collectionId = collectionIdSchema.parse(id);

  await requireOwnedCollection(collectionId, actor.id);

  await db
    .update(collectionLinks)
    .set({ revoked: true })
    .where(eq(collectionLinks.collectionId, collectionId));

  revalidateCollections(collectionId);
  return { ok: true as const };
}
