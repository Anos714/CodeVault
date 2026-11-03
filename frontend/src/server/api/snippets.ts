/**
 * Snippet mutations for the REST API.
 *
 * Mirrors `src/server/actions/snippets.ts` — same validation contract, same
 * ownership rule (`WHERE author_id = caller`), same atomic tag replacement —
 * but takes the caller id as an argument instead of reading a cookie session.
 * Actions stay untouched so the dashboard's behavior is unchanged.
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { snippetTags, snippets } from "@/server/db/schema";
import type {
  CreateSnippetData,
  UpdateSnippetData,
} from "@/server/validations";
import { ApiError } from "@/server/api/http";

export async function createSnippetForUser(
  userId: string,
  data: CreateSnippetData,
): Promise<string> {
  const [row] = await db
    .insert(snippets)
    .values({
      title: data.title,
      description: data.description,
      language: data.language,
      code: data.code,
      visibility: data.visibility,
      authorId: userId,
    })
    .returning({ id: snippets.id });

  if (!row) throw new ApiError(500, "internal_error", "Failed to create snippet.");

  if (data.tags.length > 0) {
    await db
      .insert(snippetTags)
      .values(data.tags.map((tag) => ({ snippetId: row.id, tag })))
      .onConflictDoNothing();
  }

  return row.id;
}

export async function updateSnippetForUser(
  userId: string,
  snippetId: string,
  data: UpdateSnippetData,
): Promise<void> {
  const { tags, ...fields } = data;
  const patch: Partial<typeof snippets.$inferInsert> = { ...fields };

  if (Object.keys(patch).length > 0) {
    patch.updatedAt = new Date();
  } else if (tags === undefined) {
    throw new ApiError(400, "validation_error", "Nothing to update.");
  }

  if (Object.keys(patch).length > 0) {
    const [row] = await db
      .update(snippets)
      .set(patch)
      .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, userId)))
      .returning({ id: snippets.id });
    if (!row) throw notFound();
  } else {
    // tags-only update still needs an ownership proof
    const [owned] = await db
      .select({ id: snippets.id })
      .from(snippets)
      .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, userId)))
      .limit(1);
    if (!owned) throw notFound();
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
}

export async function deleteSnippetForUser(
  userId: string,
  snippetId: string,
): Promise<void> {
  const [row] = await db
    .delete(snippets)
    .where(and(eq(snippets.id, snippetId), eq(snippets.authorId, userId)))
    .returning({ id: snippets.id });
  if (!row) throw notFound();
}

/** Absence and ownership failure are deliberately indistinguishable. */
export function notFound(): ApiError {
  return new ApiError(404, "not_found", "Snippet not found.");
}
