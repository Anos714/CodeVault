import { headers } from "next/headers";

import { ExploreView } from "@/app/dashboard/explore/explore-view";
import { auth } from "@/server/auth";
import { exploreSnippets } from "@/server/queries";
import type { HydratedSnippet } from "@/lib/snippet-types";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string; starred?: string }>;
};

/**
 * Server component: the public feed is filtered in SQL (title, description,
 * language, tag, author) with favorites-first ordering.
 */
export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const params = await searchParams;
  const q = params.q ?? "";
  const starredOnly = params.starred === "1";

  const snippets: HydratedSnippet[] = await exploreSnippets({
    viewerId: session?.user.id ?? null,
    q,
    starredOnly,
  });

  return <ExploreView snippets={snippets} q={q} starredOnly={starredOnly} />;
}
