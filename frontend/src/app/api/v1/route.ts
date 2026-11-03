/**
 * `GET /api/v1` — discovery document.
 *
 * Public on purpose: the extensions can point at a base URL and verify it is
 * CodeVault before asking for a token. No data is exposed here.
 */

import { apiJson, preflight } from "@/server/api/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export function GET(request: Request) {
  return apiJson(request, {
    name: "CodeVault API",
    version: "v1",
    auth: "Authorization: Bearer cv_pat_…",
    endpoints: {
      me: "GET /api/v1/me",
      snippets: "GET|POST /api/v1/snippets",
      snippet: "GET|PATCH|DELETE /api/v1/snippets/:id",
      tokens: "GET|POST /api/v1/tokens (cookie session)",
      token: "DELETE /api/v1/tokens/:id (cookie session)",
    },
  });
}
