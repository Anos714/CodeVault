import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Folder, Link2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SnippetCard } from "@/components/dashboard/snippet-card";
import { expiryLabel } from "@/lib/share";
import { resolveCollectionToken } from "@/server/queries";

export const metadata: Metadata = {
  title: "Shared collection",
  description: "A CodeVault collection shared with you.",
};

type CollectionSharePageProps = {
  params: Promise<{ token: string }>;
};

/**
 * Public folder view behind an unlisted link — no session required, the
 * token authorizes the full member list including private snippets.
 */
export default async function CollectionSharePage({
  params,
}: CollectionSharePageProps) {
  const { token } = await params;
  const resolved = await resolveCollectionToken(token, null);

  if (!resolved) notFound();

  const { collection, link } = resolved;

  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-40" />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-16 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground">
            <Link2 className="size-3" />
            unlisted folder · {expiryLabel(link)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="flex items-center gap-3 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <Folder className="size-7 shrink-0 text-primary" strokeWidth={1.75} />
            {collection.name}
          </h1>
          {collection.description && (
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {collection.description}
            </p>
          )}
          <p className="font-mono text-xs text-muted-foreground">
            {collection.snippetCount} snippet
            {collection.snippetCount === 1 ? "" : "s"} · by{" "}
            {collection.authorName}
          </p>
        </div>

        {(collection.snippets ?? []).length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(collection.snippets ?? []).map((snippet, index) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                showAuthor
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              This folder is empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
