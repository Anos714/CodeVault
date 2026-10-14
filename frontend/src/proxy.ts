/**
 * Next 16 Proxy (formerly Middleware) — the optimistic auth gate, plus
 * cheap abuse protection on the public read surfaces.
 *
 * Auth: checks only for the *presence* of the session cookie. It is not
 * authorization: an expired or tampered cookie still gets through here and is
 * rejected later by `auth.api.getSession` in the layout, or by the server
 * actions touching data. Keeping the check cheap is the point — Proxy runs on
 * every navigation, including prefetches.
 *
 * Rate limits: /s, /embed and /c URLs are unguessable but enumerable-by-share
 * (anyone holding a link can hammer it). They get a per-IP sliding window
 * here — before any database work — and a 429 when it trips. Redis missing
 * or down fails open (allowed); see src/server/ratelimit.ts.
 */

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { checkLimit, clientIp } from "@/server/ratelimit";

const PROTECTED_PREFIX = "/dashboard";
const SIGN_IN_PATH = "/auth";

/** Public read surfaces worth throttling, with their link prefix. */
const THROTTLED_PREFIXES = ["/s/", "/embed/", "/c/"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (THROTTLED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const { ok } = await checkLimit("share-read", clientIp(request.headers));
    if (!ok) {
      return new NextResponse("Too many requests — try again in a minute.", {
        status: 429,
      });
    }
  }

  const isProtected =
    pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);

  if (isProtected && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
  }

  return NextResponse.next();
}

// run on every page route, skipping the auth API, static assets and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg|webp|jpg|jpeg|gif)$).*)"],
};
