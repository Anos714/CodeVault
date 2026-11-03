/**
 * Shared HTTP plumbing for `/api/v1`.
 *
 * Every response — success, validation failure, 401, preflight — goes through
 * `apiJson`/`preflight` so CORS headers and the error envelope stay
 * consistent. Errors are always:
 *
 *   { "error": { "code": "unauthorized", "message": "…", "details"?: … } }
 *
 * CORS is deliberately narrow: browser extensions (`chrome-extension://`,
 * `moz-extension://`), the VS Code webview, localhost dev servers, and the
 * configured app origin. The VS Code extension talks over Node `fetch`, which
 * sends no Origin and needs no CORS at all.
 */

import { ZodError } from "zod";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function appOrigin(): string | null {
  const raw = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(origin: string): boolean {
  if (
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("moz-extension://") ||
    origin.startsWith("safari-web-extension://") ||
    origin.startsWith("vscode-webview://") ||
    origin.startsWith("vscode-file://")
  ) {
    return true;
  }

  if (appOrigin() === origin) return true;

  try {
    const url = new URL(origin);
    const local =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1" ||
      url.hostname === "[::1]";
    return local && (url.protocol === "http:" || url.protocol === "https:");
  } catch {
    return false;
  }
}

export function corsHeaders(request: Request): Headers {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = request.headers.get("origin");
  if (origin) {
    // Always vary on Origin, even when the origin is rejected: a shared cache
    // must never serve an allowed response to a different origin.
    headers.set("Vary", "Origin");
  }
  if (origin && isAllowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, Accept",
    );
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export function apiJson(
  request: Request,
  body: unknown,
  init: { status?: number; headers?: HeadersInit } = {},
): Response {
  const headers = corsHeaders(request);
  headers.set("Content-Type", "application/json; charset=utf-8");
  if (init.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers,
  });
}

export function errorResponse(request: Request, error: unknown): Response {
  if (error instanceof ApiError) {
    return apiJson(
      request,
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return apiJson(
      request,
      {
        error: {
          code: "validation_error",
          message: "Request validation failed.",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  console.error("[api/v1]", error);
  return apiJson(
    request,
    {
      error: {
        code: "internal_error",
        message: "Something went wrong on the server.",
      },
    },
    { status: 500 },
  );
}

/** Parse a JSON body with a 1 MB guard, mapping malformed input to 400. */
export async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > 1_000_000) {
    throw new ApiError(413, "payload_too_large", "Request body is too large.");
  }
  try {
    return await request.json();
  } catch {
    throw new ApiError(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }
}

/** Map a Drizzle/Postgres failure to a safe 500 without leaking SQL. */
export function internalError(): never {
  throw new ApiError(500, "internal_error", "Something went wrong on the server.");
}
