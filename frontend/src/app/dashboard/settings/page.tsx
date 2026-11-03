import { headers } from "next/headers";

import { SettingsView } from "@/app/dashboard/settings/settings-view";
import { auth } from "@/server/auth";
import { listTokensForUser } from "@/server/api/tokens";
import { getVaultStats } from "@/server/queries";

/**
 * Server component: identity comes from the session, the snippet count and
 * API tokens from the DAL — the form itself stays interactive in the client
 * view.
 */
export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [{ total }, tokens] = await Promise.all([
    userId ? getVaultStats(userId) : Promise.resolve({ total: 0 }),
    userId ? listTokensForUser(userId) : Promise.resolve([]),
  ]);

  return (
    <SettingsView
      name={session?.user.name ?? "developer"}
      email={session?.user.email ?? ""}
      image={session?.user.image ?? null}
      defaultPrivate={session?.user.defaultPrivate ?? true}
      snippetCount={total}
      initialTokens={tokens}
    />
  );
}
