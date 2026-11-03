/**
 * `GET /api/v1/snippets` — list/search the caller's vault.
 * `POST /api/v1/snippets` — create a snippet.
 *
 * Query parameters mirror the dashboard filters: `q`, `tag`, `visibility`,
 * `sort`, `limit` (1–50, default 20), and the opaque `cursor` returned by the
 * previous page.
 */

import { z } from "zod";

import { getSnippetById, listOwnSnippets } from "@/server/queries";
import { createSnippetSchema } from "@/server/validations";
import { requirePatActor } from "@/server/api/auth";
import {
  apiJson,
  errorResponse,
  preflight,
  readJson,
} from "@/server/api/http";
import { createSnippetForUser } from "@/server/api/snippets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const listQuerySchema = z.object({
  q: z.string().trim().max(200).default(""),
  tag: z.string().trim().max(40).default(""),
  visibility: z.enum(["all", "private", "public"]).default("all"),
  sort: z.enum(["updated", "created", "copies", "favorites"]).default("updated"),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().trim().max(512).optional(),
});

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  try {
    const actor = await requirePatActor(request, "api-read");
    const params = new URL(request.url).searchParams;
    const query = listQuerySchema.parse({
      q: params.get("q") ?? undefined,
      tag: params.get("tag") ?? undefined,
      visibility: params.get("visibility") ?? undefined,
      sort: params.get("sort") ?? undefined,
      limit: params.get("limit") ?? undefined,
      cursor: params.get("cursor") ?? undefined,
    });

    const page = await listOwnSnippets(
      actor.userId,
      {
        q: query.q,
        tag: query.tag,
        visibility: query.visibility,
        sort: query.sort,
      },
      { limit: query.limit, cursor: query.cursor ?? null },
    );

    return apiJson(request, {
      snippets: page.snippets,
      total: page.total,
      nextCursor: page.nextCursor,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requirePatActor(request, "api-write");
    const data = createSnippetSchema.parse(await readJson(request));
    const id = await createSnippetForUser(actor.userId, data);
    const snippet = await getSnippetById(id, actor.userId);
    return apiJson(request, { snippet }, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
