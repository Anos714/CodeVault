/**
 * Read actions — keyset pages for the "Load more" buttons.
 *
 * Mutations live in snippets.ts/share.ts; these exist so client views can
 * append the *next* page without a navigation. Filters are re-validated here
 * (never trusted from the client), ownership/viewer identity comes from the
 * session, and results stay narrow like every other action return.
 */

"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/server/auth";
import {
  exploreSnippets,
  listOwnSnippets,
  PAGE_SIZE,
  type VaultFilters,
} from "@/server/queries";

const filtersSchema = z.object({
  q: z.string().max(200).default(""),
  tag: z.string().max(64).default(""),
  visibility: z.enum(["all", "private", "public"]).default("all"),
  sort: z.enum(["updated", "created", "copies", "favorites"]).default("updated"),
});

const cursorSchema = z.string().max(512).nullable().default(null);

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}

export async function fetchVaultPage(
  filters: unknown,
  cursor: unknown,
): Promise<{
  snippets: Awaited<ReturnType<typeof listOwnSnippets>>["snippets"];
  nextCursor: string | null;
}> {
  const userId = await requireUserId();
  const parsed: VaultFilters = filtersSchema.parse(filters ?? {});
  const page = await listOwnSnippets(userId, parsed, {
    limit: PAGE_SIZE,
    cursor: cursorSchema.parse(cursor ?? null),
  });
  return { snippets: page.snippets, nextCursor: page.nextCursor };
}

const exploreArgsSchema = z.object({
  q: z.string().max(200).default(""),
  starredOnly: z.boolean().default(false),
});

export async function fetchExplorePage(
  args: unknown,
  cursor: unknown,
): Promise<{
  snippets: Awaited<ReturnType<typeof exploreSnippets>>["snippets"];
  nextCursor: string | null;
}> {
  const viewerId = await requireUserId();
  const parsed = exploreArgsSchema.parse(args ?? {});
  const page = await exploreSnippets({
    viewerId,
    q: parsed.q,
    starredOnly: parsed.starredOnly,
    limit: PAGE_SIZE,
    cursor: cursorSchema.parse(cursor ?? null),
  });
  return { snippets: page.snippets, nextCursor: page.nextCursor };
}
