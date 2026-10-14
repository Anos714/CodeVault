"use client";

/**
 * Better Auth client for browser code. `signIn`, `signOut` and `useSession`
 * are re-exported so components never import the raw client.
 *
 * `inferAdditionalFields` mirrors the server's extra user fields into the
 * client's session type — `session.user.defaultPrivate` — so the settings
 * page stays type-safe end to end.
 */

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/server/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, updateUser, useSession } = authClient;
