"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FileCode2, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SnippetCard } from "@/components/dashboard/snippet-card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useSnippetStore } from "@/store/snippet.store";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Visibility } from "@/lib/snippet-data";

type SortKey = "updated" | "created" | "copies" | "favorites";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Recently updated", value: "updated" },
  { label: "Newest", value: "created" },
  { label: "Most copied", value: "copies" },
  { label: "Most starred", value: "favorites" },
];

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function SnippetsPage() {
  return (
    <Suspense>
      <SnippetsPageContent />
    </Suspense>
  );
}

function SnippetsPageContent() {
  const user = useAuthStore((state) => state.user);
  const snippets = useSnippetStore((state) => state.snippets);
  const deleteSnippet = useSnippetStore((state) => state.deleteSnippet);

  const router = useRouter();
  const searchParams = useSearchParams();
  // the URL is the source of truth for the tag filter — links from the tags
  // page and snippet badges point at ?tag=…, and it survives a refresh
  const activeTag = searchParams.get("tag");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<Visibility | "all">("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTag === tag) params.delete("tag");
    else params.set("tag", tag);
    router.replace(`/dashboard/snippets${params.toString() ? `?${params}` : ""}`);
  };

  const clearFilters = () => {
    setQuery("");
    setVisibility("all");
    router.replace("/dashboard/snippets");
  };

  const debouncedQuery = useDebouncedValue(query);

  const mine = useMemo(
    () => snippets.filter((s) => s.authorId === user?.id),
    [snippets, user?.id],
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    mine.forEach((snippet) => snippet.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [mine]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return mine
      .filter((snippet) => {
        if (visibility !== "all" && snippet.visibility !== visibility) return false;
        if (activeTag && !snippet.tags.includes(activeTag)) return false;
        if (!q) return true;
        return (
          snippet.title.toLowerCase().includes(q) ||
          snippet.description.toLowerCase().includes(q) ||
          snippet.language.toLowerCase().includes(q) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sort === "copies") return b.copies - a.copies;
        if (sort === "favorites") return b.favorites - a.favorites;
        if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [mine, debouncedQuery, activeTag, visibility, sort]);

  const hasFilters = Boolean(query || activeTag || visibility !== "all");

  const handleDelete = (id: string) => {
    deleteSnippet(id);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="My snippets"
        title="Your vault"
        description="Search by title, language, or tag. Filter by privacy, sort by reuse."
        actions={
          <Button
            size="lg"
            className="h-9 gap-1.5 rounded-full px-4"
            render={<Link href="/dashboard/new" />}
          >
            <Sparkles className="size-3.5" />
            New snippet
          </Button>
        }
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, language, or tag…"
            aria-label="Search snippets"
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setVisibility("all")}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs transition-all",
              visibility === "all"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {(["private", "public"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setVisibility(value)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs capitalize transition-all",
                visibility === value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}

          <span aria-hidden className="mx-1 h-5 w-px bg-border" />

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={activeTag === tag}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-all",
                activeTag === tag
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="font-mono text-xs text-muted-foreground">
            {filtered.length} of {mine.length} shown
          </span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="snippet-sort"
              className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70"
            >
              Sort
            </label>
            <select
              id="snippet-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-8 rounded-lg border border-input bg-background/60 px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
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
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      ) : hasFilters ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
            <Search className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">
              No snippets match
            </h3>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Try a different title, language, or tag — or clear the filters to
              see your whole vault.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-9 gap-1.5 rounded-full px-5"
            onClick={clearFilters}
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
            <FileCode2 className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">
              Your vault is empty
            </h3>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Save your first snippet and stop rewriting the same utility.
            </p>
          </div>
          <Button
            size="lg"
            className="h-9 gap-1.5 rounded-full px-5"
            render={<Link href="/dashboard/new" />}
          >
            <Sparkles className="size-3.5" />
            Create your first snippet
          </Button>
        </div>
      )}
    </div>
  );
}
