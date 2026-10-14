"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Copy,
  GitFork,
  Globe,
  Link2,
  Lock,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/dashboard/code-editor";
import { ShareDialog } from "@/components/dashboard/share-dialog";
import { ForkButton } from "@/components/dashboard/fork-button";
import { LANGUAGE_META } from "@/lib/languages";
import type { HydratedSnippet } from "@/lib/snippet-types";
import {
  deleteSnippet,
  toggleFavorite,
} from "@/server/actions/snippets";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60_000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type DetailViewProps = {
  snippet: HydratedSnippet;
  isOwner: boolean;
};

export function DetailView({ snippet, isOwner }: DetailViewProps) {
  const router = useRouter();

  const [starred, setStarred] = useState(snippet.starred);
  const [starCount, setStarCount] = useState(snippet.favorites);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const meta = LANGUAGE_META[snippet.language];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleToggleFavorite = async () => {
    const previous = starred;
    setStarred(!previous);
    setStarCount((count) => (previous ? Math.max(0, count - 1) : count + 1));
    try {
      const result = await toggleFavorite(snippet.id);
      setStarred(result.favorited);
      router.refresh();
    } catch {
      setStarred(previous);
      setStarCount(snippet.favorites);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    try {
      await deleteSnippet(snippet.id);
    } catch {
      /* already gone — still leave the page */
    }
    router.push("/dashboard/snippets");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link
        href="/dashboard/snippets"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to snippets
      </Link>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs",
                meta.color,
              )}
            >
              {meta.label}
            </span>
            <Badge
              variant={snippet.visibility === "public" ? "default" : "secondary"}
              className="gap-1"
            >
              {snippet.visibility === "public" ? (
                <Globe className="size-3" />
              ) : (
                <Lock className="size-3" />
              )}
              {snippet.visibility}
            </Badge>
            {snippet.tags.map((tag) => (
              <Link key={tag} href={`/dashboard/snippets?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="font-mono hover:border-primary/40">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {snippet.description}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-2 border-y border-border py-3"
        >
          <Button
            variant={snippet.visibility === "public" ? "default" : "outline"}
            className="h-9 gap-2 rounded-xl px-4"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="size-4 text-primary" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-9 gap-2 rounded-xl px-4"
            onClick={handleToggleFavorite}
            aria-pressed={starred}
          >
            <Star
              className="size-4"
              fill={starred ? "currentColor" : "none"}
            />
            {starCount}
          </Button>

          {isOwner && (
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-xl px-4"
              onClick={() => setShareOpen(true)}
            >
              <Link2 className="size-4" />
              Share
            </Button>
          )}
          <ForkButton
            snippetId={snippet.id}
            authorId={snippet.authorId}
            variant="outline"
            className="h-9 rounded-xl px-4 font-medium"
          />
          {snippet.forkedFromId && (
            <Link
              href={`/dashboard/snippets/${snippet.forkedFromId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 font-mono text-[0.68rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <GitFork className="size-3.5" />
              forked from {snippet.forkedFromAuthor}
            </Link>
          )}

          <span className="ml-auto font-mono text-xs text-muted-foreground">
            updated {relativeTime(snippet.updatedAt)}
          </span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-border bg-card/50"
        >
          <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-syntax-number/70" />
              <span className="size-2.5 rounded-full bg-primary/70" />
              <span className="size-2.5 rounded-full bg-syntax-function/70" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {snippet.title.toLowerCase().replace(/\s+/g, "-")}.
              {fileExtension(snippet.language)}
            </span>
          </div>
          <CodeEditor
            value={snippet.code}
            language={snippet.language}
            readOnly
            height={Math.max(
              200,
              Math.min(640, snippet.code.split("\n").length * 20 + 40),
            )}
            className="rounded-none border-0"
          />
        </motion.div>

        {isOwner && (
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-2"
          >
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-xl px-4"
              render={<Link href={`/dashboard/snippets/${snippet.id}/edit`} />}
            >
              <Pencil className="size-4" />
              Edit snippet
            </Button>
            <Button
              variant="destructive"
              className="h-9 gap-2 rounded-xl px-4"
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              {confirmDelete ? "Click again to confirm" : "Delete"}
            </Button>
            {confirmDelete && (
              <span className="font-mono text-xs text-destructive">
                this can&apos;t be undone
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {isOwner && (
        <ShareDialog
          snippet={snippet}
          open={shareOpen}
          onOpenChange={setShareOpen}
        />
      )}
    </div>
  );
}

function fileExtension(language: string) {
  const map: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    python: "py",
    go: "go",
    rust: "rs",
    java: "java",
    csharp: "cs",
    cpp: "cpp",
    php: "php",
    ruby: "rb",
    shell: "sh",
    sql: "sql",
    html: "html",
    css: "css",
    json: "json",
    yaml: "yaml",
    markdown: "md",
  };
  return map[language] ?? "txt";
}
