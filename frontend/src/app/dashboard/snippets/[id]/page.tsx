import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailView } from "@/app/dashboard/snippets/[id]/detail-view";
import { auth } from "@/server/auth";
import { getSnippetById } from "@/server/queries";

/**
 * Server component: the snippet (plus the viewer's star and, for the owner,
 * its share links) comes from the DAL. Missing or invisible ids render the
 * same not-found card the client version showed.
 */
export default async function SnippetDetailPage({
  params,
}: PageProps<"/dashboard/snippets/[id]">) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const snippet = await getSnippetById(id, session?.user.id ?? null);

  if (!snippet) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/dashboard/snippets"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to snippets
        </Link>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-20 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Snippet not found
            </h2>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              It may have been deleted, or the link points to a snippet outside
              your vault.
            </p>
          </div>
          <Button
            className="h-9 rounded-full px-5"
            render={<Link href="/dashboard/snippets" />}
          >
            Browse your vault
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = snippet.authorId === session?.user.id;

  return <DetailView snippet={snippet} isOwner={isOwner} />;
}
