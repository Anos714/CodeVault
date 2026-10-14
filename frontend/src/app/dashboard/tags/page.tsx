import { headers } from "next/headers";

import { TagsView } from "@/app/dashboard/tags/tags-view";
import { auth } from "@/server/auth";
import { getLanguageCounts, getTagCounts } from "@/server/queries";

/** Server component: tag cloud and language grid come straight from the DAL. */
export default async function TagsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [tags, languages]: [Array<[string, number]>, Array<[string, number]>] =
    userId
      ? await Promise.all([getTagCounts(userId), getLanguageCounts(userId)])
      : [[], []];

  return <TagsView tags={tags} languages={languages} />;
}
