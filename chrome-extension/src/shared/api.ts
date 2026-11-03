/**
 * Typed client for CodeVault's `/api/v1`.
 *
 * The extension talks to the same REST API as the VS Code extension: a
 * personal access token in `Authorization: Bearer cv_pat_…`. Errors are
 * normalized to `CodeVaultApiError` so every surface can show the server's
 * message instead of `[object Object]`.
 */

import type {
  CreateSnippetInput,
  Snippet,
  SnippetList,
  UpdateSnippetInput,
  User,
} from "./types";
import { normalizeBaseUrl } from "./url";

export class CodeVaultApiError extends Error {
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
    this.name = "CodeVaultApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type ListSnippetsOptions = {
  q?: string;
  tag?: string;
  visibility?: "all" | "private" | "public";
  sort?: "updated" | "created" | "copies" | "favorites";
  limit?: number;
  cursor?: string | null;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export class CodeVaultClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: {
    baseUrl: string;
    token: string;
    fetchImpl?: typeof fetch;
  }) {
    this.baseUrl = normalizeBaseUrl(opts.baseUrl);
    this.token = opts.token;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: opts.method ?? "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/json",
          ...(opts.body === undefined
            ? {}
            : { "Content-Type": "application/json" }),
        },
        ...(opts.body === undefined
          ? {}
          : { body: JSON.stringify(opts.body) }),
      });
    } catch {
      throw new CodeVaultApiError(
        0,
        "network_error",
        `Could not reach ${this.baseUrl}. Check the URL and that the app is running.`,
      );
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const envelope = payload as
        | { error?: { code?: string; message?: string; details?: unknown } }
        | null;
      throw new CodeVaultApiError(
        response.status,
        envelope?.error?.code ?? "http_error",
        envelope?.error?.message ?? `Request failed with HTTP ${response.status}.`,
        envelope?.error?.details,
      );
    }

    return payload as T;
  }

  async me(): Promise<User> {
    const { user } = await this.request<{ user: User }>("/api/v1/me");
    return user;
  }

  async listSnippets(opts: ListSnippetsOptions = {}): Promise<SnippetList> {
    const params = new URLSearchParams();
    if (opts.q) params.set("q", opts.q);
    if (opts.tag) params.set("tag", opts.tag);
    if (opts.visibility) params.set("visibility", opts.visibility);
    if (opts.sort) params.set("sort", opts.sort);
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.cursor) params.set("cursor", opts.cursor);
    const query = params.toString();
    return this.request<SnippetList>(
      `/api/v1/snippets${query ? `?${query}` : ""}`,
    );
  }

  async getSnippet(id: string): Promise<Snippet> {
    const { snippet } = await this.request<{ snippet: Snippet }>(
      `/api/v1/snippets/${encodeURIComponent(id)}`,
    );
    return snippet;
  }

  async createSnippet(input: CreateSnippetInput): Promise<Snippet> {
    const { snippet } = await this.request<{ snippet: Snippet }>(
      "/api/v1/snippets",
      { method: "POST", body: input },
    );
    return snippet;
  }

  async updateSnippet(id: string, input: UpdateSnippetInput): Promise<Snippet> {
    const { snippet } = await this.request<{ snippet: Snippet }>(
      `/api/v1/snippets/${encodeURIComponent(id)}`,
      { method: "PATCH", body: input },
    );
    return snippet;
  }

  async deleteSnippet(id: string): Promise<void> {
    await this.request<{ ok: true; id: string }>(
      `/api/v1/snippets/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  }
}
