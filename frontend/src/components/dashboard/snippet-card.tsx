"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Copy, Globe, Lock, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LANGUAGE_META } from "@/lib/languages";
import type { Snippet } from "@/lib/snippet-data";
import { useSnippetStore } from "@/store/snippet.store";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

const MAX_PREVIEW_LINES = 6;

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
  });
}

type SnippetCardProps = {
  snippet: Snippet;
  /** show author info — on for the explore feed, off in the personal vault */
  showAuthor?: boolean;
  /** index for the stagger entrance */
  index?: number;
  onDelete?: (id: string) => void;
};

export function SnippetCard({
  snippet,
  showAuthor = false,
  index = 0,
  onDelete,
}: SnippetCardProps) {
  const favorites = useSnippetStore((state) => state.favorites);
  const toggleFavorite = useSnippetStore((state) => state.toggleFavorite);
  const incrementCopies = useSnippetStore((state) => state.incrementCopies);
  const [copied, setCopied] = useState(false);

  const isFavorite = favorites.includes(snippet.id);
  const meta = LANGUAGE_META[snippet.language];
  const preview = snippet.code.split("\n").slice(0, MAX_PREVIEW_LINES);
  const truncated = snippet.code.split("\n").length > MAX_PREVIEW_LINES;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      incrementCopies(snippet.id);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleDelete = () => {
    onDelete?.(snippet.id);
  };

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-primary/30 hover:bg-card"
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className={cn("size-2 shrink-0 rounded-full bg-current", meta.color)} />
        <span className="font-mono text-xs text-muted-foreground">
          {snippet.language}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 font-mono text-[0.68rem]",
            snippet.visibility === "public"
              ? "text-syntax-function"
              : "text-muted-foreground",
          )}
        >
          {snippet.visibility === "public" ? (
            <Globe className="size-3.5" />
          ) : (
            <Lock className="size-3.5" />
          )}
          {snippet.visibility}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <Link
            href={`/dashboard/snippets/${snippet.id}`}
            className="min-w-0 flex-1"
          >
            <h3 className="truncate text-[0.98rem] font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {snippet.title}
            </h3>
          </Link>
          <button
            type="button"
            onClick={() => toggleFavorite(snippet.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className={cn(
              "inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 transition-colors",
              isFavorite
                ? "text-syntax-number"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Star
              className="size-4"
              strokeWidth={1.75}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {snippet.description}
        </p>

        <div className="relative overflow-hidden rounded-lg border border-border bg-background/60">
          <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[0.72rem] leading-relaxed">
            <code>
              {preview.map((line, i) => (
                <div key={i} className="whitespace-pre text-foreground/80">
                  {line || " "}
                </div>
              ))}
              {truncated && (
                <div className="select-none text-muted-foreground/50">
                  {"// …"}
                </div>
              )}
            </code>
          </pre>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/90 to-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 font-mono text-[0.68rem] text-muted-foreground">
          {showAuthor && <span>by {snippet.authorName}</span>}
          <span className={showAuthor ? "ml-auto" : "mr-auto"}>
            {relativeTime(snippet.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3" fill="currentColor" strokeWidth={0} />
            {snippet.favorites}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy snippet"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3 text-primary" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete snippet"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
