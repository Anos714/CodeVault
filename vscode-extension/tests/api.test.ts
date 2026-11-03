import { describe, expect, it, vi } from "vitest";

import { CodeVaultApiError, CodeVaultClient } from "../src/api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function firstCall(fetchMock: ReturnType<typeof vi.fn>): [string, RequestInit] {
  return fetchMock.mock.calls[0] as unknown as [string, RequestInit];
}

describe("CodeVaultClient (VS Code)", () => {
  it("sends the bearer token to /api/v1/me", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ user: { id: "u1" } }));
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000/",
      token: "cv_pat_test",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const user = await client.me();
    expect(user.id).toBe("u1");

    const [url, init] = firstCall(fetchMock);
    expect(url).toBe("http://localhost:3000/api/v1/me");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer cv_pat_test",
    );
  });

  it("encodes list filters", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ snippets: [], total: 0, nextCursor: null }),
    );
    const client = new CodeVaultClient({
      baseUrl: "https://vault.example.com",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.listSnippets({ q: "debounce hook", limit: 25, sort: "updated" });
    const [url] = firstCall(fetchMock);
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/api/v1/snippets");
    expect(parsed.searchParams.get("q")).toBe("debounce hook");
    expect(parsed.searchParams.get("limit")).toBe("25");
    expect(parsed.searchParams.get("sort")).toBe("updated");
  });

  it("creates and updates snippets with JSON bodies", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ snippet: { id: "snip_1" } }, 201))
      .mockResolvedValueOnce(jsonResponse({ snippet: { id: "snip_1" } }));

    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.createSnippet({
      title: "LRU",
      language: "typescript",
      code: "export {}",
      visibility: "private",
    });
    await client.updateSnippet("snip_1", { visibility: "public" });

    const [createUrl, createInit] = firstCall(fetchMock);
    expect(createUrl).toBe("http://localhost:3000/api/v1/snippets");
    expect(createInit.method).toBe("POST");
    expect(JSON.parse(String(createInit.body))).toMatchObject({
      title: "LRU",
      language: "typescript",
    });

    const second = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
    expect(second[0]).toBe("http://localhost:3000/api/v1/snippets/snip_1");
    expect(second[1].method).toBe("PATCH");
  });

  it("maps the server error envelope", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        { error: { code: "not_found", message: "Snippet not found." } },
        404,
      ),
    );
    const client = new CodeVaultClient({
      baseUrl: "http://localhost:3000",
      token: "t",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.getSnippet("snip_x")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
      message: "Snippet not found.",
    });
    await expect(client.getSnippet("snip_x")).rejects.toBeInstanceOf(
      CodeVaultApiError,
    );
  });

  it("reports an unreachable server as network_error", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("connect ECONNREFUSED");
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
});
