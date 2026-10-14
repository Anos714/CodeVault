import { headers } from "next/headers";

import { SnippetsView, type SnippetFilters } from "@/app/dashboard/snippets/snippets-view";
import { auth } from "@/server/auth";
import { getTagCounts, listOwnSnippets } from "@/server/queries";
import type { VaultFilters } from "@/server/queries";
import type { HydratedSnippet } from "@/lib/snippet-types";

type SnippetsPageProps = {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    visibility?: string;
    sort?: string;
  }>;
};

function parseFilters(params: Awaited<SnippetsPageProps["searchParams"]>): {
  view: SnippetFilters;
  query: VaultFilters;
} {
  const visibility =
    params.visibility === "private" || params.visibility === "public"
      ? params.visibility
      : "all";
  const sort =
    params.sort === "created" ||
    params.sort === "copies" ||
    params.sort === "favorites"
      ? params.sort
      : "updated";
  const view: SnippetFilters = {
    q: params.q ?? "",
    tag: params.tag ?? "",
    visibility,
    sort,
  };
  return { view, query: view };
}

/**
 * Server component: the URL is the source of truth for every filter, so a
 * filtered vault survives refresh and shares. Filter changes navigate
 * (scroll:false) and the DAL re-queries — no client-side copy of the vault.
 */
export default async function SnippetsPage({ searchParams }: SnippetsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { view, query } = parseFilters(await searchParams);

  const [{ snippets, total }, tagCounts]: [
    { snippets: HydratedSnippet[]; total: number },
    Array<[string, number]>,
  ] = userId
    ? await Promise.all([
        listOwnSnippets(userId, query),
        getTagCounts(userId),
      ])
    : [{ snippets: [], total: 0 }, []];

  return (
    <SnippetsView
      snippets={snippets}
      tags={tagCounts.map(([tag]) => tag)}
      total={total}
      filters={view}
    />
  );
}
