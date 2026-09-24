import type { Language } from "@/lib/languages";

export type Visibility = "private" | "public";

export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  visibility: Visibility;
  /** author id — the seed data uses the demo user */
  authorId: string;
  authorName: string;
  favorites: number;
  copies: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Seed vault for the demo dashboard. The backend API replaces this once the
 * snippet routes land — the types here are the contract those routes return.
 */
export const seedSnippets: Snippet[] = [
  {
    id: "snip_debounce",
    title: "Debounce a function",
    description: "Cancel pending calls on every keystroke — the search-input classic.",
    language: "typescript",
    tags: ["hooks", "performance"],
    code: `export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 24,
    copies: 61,
    createdAt: "2026-08-14T10:12:00.000Z",
    updatedAt: "2026-09-02T14:40:00.000Z",
  },
  {
    id: "snip_throttle",
    title: "Throttle with a trailing call",
    description: "Fire at most once per window, then once more at the tail.",
    language: "typescript",
    tags: ["performance", "scroll"],
    code: `export function throttle(fn: (...args: any[]) => void, ms: number) {
  let last = 0;
  let trailing: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    const now = Date.now();
    const remaining = ms - (now - last);

    if (remaining <= 0) {
      if (trailing) clearTimeout(trailing);
      trailing = null;
      last = now;
      fn(...args);
    } else if (!trailing) {
      trailing = setTimeout(() => {
        last = Date.now();
        trailing = null;
        fn(...args);
      }, remaining);
    }
  };
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 18,
    copies: 33,
    createdAt: "2026-08-16T09:05:00.000Z",
    updatedAt: "2026-08-30T11:20:00.000Z",
  },
  {
    id: "snip_fetch_retry",
    title: "Fetch with exponential backoff",
    description: "Retry transient failures, doubling the wait each round.",
    language: "typescript",
    tags: ["fetch", "resilience"],
    code: `export async function fetchRetry(
  input: string,
  { retries = 3, base = 400 }: { retries?: number; base?: number } = {},
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(input);
      if (res.ok || attempt >= retries) return res;
      throw new Error(\`HTTP \${res.status}\`);
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, base * 2 ** attempt));
    }
  }
}`,
    visibility: "private",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 9,
    copies: 14,
    createdAt: "2026-08-22T16:30:00.000Z",
    updatedAt: "2026-09-10T08:15:00.000Z",
  },
  {
    id: "snip_deep_equal",
    title: "Structural deep equality",
    description: "Compare objects by value instead of reference.",
    language: "javascript",
    tags: ["utils", "objects"],
    code: `export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => deepEqual(a[key], b[key]));
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 31,
    copies: 47,
    createdAt: "2026-08-25T12:00:00.000Z",
    updatedAt: "2026-09-14T19:05:00.000Z",
  },
  {
    id: "snip_group_by",
    title: "Group an array by a key",
    description: "Bucket rows into an object keyed by the mapper.",
    language: "javascript",
    tags: ["utils", "arrays"],
    code: `export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}`,
    visibility: "private",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 6,
    copies: 11,
    createdAt: "2026-08-29T18:45:00.000Z",
    updatedAt: "2026-09-18T10:10:00.000Z",
  },
  {
    id: "snip_lru",
    title: "Tiny LRU cache",
    description: "Bounded Map that evicts the least-recently-used entry.",
    language: "typescript",
    tags: ["cache", "data-structures"],
    code: `export class LRU<K, V> {
  private map = new Map<K, V>();

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value === undefined) return undefined;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value as K);
    }
    this.map.set(key, value);
  }
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 42,
    copies: 88,
    createdAt: "2026-09-01T08:20:00.000Z",
    updatedAt: "2026-09-20T15:35:00.000Z",
  },
  {
    id: "snip_formdata",
    title: "FormData to plain object",
    description: "Hand off a form to fetch without serialising by hand.",
    language: "typescript",
    tags: ["forms", "fetch"],
    code: `export function formToObject(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(new FormData(form).entries());
}`,
    visibility: "private",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 4,
    copies: 7,
    createdAt: "2026-09-05T14:10:00.000Z",
    updatedAt: "2026-09-05T14:10:00.000Z",
  },
  {
    id: "snip_css_grid_center",
    title: "Center anything with grid",
    description: "The one-liner that killed a dozen flex hacks.",
    language: "css",
    tags: ["layout", "css"],
    code: `.center {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 15,
    copies: 29,
    createdAt: "2026-09-08T11:30:00.000Z",
    updatedAt: "2026-09-08T11:30:00.000Z",
  },
  {
    id: "snip_env_check",
    title: "Read env without crashing",
    description: "Fail loudly at boot when a required variable is missing.",
    language: "typescript",
    tags: ["config", "node"],
    code: `export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(\`Missing required env var: \${key}\`);
  return value;
}`,
    visibility: "private",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 12,
    copies: 22,
    createdAt: "2026-09-11T09:45:00.000Z",
    updatedAt: "2026-09-19T13:00:00.000Z",
  },
  {
    id: "snip_regex_email",
    title: "Pragmatic email regex",
    description: "Loose on purpose — validate shape, not deliverability.",
    language: "javascript",
    tags: ["regex", "validation"],
    code: `export const isProbablyEmail = (value: string): boolean =>
  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 21,
    copies: 54,
    createdAt: "2026-09-15T10:05:00.000Z",
    updatedAt: "2026-09-15T10:05:00.000Z",
  },
  {
    id: "snip_py_read_csv",
    title: "Stream a CSV with pandas",
    description: "Chunked iteration so a large file never blows up memory.",
    language: "python",
    tags: ["pandas", "data"],
    code: `import pandas as pd


def read_csv_in_chunks(path: str, size: int = 10_000):
    for chunk in pd.read_csv(path, chunksize=size):
        yield chunk`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 27,
    copies: 40,
    createdAt: "2026-09-17T16:20:00.000Z",
    updatedAt: "2026-09-17T16:20:00.000Z",
  },
  {
    id: "snip_go_graceful",
    title: "Graceful shutdown in Go",
    description: "Let in-flight requests finish before the process exits.",
    language: "go",
    tags: ["go", "server"],
    code: `package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	srv := &http.Server{Addr: ":8080"}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server shutdown: %s", err)
	}
}`,
    visibility: "public",
    authorId: "user_demo",
    authorName: "Rahul Sain",
    favorites: 35,
    copies: 52,
    createdAt: "2026-09-19T09:00:00.000Z",
    updatedAt: "2026-09-19T09:00:00.000Z",
  },
];
