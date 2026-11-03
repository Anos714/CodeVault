/**
 * Token management for the settings page.
 *
 * Same auth and rate limit as every other action; the REST equivalents live
 * under `/api/v1/tokens` for non-browser clients. Creating returns the raw
 * token exactly once — the UI must show it immediately and never expect it
 * again.
 */

"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/server/auth";
import { checkLimit } from "@/server/ratelimit";
import {
  ApiTokenLimitError,
  createTokenForUser,
  listTokensForUser,
  revokeTokenForUser,
} from "@/server/api/tokens";
import type { ApiTokenSummary } from "@/lib/api-token-types";

const createTokenSchema = z.object({
  name: z.string().trim().min(1, "Give the token a name.").max(60),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function limitWrites(userId: string) {
  const { ok } = await checkLimit("write", userId);
  if (!ok) throw new Error("Slow down — too many changes in a minute.");
}

export async function createApiTokenAction(
  input: unknown,
): Promise<{ token: ApiTokenSummary; raw: string }> {
  const actor = await requireUser();
  await limitWrites(actor.id);
  const { name, expiresInDays } = createTokenSchema.parse(input);
  try {
    return await createTokenForUser(actor.id, name, expiresInDays);
  } catch (error) {
    if (error instanceof ApiTokenLimitError) throw new Error(error.message);
    throw error;
  }
}

export async function listApiTokensAction(): Promise<ApiTokenSummary[]> {
  const actor = await requireUser();
  return listTokensForUser(actor.id);
}

export async function revokeApiTokenAction(
  id: unknown,
): Promise<{ id: string }> {
  const actor = await requireUser();
  await limitWrites(actor.id);
  const tokenId = z.string().trim().min(1).max(128).parse(id);
  const revoked = await revokeTokenForUser(actor.id, tokenId);
  if (!revoked) throw new Error("Token not found.");
  return { id: revoked };
}
