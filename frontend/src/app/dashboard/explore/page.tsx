"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Globe, Search, Star, X } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SnippetCard } from "@/components/dashboard/snippet-card";
import { useSnippetStore } from "@/store/snippet.store";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ExplorePage() {
  const snippets = useSnippetStore((state) => state.snippets);
  const favorites = useSnippetStore((state) => state.favorites);
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const debouncedQuery = useDebouncedValue(query);

  const publicSnippets = useMemo(
    () => snippets.filter((snippet) => snippet.visibility === "public"),
    [snippets],
  );

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return publicSnippets
      .filter((snippet) => {
        if (onlyFavorites && !favorites.includes(snippet.id)) return false;
        if (!q) return true;
        return (
          snippet.title.toLowerCase().includes(q) ||
          snippet.description.toLowerCase().includes(q) ||
          snippet.authorName.toLowerCase().includes(q) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.favorites - a.favorites);
  }, [publicSnippets, favorites, onlyFavorites, debouncedQuery]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Explore"
        title="Public snippets"
        description="What the community vaulted and shared. Star what you reuse, copy what you need."
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search public snippets…"
              aria-label="Search public snippets"
              className="h-10 w-full rounded-lg border border-input bg-background/60 pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOnlyFavorites((value) => !value)}
            aria-pressed={onlyFavorites}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-4 font-mono text-xs transition-all",
              onlyFavorites
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
            )}
          >
            <Star
              className="size-3.5"
              fill={onlyFavorites ? "currentColor" : "none"}
              strokeWidth={1.75}
            />
            Starred only
          </button>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {filtered.length} public snippet{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length > 0 ? (
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((snippet, index) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              showAuthor
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
            <Globe className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">
              Nothing to explore
            </h3>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {onlyFavorites
                ? "You haven't starred a public snippet yet — tap the star on one you reuse."
                : "Try a different search, or flip one of your own snippets to public."}
            </p>
          </div>
          {onlyFavorites && (
            <button
              type="button"
              onClick={() => setOnlyFavorites(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
              Show all public
            </button>
          )}
        </div>
      )}
    </div>
  );
}
