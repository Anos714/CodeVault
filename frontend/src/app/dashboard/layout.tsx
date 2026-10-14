import { headers } from "next/headers";

import { Topbar } from "@/components/dashboard/topbar";
import { SignInGate } from "@/components/dashboard/sign-in-gate";
import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/server/auth";

/**
 * Server-side gate: no session, no shell. The Proxy redirects most
 * unauthenticated traffic before it gets here — this is the check that
 * actually validates the cookie against the database.
 */
export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <SignInGate />;

  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar variant="rail" user={session.user} />
      <Sidebar variant="drawer" user={session.user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
