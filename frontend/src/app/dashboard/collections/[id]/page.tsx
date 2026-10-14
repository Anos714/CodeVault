import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionDetailView } from "@/app/dashboard/collections/[id]/collection-detail-view";
import { auth } from "@/server/auth";
import { getCollectionById, listOwnSnippets } from "@/server/queries";

/**
 * Server component: the folder (members + links) plus add-candidates, owner
 * only — anyone else gets the same not-found card as a deleted snippet.
 */
export default async function CollectionDetailPage({
  params,
}: PageProps<"/dashboard/collections/[id]">) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;

  const collection = await getCollectionById(id, userId);

  if (!collection) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/dashboard/collections"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to collections
        </Link>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-20 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Collection not found
            </h2>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              It may have been deleted, or it belongs to someone else.
            </p>
          </div>
          <Button
            className="h-9 rounded-full px-5"
            render={<Link href="/dashboard/collections" />}
          >
            Browse collections
          </Button>
        </div>
      </div>
    );
  }

  const memberIds = new Set((collection.snippets ?? []).map((s) => s.id));
  const { snippets } = userId
    ? await listOwnSnippets(userId, {}, { limit: 50 })
    : { snippets: [] };

  return (
    <CollectionDetailView
      collection={collection}
      candidates={snippets
        .filter((s) => !memberIds.has(s.id))
        .map((s) => ({ id: s.id, title: s.title }))}
    />
  );
}
