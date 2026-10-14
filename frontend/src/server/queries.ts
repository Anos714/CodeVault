/**
 * Data Access Layer — every read path in the app.
 *
 * Pages and route handlers (server only) fetch through here; client
 * components receive the results as props and never touch the database.
 * Every query returns the store-compatible `Snippet` shape (tags as
 * string[], denormalised authorName, ISO dates) plus `starred` for the
 * current viewer, so the existing JSX renders unchanged.
 */

import "server-only";

import { and, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import {
  favorites,
  shareLinks,
  snippetTags,
  snippets,
  user,
} from "@/server/db/schema";
import { isLanguage } from "@/lib/languages";
import type {
  HydratedSnippet,
  ShareLink,
  Snippet,
  Visibility,
} from "@/lib/snippet-types";

type SnippetRow = typeof snippets.$inferSelect;

/* ------------------------------------------------------------------ *
 * hydration — rows in, Snippet shapes out
 * ------------------------------------------------------------------ */

async function hydrate(
  rows: SnippetRow[],
  viewerId: string | null,
  opts?: { includeLinks?: boolean },
): Promise<HydratedSnippet[]> {
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const authorIds = [...new Set(rows.map((row) => row.authorId))];

  const [tagRows, authorRows, favRows, linkRows] = await Promise.all([
    db
      .select({ snippetId: snippetTags.snippetId, tag: snippetTags.tag })
      .from(snippetTags)
      .where(inArray(snippetTags.snippetId, ids)),
    db
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(inArray(user.id, authorIds)),
    viewerId
      ? db
          .select({ snippetId: favorites.snippetId })
          .from(favorites)
          .where(
            and(
              eq(favorites.userId, viewerId),
              inArray(favorites.snippetId, ids),
            ),
          )
      : Promise.resolve([] as Array<{ snippetId: string }>),
    opts?.includeLinks
      ? db
          .select()
          .from(shareLinks)
          .where(inArray(shareLinks.snippetId, ids))
          .orderBy(shareLinks.createdAt)
      : Promise.resolve([] as Array<typeof shareLinks.$inferSelect>),
  ]);

  const tagsBySnippet = new Map<string, string[]>();
  for (const row of tagRows) {
    const list = tagsBySnippet.get(row.snippetId) ?? [];
    list.push(row.tag);
    tagsBySnippet.set(row.snippetId, list);
  }
  for (const list of tagsBySnippet.values()) list.sort();

  const namesByAuthor = new Map(authorRows.map((row) => [row.id, row.name]));
  const starredIds = new Set(favRows.map((row) => row.snippetId));

  const linksBySnippet = new Map<string, ShareLink[]>();
  for (const row of linkRows) {
    const list = linksBySnippet.get(row.snippetId) ?? [];
    list.push({
      token: row.token,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      revoked: row.revoked,
    });
    linksBySnippet.set(row.snippetId, list);
  }

  return rows.map((row) => {
    const snippet: Snippet = {
      id: row.id,
      title: row.title,
      description: row.description,
      language: isLanguage(row.language) ? row.language : "typescript",
      tags: tagsBySnippet.get(row.id) ?? [],
      code: row.code,
      visibility: row.visibility === "public" ? "public" : "private",
      authorId: row.authorId,
      authorName: namesByAuthor.get(row.authorId) ?? "unknown",
      favorites: row.favorites,
      copies: row.copies,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      forkedFromId: row.forkedFromId ?? undefined,
      forkedFromAuthor: row.forkedFromAuthor ?? undefined,
    };
    const links = linksBySnippet.get(row.id);
    if (links) snippet.shareLinks = links;
    return { ...snippet, starred: starredIds.has(row.id) };
  });
}

/* ------------------------------------------------------------------ *
 * filters
 * ------------------------------------------------------------------ */

/** Strip LIKE wildcards so user input can't widen a search. */
function safePattern(q: string): string | null {
  const cleaned = q.replace(/[%_\\]/g, "").trim();
  return cleaned ? `%${cleaned}%` : null;
}

export type VaultSort = "updated" | "created" | "copies" | "favorites";

export type VaultFilters = {
  q?: string;
  tag?: string;
  visibility?: Visibility | "all";
  sort?: VaultSort;
};

function sortColumn(sort: VaultSort = "updated") {
  switch (sort) {
    case "created":
      return desc(snippets.createdAt);
    case "copies":
      return desc(snippets.copies);
    case "favorites":
      return desc(snippets.favorites);
    case "updated":
    default:
      return desc(snippets.updatedAt);
  }
}

/* ------------------------------------------------------------------ *
 * own vault — list, stats, tags
 * ------------------------------------------------------------------ */

export async function listOwnSnippets(
  userId: string,
  filters: VaultFilters = {},
): Promise<{ snippets: HydratedSnippet[]; total: number }> {
  const { q = "", tag = "", visibility = "all", sort = "updated" } = filters;

  const conditions: (SQL | undefined)[] = [eq(snippets.authorId, userId)];

  if (visibility !== "all") {
    conditions.push(eq(snippets.visibility, visibility));
  }

  if (tag) {
    conditions.push(
      inArray(
        snippets.id,
        db
          .select({ id: snippetTags.snippetId })
          .from(snippetTags)
          .where(eq(snippetTags.tag, tag)),
      ),
    );
  }

  const pattern = safePattern(q);
  if (pattern) {
    conditions.push(
      or(
        ilike(snippets.title, pattern),
        ilike(snippets.description, pattern),
        ilike(snippets.language, pattern),
        inArray(
          snippets.id,
          db
            .select({ id: snippetTags.snippetId })
            .from(snippetTags)
            .where(ilike(snippetTags.tag, pattern)),
        ),
      ),
    );
  }

  const [rows, [countRow]] = await Promise.all([
    db
      .select()
      .from(snippets)
      .where(and(...conditions))
      .orderBy(sortColumn(sort), snippets.id),
    db
      .select({ n: sql`count(*)`.mapWith(Number) })
      .from(snippets)
      .where(eq(snippets.authorId, userId)),
  ]);

  return {
    snippets: await hydrate(rows, userId),
    total: countRow?.n ?? 0,
  };
}

export async function getVaultStats(userId: string): Promise<{
  total: number;
  publicCount: number;
  privateCount: number;
  totalCopies: number;
}> {
  const rows = await db
    .select({
      visibility: snippets.visibility,
      n: sql`count(*)`.mapWith(Number),
      copies: sql`coalesce(sum(${snippets.copies}), 0)`.mapWith(Number),
    })
    .from(snippets)
    .where(eq(snippets.authorId, userId))
    .groupBy(snippets.visibility);

  let total = 0;
  let publicCount = 0;
  let privateCount = 0;
  let totalCopies = 0;
  for (const row of rows) {
    total += row.n;
    totalCopies += row.copies;
    if (row.visibility === "public") publicCount += row.n;
    else privateCount += row.n;
  }
  return { total, publicCount, privateCount, totalCopies };
}

export async function getRecentSnippets(
  userId: string,
  limit = 6,
): Promise<HydratedSnippet[]> {
  const rows = await db
    .select()
    .from(snippets)
    .where(eq(snippets.authorId, userId))
    .orderBy(desc(snippets.updatedAt), snippets.id)
    .limit(limit);
  return hydrate(rows, userId);
}

export async function getTagCounts(
  userId: string,
): Promise<Array<[string, number]>> {
  const rows = await db
    .select({
      tag: snippetTags.tag,
      n: sql`count(*)`.mapWith(Number),
    })
    .from(snippetTags)
    .innerJoin(snippets, eq(snippetTags.snippetId, snippets.id))
    .where(eq(snippets.authorId, userId))
    .groupBy(snippetTags.tag)
    .orderBy(sql`count(*) desc`, snippetTags.tag);
  return rows.map((row) => [row.tag, row.n]);
}

export async function getLanguageCounts(
  userId: string,
): Promise<Array<[string, number]>> {
  const rows = await db
    .select({
      language: snippets.language,
      n: sql`count(*)`.mapWith(Number),
    })
    .from(snippets)
    .where(eq(snippets.authorId, userId))
    .groupBy(snippets.language)
    .orderBy(sql`count(*) desc`, snippets.language);
  return rows.map((row) => [row.language, row.n]);
}

/* ------------------------------------------------------------------ *
 * single snippet — owner sees links, everyone else sees the rest
 * ------------------------------------------------------------------ */

export async function getSnippetById(
  id: string,
  viewerId: string | null,
): Promise<HydratedSnippet | null> {
  const [row] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, id))
    .limit(1);
  if (!row) return null;

  const isOwner = viewerId !== null && row.authorId === viewerId;
  if (row.visibility !== "public" && !isOwner) return null;

  const [snippet] = await hydrate([row], viewerId, { includeLinks: isOwner });
  return snippet ?? null;
}

