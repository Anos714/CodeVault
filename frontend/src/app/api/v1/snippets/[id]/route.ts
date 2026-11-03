/**
 * `GET|PATCH|DELETE /api/v1/snippets/:id`.
 *
 * Reads follow the same rule as the app: public snippets are visible to any
 * authenticated caller, private ones only to their owner. Writes are always
 * owner-only and answer 404 for both "missing" and "not yours".
 */

import { getSnippetById } from "@/server/queries";
import { snippetIdSchema, updateSnippetSchema } from "@/server/validations";
import { requirePatActor } from "@/server/api/auth";
import {
  apiJson,
  errorResponse,
  preflight,
  readJson,
} from "@/server/api/http";
import {
  deleteSnippetForUser,
  notFound,
  updateSnippetForUser,
} from "@/server/api/snippets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const actor = await requirePatActor(request, "api-read");
    const id = snippetIdSchema.parse((await params).id);
    const snippet = await getSnippetById(id, actor.userId);
    if (!snippet) throw notFound();
    return apiJson(request, { snippet });
  } catch (error) {
    return errorResponse(request, error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const actor = await requirePatActor(request, "api-write");
    const id = snippetIdSchema.parse((await params).id);
    const data = updateSnippetSchema.parse(await readJson(request));
    await updateSnippetForUser(actor.userId, id, data);
    const snippet = await getSnippetById(id, actor.userId);
    if (!snippet) throw notFound();
    return apiJson(request, { snippet });
  } catch (error) {
    return errorResponse(request, error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const actor = await requirePatActor(request, "api-write");
    const id = snippetIdSchema.parse((await params).id);
    await deleteSnippetForUser(actor.userId, id);
    return apiJson(request, { ok: true, id });
  } catch (error) {
    return errorResponse(request, error);
  }
}
