import { describe, expect, it } from "vitest";

import {
  API_TOKEN_PREFIX,
  generateApiToken,
  hashApiToken,
  isApiToken,
  parseBearerToken,
} from "@/lib/api-token";

describe("API token format", () => {
  it("generates a prefixed token with a 64-char SHA-256 hash", () => {
    const token = generateApiToken();
    expect(token.raw.startsWith(API_TOKEN_PREFIX)).toBe(true);
    expect(token.raw.length).toBeGreaterThan(API_TOKEN_PREFIX.length + 40);
    expect(token.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(token.prefix.startsWith(API_TOKEN_PREFIX)).toBe(true);
    expect(token.prefix.length).toBeLessThan(token.raw.length);
  });

  it("generates unique tokens", () => {
    const a = generateApiToken();
    const b = generateApiToken();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hash).not.toBe(b.hash);
  });

  it("hashes deterministically and only stores the hash", () => {
    const token = generateApiToken();
    expect(hashApiToken(token.raw)).toBe(token.hash);
    expect(hashApiToken(token.raw)).not.toContain(token.raw);
    expect(token.hash).not.toContain(token.raw.slice(API_TOKEN_PREFIX.length));
  });

  it("validates the prefix and minimum entropy", () => {
    expect(isApiToken(generateApiToken().raw)).toBe(true);
    expect(isApiToken("cv_pat_short")).toBe(false);
    expect(isApiToken(`sk_${"a".repeat(43)}`)).toBe(false);
    expect(isApiToken(`cv_pat_${"!".repeat(43)}`)).toBe(false);
  });
});

describe("Authorization header parsing", () => {
  it("accepts Bearer tokens case-insensitively", () => {
    const { raw } = generateApiToken();
    expect(parseBearerToken(`Bearer ${raw}`)).toBe(raw);
    expect(parseBearerToken(`bearer ${raw}`)).toBe(raw);
    expect(parseBearerToken(`  BEARER   ${raw}  `)).toBe(raw);
  });

  it("rejects missing, malformed, and non-CodeVault tokens", () => {
    const { raw } = generateApiToken();
    expect(parseBearerToken(null)).toBeNull();
    expect(parseBearerToken("")).toBeNull();
    expect(parseBearerToken(raw)).toBeNull();
    expect(parseBearerToken("Basic abc")).toBeNull();
    expect(parseBearerToken("Bearer")).toBeNull();
    expect(parseBearerToken("Bearer two words")).toBeNull();
    expect(parseBearerToken(`Bearer sk_${"a".repeat(43)}`)).toBeNull();
  });
});
