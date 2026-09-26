import Link from "next/link";
import { notFound } from "next/navigation";
import { LANGUAGE_META } from "@/lib/languages";
import { highlightToHtml } from "@/lib/highlight";
import { useSnippetStore } from "@/store/snippet.store";
import { seedSnippets } from "@/lib/snippet-data";
import { CopyCodeButton } from "@/components/dashboard/copy-code-button";

/**
 * Chrome-free embed surface for READMEs and Notion. Drop
 * `<iframe src="/embed/[id]" height="N" width="100%"></iframe>` into a doc and
 * the snippet renders highlighted, titled, and copyable — a lightweight Gist.
 */
type EmbedPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { id } = await params;

  const snippet =
    seedSnippets.find((item) => item.id === id) ??
    useSnippetStore.getState().snippets.find((item) => item.id === id);

  if (!snippet) notFound();

  const meta = LANGUAGE_META[snippet.language];
  const highlighted = highlightToHtml(snippet.code);
  const lineCount = snippet.code.split("\n").length;

  return (
    <div className="min-h-dvh bg-background p-3 font-sans text-foreground">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <header className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-3.5 py-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-syntax-number/70" />
            <span className="size-2.5 rounded-full bg-primary/70" />
            <span className="size-2.5 rounded-full bg-syntax-function/70" />
          </span>
          <span
            className={`inline-flex items-center rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[0.68rem] ${meta.color}`}
          >
            {meta.label}
          </span>
          <span className="truncate font-mono text-[0.68rem] text-muted-foreground">
            {snippet.title}
          </span>
          <EmbedCopyButton code={snippet.code} />
        </header>

        <pre className="overflow-x-auto bg-background/40 px-3.5 py-3 font-mono text-[0.76rem] leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>

        <footer className="flex items-center justify-between border-t border-border bg-muted/30 px-3.5 py-1.5 font-mono text-[0.64rem] text-muted-foreground">
          <span>
            {lineCount} line{lineCount === 1 ? "" : "s"}
          </span>
          <Link
            href={`/s/${snippet.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            open in CodeVault →
          </Link>
        </footer>
      </div>
    </div>
  );
}

function EmbedCopyButton({ code }: { code: string }) {
  return <CopyCodeButton code={code} />;
}
