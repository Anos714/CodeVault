/**
 * Unlisted share links — mint and revoke.
 *
 * Only the snippet owner can mint or revoke links for it. A link is a 32-hex
 * opaque token (the `/s/[token]` URL); expiry is `null` (never) or 1/7/30
 * days, matching SHARE_EXPIRY_OPTIONS in lib/share.ts.
 */

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { auth } from "@/server/auth";
import { checkLimit } from "@/server/ratelimit";
import { db } from "@/server/db";
import { shareLinks, snippets } from "@/server/db/schema";
import { shareExpirySchema, snippetIdSchema } from "@/server/validations";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function requireOwnedSnippet(snippetId: string, ownerId: string) {
  const [row] = await db
    .select({ id: snippets.id })
    .from(snippets)
    .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, ownerId)))
    .limit(1);
  if (!row) throw new Error("Snippet not found or you don't own it.");
  return row;
}

export async function createShareLink(
  id: unknown,
  expiry: unknown,
): Promise<{ token: string; expiresAt: string | null }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const snippetId = snippetIdSchema.parse(id);
  const days = shareExpirySchema.parse(expiry);

  await requireOwnedSnippet(snippetId, actor.id);

  const token = crypto.randomUUID().replace(/-/g, "");
  const expiresAt = days ? new Date(Date.now() + days * 86_400_000) : null;

  await db.insert(shareLinks).values({
    token,
    snippetId,
    createdBy: actor.id,
    expiresAt,
  });

  revalidatePath(`/dashboard/snippets/${snippetId}`);
  return { token, expiresAt: expiresAt?.toISOString() ?? null };
}

export async function revokeShareLinks(id: unknown): Promise<{ ok: true }> {
  const actor = await requireUser();
  const { ok: allowed } = await checkLimit("write", actor.id);
  if (!allowed) throw new Error("Slow down — too many changes in a minute.");
  const snippetId = snippetIdSchema.parse(id);

  await requireOwnedSnippet(snippetId, actor.id);

  await db
    .update(shareLinks)
    .set({ revoked: true })
    .where(eq(shareLinks.snippetId, snippetId));

  revalidatePath(`/dashboard/snippets/${snippetId}`);
  return { ok: true as const };
}
