/**
 * Better Auth's HTTP surface. Every request to /api/auth/* — social
 * sign-in, callbacks, session fetch, sign-out — is served from here.
 */

import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/server/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