export async function getPublicSnippetById(
  id: string,
  viewerId: string | null,
): Promise<HydratedSnippet | null> {
  const [row] = await db
    .select()
    .from(snippets)
    .where(and(eq(snippets.id, id), eq(snippets.visibility, "public")))
    .limit(1);
  if (!row) return null;

  const [snippet] = await hydrate([row], viewerId);
  return snippet ?? null;
}

/* ------------------------------------------------------------------ *
 * explore — the public feed
 * ------------------------------------------------------------------ */

export async function exploreSnippets(opts: {
  viewerId: string | null;
  q?: string;
  starredOnly?: boolean;
}): Promise<HydratedSnippet[]> {
  const { viewerId, q = "", starredOnly = false } = opts;

  // "starred only" without a viewer is an empty set, not the whole feed
  if (starredOnly && !viewerId) return [];

  const conditions: (SQL | undefined)[] = [eq(snippets.visibility, "public")];

  if (starredOnly && viewerId) {
    conditions.push(
      inArray(
        snippets.id,
        db
          .select({ id: favorites.snippetId })
          .from(favorites)
          .where(eq(favorites.userId, viewerId)),
      ),
    );
  }

  const pattern = safePattern(q);
  if (pattern) {
    conditions.push(
      or(
        ilike(snippets.title, pattern),
        ilike(snippets.description, pattern),
        ilike(snippets.language, pattern),
        inArray(
          snippets.id,
          db
            .select({ id: snippetTags.snippetId })
            .from(snippetTags)
            .where(ilike(snippetTags.tag, pattern)),
        ),
        inArray(
          snippets.id,
          db
            .select({ id: snippets.id })
            .from(snippets)
            .innerJoin(user, eq(snippets.authorId, user.id))
            .where(ilike(user.name, pattern)),
        ),
      ),
    );
  }

  const rows = await db
    .select({ snippets })
    .from(snippets)
    .where(and(...conditions))
    .orderBy(desc(snippets.favorites), desc(snippets.updatedAt), snippets.id);

  return hydrate(
    rows.map((row) => row.snippets),
    viewerId,
  );
}

