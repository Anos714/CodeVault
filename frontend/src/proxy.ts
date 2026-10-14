/**
 * Next 16 Proxy (formerly Middleware) — the optimistic auth gate.
 *
 * This checks only for the *presence* of the session cookie. It is not
 * authorization: an expired or tampered cookie still gets through here and is
 * rejected later by `auth.api.getSession` in the layout, or by the server
 * actions touching data. Keeping the check cheap is the point — Proxy runs on
 * every navigation, including prefetches.
 */

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";
const SIGN_IN_PATH = "/auth";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
