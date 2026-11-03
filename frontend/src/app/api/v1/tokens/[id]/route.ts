/**
 * `DELETE /api/v1/tokens/:id` — revoke a token.
 *
 * Revocation is soft (`revoked_at`) so the audit trail survives. Already
 * revoked or foreign tokens answer 404, identical to an unknown id.
 */

import { requireSessionActor } from "@/server/api/auth";
import {
  ApiError,
  apiJson,
  errorResponse,
  preflight,
} from "@/server/api/http";
import { revokeTokenForUser } from "@/server/api/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const actor = await requireSessionActor(request, "api-write");
    const { id } = await params;
    if (!id.trim()) {
      throw new ApiError(400, "validation_error", "Token id is required.");
    }
    const revoked = await revokeTokenForUser(actor.userId, id);
    if (!revoked) {
      throw new ApiError(404, "not_found", "Token not found.");
    }
    return apiJson(request, { ok: true, id: revoked });
  } catch (error) {
    return errorResponse(request, error);
  }
}
