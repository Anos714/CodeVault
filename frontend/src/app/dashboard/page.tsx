import { headers } from "next/headers";

import { OverviewView } from "@/app/dashboard/overview-view";
import { auth } from "@/server/auth";
import { getRecentSnippets, getVaultStats } from "@/server/queries";
import type { HydratedSnippet } from "@/lib/snippet-types";

/**
 * Server component: stats and recent snippets come from the DAL, the layout
 * above already gated the session — here it is just re-read for the user id
 * and the greeting.
 */
export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [stats, recent]: [
    { total: number; publicCount: number; privateCount: number; totalCopies: number },
    HydratedSnippet[],
  ] = userId
    ? await Promise.all([getVaultStats(userId), getRecentSnippets(userId)])
    : [
        { total: 0, publicCount: 0, privateCount: 0, totalCopies: 0 },
        [],
      ];

  return (
    <OverviewView
      userName={session?.user.name?.split(" ")[0] ?? "developer"}
      total={stats.total}
      publicCount={stats.publicCount}
      privateCount={stats.privateCount}
      totalCopies={stats.totalCopies}
      recent={recent}
    />
  );
}
