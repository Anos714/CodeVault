"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Copy, Globe, Lock, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ForkButton } from "@/components/dashboard/fork-button";
import { LANGUAGE_META } from "@/lib/languages";
import type { HydratedSnippet } from "@/lib/snippet-types";
import {
  incrementCopies,
  toggleFavorite,
} from "@/server/actions/snippets";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { useHydrated } from "@/lib/client-hooks";

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
  return formatDate(iso);
}

/** Deterministic across server and browser: fixed locale and UTC. Used for
 *  the SSR pass before `mounted` flips, so hydration never disagrees. */
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

type SnippetCardProps = {
  snippet: HydratedSnippet;
  /** show author info — on for the explore feed, off in the personal vault */
  showAuthor?: boolean;
  /** index for the stagger entrance */
  index?: number;
  onDelete?: (id: string) => void;
  /** anonymous share view: no auth-only actions, no dashboard links */
  readOnly?: boolean;
};

export function SnippetCard({
  snippet,
  showAuthor = false,
  index = 0,
  onDelete,
  readOnly = false,
}: SnippetCardProps) {
  const router = useRouter();
  // local star state, seeded from the server and confirmed by the action
  // result — the grid remounts cards when the underlying row changes
  const [starred, setStarred] = useState(snippet.starred);
  const [starCount, setStarCount] = useState(snippet.favorites);
  const [copied, setCopied] = useState(false);
  // relative timestamps depend on Date.now() and the viewer's clock; render
  // the deterministic date first, then switch after hydration
  const mounted = useHydrated();

  const meta = LANGUAGE_META[snippet.language];
  const preview = snippet.code.split("\n").slice(0, MAX_PREVIEW_LINES);
  const truncated = snippet.code.split("\n").length > MAX_PREVIEW_LINES;

  const handleToggleFavorite = async () => {
    if (readOnly) return;
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      // schedule the reset before the counter call: incrementing can fail
      // (anonymous share view, rate limit) without leaving "Copied" stuck
      setTimeout(() => setCopied(false), 1600);
      if (!readOnly) await incrementCopies(snippet.id);
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
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(11,11,15,0.35)]"
    >
      <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-2.5">
        <span className={cn("size-2 shrink-0 rounded-full bg-current", meta.color)} />
        <span className="font-rounded text-[12px] font-semibold text-soft">
          {snippet.language}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 font-rounded text-[0.7rem] font-semibold",
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
          {readOnly ? (
            <h3 className="min-w-0 flex-1 truncate text-[1rem] font-[650] tracking-[-0.02em] text-foreground">
              {snippet.title}
            </h3>
          ) : (
            <Link
              href={`/dashboard/snippets/${snippet.id}`}
              className="min-w-0 flex-1"
            >
              <h3 className="truncate text-[1rem] font-[650] tracking-[-0.02em] text-foreground transition-colors group-hover:text-soft">
                {snippet.title}
              </h3>
            </Link>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={starred ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={starred}
              className={cn(
                "inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 transition-colors",
                starred
                  ? "text-syntax-number"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Star
                className="size-4"
                strokeWidth={1.75}
                fill={starred ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>

        <p className="line-clamp-2 text-[14px] leading-relaxed text-soft">
          {snippet.description}
        </p>

        <div className="relative overflow-hidden rounded-xl bg-panel shadow-[inset_0_0_0_1px_rgba(11,11,15,0.05)]">
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
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-panel to-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-line pt-3 font-rounded text-[0.7rem] font-medium text-soft">
          {showAuthor && <span>by {snippet.authorName}</span>}
          <span className={showAuthor ? "ml-auto" : "mr-auto"}>
            {mounted ? relativeTime(snippet.updatedAt) : formatDate(snippet.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3" fill="currentColor" strokeWidth={0} />
            {starCount}
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
          {!readOnly && (
            <ForkButton snippetId={snippet.id} authorId={snippet.authorId} label="Fork" />
          )}
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
