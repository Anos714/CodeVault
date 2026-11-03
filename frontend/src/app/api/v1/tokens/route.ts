/**
 * `GET /api/v1/tokens` — list the caller's tokens (never the secret).
 * `POST /api/v1/tokens` — mint a new token; the raw value is returned once.
 *
 * These routes use the Better Auth cookie session, not a bearer token: token
 * management belongs to the signed-in settings page. The extension connect
 * flow is "create a token here, paste it there".
 */

import { z } from "zod";

import { requireSessionActor } from "@/server/api/auth";
import {
  ApiError,
  apiJson,
  errorResponse,
  preflight,
  readJson,
} from "@/server/api/http";
import {
  ApiTokenLimitError,
  createTokenForUser,
  listTokensForUser,
} from "@/server/api/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createTokenSchema = z.object({
  name: z.string().trim().min(1, "Give the token a name.").max(60),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  try {
    const actor = await requireSessionActor(request, "api-read");
    const tokens = await listTokensForUser(actor.userId);
    return apiJson(request, { tokens });
  } catch (error) {
    return errorResponse(request, error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireSessionActor(request, "api-write");
    const { name, expiresInDays } = createTokenSchema.parse(
      await readJson(request),
    );
    try {
      const created = await createTokenForUser(
        actor.userId,
        name,
        expiresInDays,
      );
      return apiJson(request, created, { status: 201 });
    } catch (error) {
      if (error instanceof ApiTokenLimitError) {
        return errorResponse(
          request,
          new ApiError(409, "token_limit", error.message),
        );
      }
      throw error;
    }
  } catch (error) {
    return errorResponse(request, error);
  }
}
