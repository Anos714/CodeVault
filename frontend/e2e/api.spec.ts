import type { Page } from "@playwright/test";

import { test, expect, signInDemo, uniqueTitle } from "./helpers";

/**
 * `/api/v1` against the real server + database.
 *
 * Tokens are minted through the cookie-session route (exactly what the
 * settings page uses), then every snippet call goes through the Bearer path
 * the Chrome/VS Code extensions use. Each test revokes its token and deletes
 * its snippets, so re-runs start clean.
 */

type MintedToken = {
  raw: string;
  token: { id: string; name: string; prefix: string };
};

async function mintToken(page: Page): Promise<MintedToken> {
  const response = await page.request.post("/api/v1/tokens", {
    data: { name: uniqueTitle("api") },
  });
  expect(response.status()).toBe(201);
  const body = (await response.json()) as MintedToken;
  expect(body.raw).toMatch(/^cv_pat_[A-Za-z0-9_-]{32,}$/);
  expect(body.token.prefix).toBe(body.raw.slice(0, 13));
  return body;
}

test.describe("REST API v1", () => {
  test("PAT lifecycle and snippet CRUD", async ({ page, request }) => {
    await signInDemo(page);
    const minted = await mintToken(page);
    const headers = { Authorization: `Bearer ${minted.raw}` };

    try {
      // the token identifies the signed-in account
      const me = await request.get("/api/v1/me", { headers });
      expect(me.status()).toBe(200);
      const meBody = await me.json();
      const session = await page.request.get("/api/auth/get-session");
      const sessionBody = await session.json();
      expect(meBody.user.id).toBe(sessionBody.user.id);
      expect(meBody.user.email).toBe(sessionBody.user.email);
      expect(meBody.user).not.toHaveProperty("password");

      // list is scoped to this vault and paginated
      const list = await request.get("/api/v1/snippets?limit=5", { headers });
      expect(list.status()).toBe(200);
      const listBody = await list.json();
      expect(Array.isArray(listBody.snippets)).toBe(true);
      expect(listBody.snippets.length).toBeLessThanOrEqual(5);
      expect(listBody.total).toBeGreaterThan(0);

      // create
      const title = uniqueTitle("api snippet");
      const created = await request.post("/api/v1/snippets", {
        headers,
        data: {
          title,
          description: "created through the REST API",
          language: "typescript",
          tags: ["api", "E2E"],
          code: "export const fromApi = true;",
          visibility: "private",
        },
      });
      expect(created.status()).toBe(201);
      const createdBody = await created.json();
      const id = createdBody.snippet.id as string;
      expect(id).toMatch(/^snip_/);
      expect(createdBody.snippet.title).toBe(title);
      expect(createdBody.snippet.tags).toEqual(["api", "e2e"]);

      // read
      const read = await request.get(`/api/v1/snippets/${id}`, { headers });
      expect(read.status()).toBe(200);
      const readBody = await read.json();
      expect(readBody.snippet.code).toBe("export const fromApi = true;");
      expect(readBody.snippet.starred).toBe(false);

      // search finds it
      const search = await request.get(
        `/api/v1/snippets?q=${encodeURIComponent(title)}`,
        { headers },
      );
      expect(search.status()).toBe(200);
      const searchBody = await search.json();
      expect(
        searchBody.snippets.some((snippet: { id: string }) => snippet.id === id),
      ).toBe(true);

      // update — tags replace the whole set, visibility flips
      const patched = await request.patch(`/api/v1/snippets/${id}`, {
        headers,
        data: { title: `${title} v2`, tags: ["updated"], visibility: "public" },
      });
      expect(patched.status()).toBe(200);
      const patchedBody = await patched.json();
      expect(patchedBody.snippet.title).toBe(`${title} v2`);
      expect(patchedBody.snippet.tags).toEqual(["updated"]);
      expect(patchedBody.snippet.visibility).toBe("public");

      // delete
      const deleted = await request.delete(`/api/v1/snippets/${id}`, {
        headers,
      });
      expect(deleted.status()).toBe(200);
      expect(await deleted.json()).toEqual({ ok: true, id });

      const gone = await request.get(`/api/v1/snippets/${id}`, { headers });
      expect(gone.status()).toBe(404);
      expect((await gone.json()).error.code).toBe("not_found");

      // token listing never exposes the secret
      const tokens = await page.request.get("/api/v1/tokens");
      expect(tokens.status()).toBe(200);
      const tokensBody = await tokens.json();
      const listed = tokensBody.tokens.find(
        (token: { id: string }) => token.id === minted.token.id,
      );
      expect(listed).toBeTruthy();
      expect(listed).not.toHaveProperty("raw");
      expect(listed).not.toHaveProperty("tokenHash");
      expect(listed.prefix).toBe(minted.token.prefix);
    } finally {
      await page.request.delete(`/api/v1/tokens/${minted.token.id}`);
    }

    // revocation is immediate
    const afterRevoke = await request.get("/api/v1/me", { headers });
    expect(afterRevoke.status()).toBe(401);
    expect((await afterRevoke.json()).error.code).toBe("invalid_token");
  });

  test("auth errors, validation, and CORS preflight", async ({
    page,
    request,
  }) => {
    await signInDemo(page);
    const minted = await mintToken(page);
    const headers = { Authorization: `Bearer ${minted.raw}` };

    try {
      // no header
      const missing = await request.get("/api/v1/me");
      expect(missing.status()).toBe(401);
      expect((await missing.json()).error.code).toBe("unauthorized");

      // wrong scheme / malformed
      const malformed = await request.get("/api/v1/me", {
        headers: { Authorization: "Basic abc" },
      });
      expect(malformed.status()).toBe(401);

      // well-formed but unknown token
      const unknown = await request.get("/api/v1/me", {
        headers: { Authorization: `Bearer cv_pat_${"a".repeat(43)}` },
      });
      expect(unknown.status()).toBe(401);
      expect((await unknown.json()).error.code).toBe("invalid_token");

      // invalid language is a validation error with a field path
      const invalid = await request.post("/api/v1/snippets", {
        headers,
        data: {
          title: "bad language",
          language: "cobol",
          code: "DISPLAY 'HI'.",
        },
      });
      expect(invalid.status()).toBe(400);
      const invalidBody = await invalid.json();
      expect(invalidBody.error.code).toBe("validation_error");
      expect(
        invalidBody.error.details.some(
          (detail: { path: string }) => detail.path === "language",
        ),
      ).toBe(true);

      // unknown id on PATCH is a uniform 404
      const missingSnippet = await request.patch(
        "/api/v1/snippets/snip_does_not_exist",
        { headers, data: { title: "nope" } },
      );
      expect(missingSnippet.status()).toBe(404);

      // malformed JSON is a 400, not a 500
      const badJson = await request.post("/api/v1/snippets", {
        headers: { ...headers, "Content-Type": "application/json" },
        data: Buffer.from("{not json", "utf8"),
      });
      expect(badJson.status()).toBe(400);
      expect((await badJson.json()).error.code).toBe("invalid_json");

      // discovery is public
      const discovery = await request.get("/api/v1");
      expect(discovery.status()).toBe(200);
      expect((await discovery.json()).version).toBe("v1");

      // extension preflight is allowed and echoes the origin
      const preflight = await request.fetch("/api/v1/snippets", {
        method: "OPTIONS",
        headers: {
          Origin: "chrome-extension://abcdefghijklmnop",
          "Access-Control-Request-Method": "POST",
        },
      });
      expect(preflight.status()).toBe(204);
      expect(
        preflight.headers()["access-control-allow-origin"],
      ).toBe("chrome-extension://abcdefghijklmnop");
      expect(preflight.headers()["access-control-allow-headers"]).toContain(
        "Authorization",
      );

      // arbitrary websites are not granted CORS
      const blocked = await request.fetch("/api/v1/snippets", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example" },
      });
      expect(blocked.status()).toBe(204);
      expect(blocked.headers()["access-control-allow-origin"]).toBeUndefined();
    } finally {
      await page.request.delete(`/api/v1/tokens/${minted.token.id}`);
    }
  });

  test("token management requires a signed-in session", async ({
    request,
  }) => {
    const list = await request.get("/api/v1/tokens");
    expect(list.status()).toBe(401);
    expect((await list.json()).error.code).toBe("unauthorized");

    const create = await request.post("/api/v1/tokens", {
      data: { name: "anonymous" },
    });
    expect(create.status()).toBe(401);
  });
});
