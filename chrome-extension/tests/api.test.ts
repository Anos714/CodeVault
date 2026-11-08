import { describe, expect, it, vi } from "vitest";

import { CodeVaultApiError, CodeVaultClient } from "../src/shared/api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("CodeVaultClient", () => {
  it("normalizes the base URL and sends the bearer token", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ user: { id: "u1" } }));
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000/",
      token: "cv_pat_test",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const user = await client.me();

    expect(user.id).toBe("u1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:3000/api/v1/me");
    expect(init.method).toBe("GET");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer cv_pat_test",
    );
  });

  it("serializes list filters into the query string", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ snippets: [], total: 0, nextCursor: null }),
    );
    const client = new CodeVaultClient({
      baseUrl: "https://vault.example.com",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.listSnippets({
      q: "lru cache",
      tag: "typescript",
      visibility: "public",
      sort: "favorites",
      limit: 5,
      cursor: "abc",
    });

    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/api/v1/snippets");
    expect(parsed.searchParams.get("q")).toBe("lru cache");
    expect(parsed.searchParams.get("tag")).toBe("typescript");
    expect(parsed.searchParams.get("visibility")).toBe("public");
    expect(parsed.searchParams.get("sort")).toBe("favorites");
    expect(parsed.searchParams.get("limit")).toBe("5");
    expect(parsed.searchParams.get("cursor")).toBe("abc");
  });

  it("posts a create payload as JSON", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ snippet: { id: "snip_1" } }, 201));
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const snippet = await client.createSnippet({
      title: "Cache",
      language: "typescript",
      code: "export {}",
      visibility: "private",
    });

    expect(snippet.id).toBe("snip_1");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:3000/api/v1/snippets");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(String(init.body))).toMatchObject({
      title: "Cache",
      language: "typescript",
      visibility: "private",
    });
  });

  it("maps the API error envelope to CodeVaultApiError", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        { error: { code: "invalid_token", message: "This token is invalid." } },
        401,
      ),
    );
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "bad",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.me()).rejects.toMatchObject({
      name: "CodeVaultApiError",
      status: 401,
      code: "invalid_token",
      message: "This token is invalid.",
    });
    await expect(client.me()).rejects.toBeInstanceOf(CodeVaultApiError);
  });

  it("turns a network failure into a readable error", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.me()).rejects.toMatchObject({
      status: 0,
      code: "network_error",
    });
  });

  it("handles a 204 delete response", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.deleteSnippet("snip_1")).resolves.toBeUndefined();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:3000/api/v1/snippets/snip_1");
    expect(init.method).toBe("DELETE");
  });

  it("rejects a non-http base URL", () => {
    expect(
      () =>
        new CodeVaultClient({
          baseUrl: "ftp://localhost",
          token: "t",
        }),
    ).toThrow(/http/i);
  });

  it("invokes the default fetch with the global receiver", async () => {
    // Chromium 156 throws "Illegal invocation" when native fetch is called as
    // a method, so the client must not store and call it unbound.
    const original = globalThis.fetch;
    const receivers: unknown[] = [];
    globalThis.fetch = function (this: unknown) {
      receivers.push(this);
      return Promise.resolve(jsonResponse({ user: { id: "u1" } }));
    } as typeof fetch;

    try {
      const client = new CodeVaultClient({
        baseUrl: "http://localhost:3000",
        token: "t",
      });
      await expect(client.me()).resolves.toMatchObject({ id: "u1" });
      expect(receivers[0]).toBe(globalThis);
    } finally {
      globalThis.fetch = original;
    }
  });
});
