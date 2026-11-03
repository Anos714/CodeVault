import { describe, expect, it } from "vitest";

import { isApiToken } from "../src/token";
import {
  normalizeBaseUrl,
  settingsWebUrl,
  snippetWebUrl,
  vaultWebUrl,
} from "../src/url";

describe("token format", () => {
  it("accepts cv_pat_ tokens", () => {
    expect(isApiToken(`cv_pat_${"a".repeat(43)}`)).toBe(true);
    expect(isApiToken(`  cv_pat_${"a".repeat(43)}  `)).toBe(true);
  });

  it("rejects other shapes", () => {
    expect(isApiToken("cv_pat_short")).toBe(false);
    expect(isApiToken(`ghp_${"a".repeat(43)}`)).toBe(false);
    expect(isApiToken("")).toBe(false);
  });
});

describe("URL helpers", () => {
  it("normalizes URLs and rejects non-http schemes", () => {
    expect(normalizeBaseUrl("http://localhost:3000/")).toBe(
      "http://localhost:3000",
    );
    expect(() => normalizeBaseUrl("file:///tmp/x")).toThrow(/http/i);
    expect(() => normalizeBaseUrl("")).toThrow(/URL/i);
  });

  it("builds web links", () => {
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