/* ------------------------------------------------------------------ *
 * share + embed — unlisted access without a session
 * ------------------------------------------------------------------ */

export type ResolvedShare = {
  snippet: HydratedSnippet;
  link: ShareLink;
};

export async function resolveShareToken(
  token: string,
  viewerId: string | null,
): Promise<ResolvedShare | null> {
  const [linkRow] = await db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.token, token))
    .limit(1);
  if (!linkRow || linkRow.revoked) return null;
  if (linkRow.expiresAt && linkRow.expiresAt.getTime() < Date.now()) {
    return null;
  }

  // the link authorizes this read — even a private snippet opens for it
  const [row] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, linkRow.snippetId))
    .limit(1);
  if (!row) return null;

  const [snippet] = await hydrate([row], viewerId);
  if (!snippet) return null;

  return {
    snippet,
    link: {
      token: linkRow.token,
      expiresAt: linkRow.expiresAt?.toISOString() ?? null,
      createdAt: linkRow.createdAt.toISOString(),
      revoked: linkRow.revoked,
    },
  };
}

export async function getEmbedSnippet(
  id: string,
  viewerId: string | null,
): Promise<HydratedSnippet | null> {
  const [row] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, id))
    .limit(1);
  if (!row) return null;

  // embeds are linkable by id, so private code stays behind ownership
  const isOwner = viewerId !== null && row.authorId === viewerId;
  if (row.visibility !== "public" && !isOwner) return null;

  const [snippet] = await hydrate([row], viewerId);
  return snippet ?? null;
}
