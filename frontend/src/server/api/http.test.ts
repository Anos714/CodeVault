import { describe, expect, it } from "vitest";

import { isAllowedOrigin } from "@/server/api/http";

describe("API CORS origins", () => {
  it("allows browser-extension origins", () => {
    expect(isAllowedOrigin("chrome-extension://abcdefghijklmnop")).toBe(true);
    expect(isAllowedOrigin("moz-extension://abcdefghijklmnop")).toBe(true);
    expect(isAllowedOrigin("vscode-webview://abcdefghijklmnop")).toBe(true);
  });

  it("allows localhost and loopback on any port", () => {
    expect(isAllowedOrigin("http://localhost:3000")).toBe(true);
    expect(isAllowedOrigin("https://localhost:3443")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:8080")).toBe(true);
    expect(isAllowedOrigin("http://[::1]:3000")).toBe(true);
  });

  it("rejects arbitrary websites and malformed origins", () => {
    expect(isAllowedOrigin("https://evil.example")).toBe(false);
    expect(isAllowedOrigin("null")).toBe(false);
    expect(isAllowedOrigin("not a url")).toBe(false);
    expect(isAllowedOrigin("ftp://localhost")).toBe(false);
  });
});
