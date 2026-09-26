import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileCode2, Globe, Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LANGUAGE_META } from "@/lib/languages";
import { highlightToHtml } from "@/lib/highlight";
import { useSnippetStore } from "@/store/snippet.store";
import type { Snippet } from "@/lib/snippet-data";
import { expiryLabel, resolveSnippetByShareToken } from "@/lib/share";
import { CopyCodeButton } from "@/components/dashboard/copy-code-button";

export const metadata: Metadata = {
  title: "Shared snippet",
  description: "A CodeVault snippet shared with you.",
};

type SharePageProps = {
  params: Promise<{ token: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  // a share token resolves to an unlisted link first, then falls back to a
  // public snippet's id — public ones are reachable directly
  const all = useSnippetStore.getState().snippets;
  const snippet =
    resolveSnippetByShareToken(all, token) ??
    all.find((item) => item.id === token && item.visibility === "public");

  if (!snippet) notFound();

  const isUnlisted = !snippet.shareLinks?.some((link) => link.token === token);
  const activeLink = snippet.shareLinks?.find((link) => link.token === token);
  const meta = LANGUAGE_META[snippet.language];

  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-40" />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-16 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground">
            {isUnlisted ? (
              <>
                <Lock className="size-3" />
                unlisted link
              </>
            ) : (
              <>
                <Globe className="size-3" />
                public
              </>
            )}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs ${meta.color}`}
            >
              {meta.label}
            </span>
            {activeLink && (
              <span className="font-mono text-[0.68rem] text-muted-foreground">
                {expiryLabel(activeLink)}
              </span>
            )}
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {snippet.description}
            </p>
          )}
        </div>

        <SharedCodeBlock snippet={snippet} />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-xs text-muted-foreground">
          <span>by {snippet.authorName}</span>
          <span className="inline-flex items-center gap-1.5">
            <FileCode2 className="size-3.5" />
            vaulted with CodeVault
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The shared block itself — highlighted, copyable, and the exact markup the
 * embed route renders so a share link and an iframe always agree.
 */
export function SharedCodeBlock({
  snippet,
}: {
  snippet: Snippet;
}) {
  const highlighted = highlightToHtml(snippet.code);
  const lineCount = snippet.code.split("\n").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-syntax-number/70" />
          <span className="size-2.5 rounded-full bg-primary/70" />
          <span className="size-2.5 rounded-full bg-syntax-function/70" />
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {snippet.language} · {lineCount} lines
        </span>
        <CopyCodeButton code={snippet.code} />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
