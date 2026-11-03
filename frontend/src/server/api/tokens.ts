/**
 * API token lifecycle + verification.
 *
 * Raw tokens are never stored. `verifyApiToken` hashes the presented value,
 * looks it up, checks revocation/expiry, then records `lastUsedAt` and returns
 * the acting user. All queries are scoped by `user_id`, so one account can
 * never list or revoke another account's tokens.
 */

import { and, count, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

import { generateApiToken, hashApiToken } from "@/lib/api-token";
import type { ApiTokenSummary } from "@/lib/api-token-types";
import { db } from "@/server/db";
import { apiTokens, user } from "@/server/db/schema";

/** Active-token cap per account — stops runaway token creation. */
export const MAX_ACTIVE_TOKENS = 20;

export type ApiActor = {
  userId: string;
  /** null when the caller authenticated with a session cookie */
  tokenId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    defaultPrivate: boolean;
    createdAt: string;
  };
};

type TokenRow = typeof apiTokens.$inferSelect;

function toSummary(row: TokenRow): ApiTokenSummary {
  return {
    id: row.id,
    name: row.name,
    prefix: row.prefix,
    lastUsedAt: row.lastUsedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    revokedAt: row.revokedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export class ApiTokenLimitError extends Error {
  constructor() {
    super(
      `You already have ${MAX_ACTIVE_TOKENS} active tokens. Revoke one before creating another.`,
    );
    this.name = "ApiTokenLimitError";
  }
}

export async function createTokenForUser(
  userId: string,
  name: string,
  expiresInDays?: number,
): Promise<{ token: ApiTokenSummary; raw: string }> {
  const now = new Date();
  const [active] = await db
    .select({ n: count() })
    .from(apiTokens)
    .where(
      and(
        eq(apiTokens.userId, userId),
        isNull(apiTokens.revokedAt),
        or(isNull(apiTokens.expiresAt), gt(apiTokens.expiresAt, now)),
      ),
    );

  if ((active?.n ?? 0) >= MAX_ACTIVE_TOKENS) {
    throw new ApiTokenLimitError();
  }

  const generated = generateApiToken();
  const expiresAt =
    expiresInDays && expiresInDays > 0
      ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

  const [row] = await db
    .insert(apiTokens)
    .values({
      userId,
      name,
      tokenHash: generated.hash,
      prefix: generated.prefix,
      expiresAt,
    })
    .returning();

  if (!row) throw new Error("Failed to create token.");

  return { token: toSummary(row), raw: generated.raw };
}

export async function listTokensForUser(
  userId: string,
): Promise<ApiTokenSummary[]> {
  const rows = await db
    .select()
    .from(apiTokens)
    .where(eq(apiTokens.userId, userId))
    .orderBy(desc(apiTokens.createdAt), desc(apiTokens.id));
  return rows.map(toSummary);
}

/** Returns the revoked token id, or null when it does not belong to `userId`. */
export async function revokeTokenForUser(
  userId: string,
  tokenId: string,
): Promise<string | null> {
  const [row] = await db
    .update(apiTokens)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(apiTokens.id, tokenId),
        eq(apiTokens.userId, userId),
        isNull(apiTokens.revokedAt),
      ),
    )
    .returning({ id: apiTokens.id });
  return row?.id ?? null;
}

/**
 * Resolve a raw bearer token to its owner. Returns null for unknown, revoked,
 * or expired tokens — callers answer 401 without leaking which case it was.
 */
export async function verifyApiToken(raw: string): Promise<ApiActor | null> {
  const now = new Date();
  const [row] = await db
    .select({
      tokenId: apiTokens.id,
      userId: apiTokens.userId,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      userDefaultPrivate: user.defaultPrivate,
      userCreatedAt: user.createdAt,
    })
    .from(apiTokens)
    .innerJoin(user, eq(user.id, apiTokens.userId))
    .where(
      and(
        eq(apiTokens.tokenHash, hashApiToken(raw)),
        isNull(apiTokens.revokedAt),
        or(isNull(apiTokens.expiresAt), gt(apiTokens.expiresAt, now)),
      ),
    )
    .limit(1);

  if (!row) return null;

  // Best-effort telemetry; a failure here must not reject a valid token.
  try {
    await db
      .update(apiTokens)
      .set({ lastUsedAt: now })
      .where(eq(apiTokens.id, row.tokenId));
  } catch {
    // ignore — the token is still valid
  }

  return {
    userId: row.userId,
    tokenId: row.tokenId,
    user: {
      id: row.userId,
      name: row.userName,
      email: row.userEmail,
      image: row.userImage,
      defaultPrivate: row.userDefaultPrivate,
      createdAt: row.userCreatedAt.toISOString(),
    },
  };
}

/** Used by token-management routes: cookie session, no bearer token. */
export async function sessionActorFromHeaders(
  headers: Headers,
): Promise<ApiActor | null> {
  const { auth } = await import("@/server/auth");
  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  return {
    userId: session.user.id,
    tokenId: null,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
      defaultPrivate: session.user.defaultPrivate ?? true,
      createdAt: session.user.createdAt.toISOString(),
    },
  };
}

/** Count active tokens — exposed for diagnostics/tests. */
export async function countActiveTokens(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(apiTokens)
    .where(
      and(
        eq(apiTokens.userId, userId),
        isNull(apiTokens.revokedAt),
        or(isNull(apiTokens.expiresAt), gt(apiTokens.expiresAt, new Date())),
      ),
    );
  return row?.n ?? 0;
}
