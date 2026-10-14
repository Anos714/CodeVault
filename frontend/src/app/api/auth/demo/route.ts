/**
 * "Continue with a demo account" — one POST, no form.
 *
 * Signs the caller in as the seeded demo user (see scripts/seed.ts) using the
 * password from DEMO_EMAIL/DEMO_PASSWORD. The auth handler returns a Response
 * whose Set-Cookie header we forward untouched, so the session lands in the
 * same httpOnly cookie a normal sign-in uses. The client just refreshes.
 */

import { headers } from "next/headers";

import { auth } from "@/server/auth";

export async function POST() {
  const email = process.env.DEMO_EMAIL ?? "demo@codevault.dev";
  const password = process.env.DEMO_PASSWORD ?? "codevault-demo";

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
      asResponse: true,
    });
    return response;
  } catch {
    return new Response(
      "Demo sign-in failed — run `bun run db:seed` to provision the demo account.",
      { status: 401 },
    );
  }
}
