/**
 * `GET /api/v1/me` — the account behind the bearer token.
 *
 * Used by both extensions to prove a pasted token works and to show the
 * connected name/email in their UI.
 */

import { requirePatActor } from "@/server/api/auth";
import { apiJson, errorResponse, preflight } from "@/server/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  try {
    const actor = await requirePatActor(request, "api-read");
    return apiJson(request, { user: actor.user });
  } catch (error) {
    return errorResponse(request, error);
  }
}
