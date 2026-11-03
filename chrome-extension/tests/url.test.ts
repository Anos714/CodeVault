import { describe, expect, it } from "vitest";

import { isApiToken } from "../src/shared/token";
import {
  normalizeBaseUrl,
  settingsWebUrl,
  snippetWebUrl,
  vaultWebUrl,
} from "../src/shared/url";

describe("token format", () => {
  it("accepts cv_pat_ tokens with enough entropy", () => {
    expect(isApiToken(`cv_pat_${"a".repeat(43)}`)).toBe(true);
    expect(isApiToken(`  cv_pat_${"A-_9".repeat(11)}  `)).toBe(true);
  });

  it("rejects wrong prefixes and short values", () => {
    expect(isApiToken("cv_pat_short")).toBe(false);
    expect(isApiToken(`sk_${"a".repeat(43)}`)).toBe(false);
    expect(isApiToken("")).toBe(false);
  });
});

describe("URL helpers", () => {
  it("strips trailing slashes and keeps a deployment sub-path", () => {
    expect(normalizeBaseUrl("http://localhost:3000/")).toBe(
      "http://localhost:3000",
    );
    expect(normalizeBaseUrl("https://example.com/vault///")).toBe(
      "https://example.com/vault",
    );
  });

  it("rejects non-http schemes and garbage", () => {
    expect(() => normalizeBaseUrl("ftp://localhost")).toThrow(/http/i);
    expect(() => normalizeBaseUrl("")).toThrow(/URL/i);
    expect(() => normalizeBaseUrl("localhost:3000")).toThrow(/http/i);
  });

  it("builds dashboard links", () => {
    expect(vaultWebUrl("http://localhost:3000")).toBe(
      "http://localhost:3000/dashboard/snippets",
    );
    expect(settingsWebUrl("http://localhost:3000")).toBe(
      "http://localhost:3000/dashboard/settings",
    );
    expect(snippetWebUrl("http://localhost:3000", "snip_1")).toBe(
      "http://localhost:3000/dashboard/snippets/snip_1",
    );
  });
});
