/**
 * Request authentication for `/api/v1`.
 *
 * - `requirePatActor` — Bearer `cv_pat_…` only (extensions, CLI).
 * - `requireSessionActor` — Better Auth cookie only (token-management routes
 *   called from the settings page).
 *
 * Both apply a rate limit before the handler touches the database.
 */

import { checkLimit, type LimitKind } from "@/server/ratelimit";
import type { ApiActor } from "@/server/api/tokens";
import {
  sessionActorFromHeaders,
  verifyApiToken,
} from "@/server/api/tokens";
import { parseBearerToken } from "@/lib/api-token";
import { ApiError } from "@/server/api/http";

async function enforceLimit(actor: ApiActor, kind: LimitKind) {
  const { ok, reset } = await checkLimit(kind, actor.userId);
  if (!ok) {
    throw new ApiError(429, "rate_limited", "Too many requests — slow down.", {
      retryAt: reset ? new Date(reset).toISOString() : null,
    });
  }
}

export async function requirePatActor(
  request: Request,
  kind: LimitKind = "api-read",
): Promise<ApiActor> {
  const raw = parseBearerToken(request.headers.get("authorization"));
  if (!raw) {
    throw new ApiError(
      401,
      "unauthorized",
      "Missing or malformed token. Send `Authorization: Bearer cv_pat_…`.",
    );
  }

  const actor = await verifyApiToken(raw);
  if (!actor) {
    throw new ApiError(
      401,
      "invalid_token",
      "This token is invalid, revoked, or expired.",
    );
  }

  await enforceLimit(actor, kind);
  return actor;
}

export async function requireSessionActor(
  request: Request,
  kind: LimitKind = "api-write",
): Promise<ApiActor> {
  const actor = await sessionActorFromHeaders(request.headers);
  if (!actor) {
    throw new ApiError(
      401,
      "unauthorized",
      "Sign in to CodeVault to manage API tokens.",
    );
  }
  await enforceLimit(actor, kind);
  return actor;
}
