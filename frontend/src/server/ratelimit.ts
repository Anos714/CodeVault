/**
 * Sliding-window rate limits over Upstash Redis (REST — works in routes,
 * actions and the proxy alike).
 *
 * - `demo` — demo sign-ins per IP (30/min; the E2E suite signs in ~10×).
 * - `share-read` — unlisted reads (/s, /embed, /c, OG) per IP (100/min).
 * - `write` — mutations per user id (60/min).
 *
 * Redis is a protection layer, never a dependency: unconfigured credentials
 * or a Redis outage both fail OPEN (allowed), exactly like the app boots
 * without OAuth secrets. Nothing here may throw for infrastructure reasons —
 * only callers turn a denial into a 429/throw.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type LimitKind = "demo" | "share-read" | "write";

type Window = `${number} ${"ms" | "s" | "m" | "h" | "d" | "w"}`;

const WINDOWS: Record<LimitKind, [number, Window]> = {
  demo: [30, "1 m"],
  "share-read": [100, "1 m"],
  write: [60, "1 m"],
};

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

export function isRateLimitingEnabled(): boolean {
  return getRedis() !== null;
}

const limiters = new Map<LimitKind, Ratelimit>();

function getLimiter(kind: LimitKind): Ratelimit | null {
  const db = getRedis();
  if (!db) return null;
  let limiter = limiters.get(kind);
  if (!limiter) {
    const [max, window] = WINDOWS[kind];
    limiter = new Ratelimit({
      redis: db,
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `codevault:${kind}`,
    });
    limiters.set(kind, limiter);
  }
  return limiter;
}

export async function checkLimit(
  kind: LimitKind,
  id: string,
): Promise<{ ok: boolean; reset: number }> {
  const limiter = getLimiter(kind);
  if (!limiter) return { ok: true, reset: 0 };
  try {
    const { success, reset } = await limiter.limit(`${kind}:${id}`);
    return { ok: success, reset };
  } catch {
    // Redis unreachable — allow the request (fail open, documented above)
    return { ok: true, reset: 0 };
  }
}

/** First public IP, suitable as a limiter identity (never as auth). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || headers.get("x-real-ip") || "127.0.0.1";
}
