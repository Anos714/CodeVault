/**
 * Personal access token format and hashing.
 *
 * Raw tokens look like `cv_pat_<43 base64url chars>` (32 random bytes). They
 * are stored as SHA-256 hex only — a database leak does not expose usable
 * credentials. This module is pure and shared by the server and unit tests.
 */

import { createHash, randomBytes } from "node:crypto";

export const API_TOKEN_PREFIX = "cv_pat_";

/** 32 random bytes → 43 base64url characters. */
const TOKEN_BYTES = 32;

/**
 * Shape check before any database work: the fixed prefix plus at least 32
 * base64url characters (a real token has 43).
 */
const TOKEN_RE = /^cv_pat_[A-Za-z0-9_-]{32,}$/;

/** Number of characters after the prefix shown in the UI. */
const PREFIX_VISIBLE_CHARS = 6;

export type GeneratedApiToken = {
  /** full secret — shown once, never persisted */
  raw: string;
  /** SHA-256 hex persisted in `api_tokens.token_hash` */
  hash: string;
  /** short identifier persisted in `api_tokens.prefix` */
  prefix: string;
};

export function hashApiToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

export function generateApiToken(): GeneratedApiToken {
  const raw = `${API_TOKEN_PREFIX}${randomBytes(TOKEN_BYTES).toString("base64url")}`;
  return {
    raw,
    hash: hashApiToken(raw),
    prefix: raw.slice(0, API_TOKEN_PREFIX.length + PREFIX_VISIBLE_CHARS),
  };
}

/** True when `value` has the right prefix and enough entropy. */
export function isApiToken(value: string): boolean {
  return TOKEN_RE.test(value);
}

/**
 * Extract a token from an `Authorization: Bearer …` header.
 * Returns null for anything malformed so callers can answer 401 uniformly.
 */
export function parseBearerToken(
  header: string | null | undefined,
): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) return null;
  const raw = match[1] ?? "";
  return isApiToken(raw) ? raw : null;
}
