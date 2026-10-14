/**
 * Better Auth instance — the auth spine of CodeVault.
 *
 * - Google and GitHub sign-in, configured lazily from env so the app still
 *   boots without OAuth credentials (the provider is simply skipped and the
 *   demo account keeps working).
 * - Email/password is enabled *only* for the seeded demo account; public
 *   sign-up over that flow is turned off.
 * - Sessions live in Postgres through the Drizzle adapter; the `user` row
 *   carries `defaultPrivate` as an additional field backing the settings
 *   toggle.
 *
 * Import this only from server code (server components, route handlers,
 * server actions). The client side talks to `@/lib/auth-client`.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";
import {
  account,
  session,
  user,
  verification,
} from "./db/schema";

/**
 * A social provider is only registered when its credentials are fully
 * configured — without env values the entry is simply absent, so the app
 * boots with whatever OAuth providers are available.
 */
function socialProviders() {
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  const githubId = process.env.GITHUB_CLIENT_ID;
  const githubSecret = process.env.GITHUB_CLIENT_SECRET;

  return {
    ...(googleId &&
      googleSecret && {
        google: { clientId: googleId, clientSecret: googleSecret },
      }),
    ...(githubId &&
      githubSecret && {
        github: { clientId: githubId, clientSecret: githubSecret },
      }),
  };
}

export const auth = betterAuth({
  appName: "CodeVault",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    // the password flow exists only for the seeded demo account —
    // scripts/seed.ts provisions it, and nobody else can register this way
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      /** backs the "New snippets default to private" toggle in settings */
      defaultPrivate: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  socialProviders: socialProviders(),
});

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
