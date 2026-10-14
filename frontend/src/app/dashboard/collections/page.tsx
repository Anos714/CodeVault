import { headers } from "next/headers";

import { CollectionsView } from "@/app/dashboard/collections/collections-view";
import { auth } from "@/server/auth";
import { listCollections } from "@/server/queries";
import type { Collection } from "@/lib/snippet-types";

/** Server component: the owner's folders with member counts. */
export default async function CollectionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const collections: Collection[] = userId
    ? await listCollections(userId)
    : [];

  return <CollectionsView collections={collections} />;
}
