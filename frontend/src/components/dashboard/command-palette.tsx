"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CornerDownLeft, FileCode2, Plus, Search } from "lucide-react";
import { LANGUAGE_META, type Language } from "@/lib/languages";
import type { HydratedSnippet } from "@/lib/snippet-types";
import { fetchVaultPage } from "@/server/actions/reads";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

const NAVIGATION = [
  { label: "Vault overview", href: "/dashboard" },
  { label: "My snippets", href: "/dashboard/snippets" },
  { label: "Explore public snippets", href: "/dashboard/explore" },
  { label: "Tags", href: "/dashboard/tags" },
  { label: "Collections", href: "/dashboard/collections" },
  { label: "Settings", href: "/dashboard/settings" },
];

type Item =
  | { kind: "snippet"; id: string; title: string; language: Language; tags: string[] }
  | { kind: "action"; id: string; label: string; href: string; primary?: boolean };

/**
 * The vault search the landing page advertises as ⌘K. Results come from the
 * same paged read action the vault list uses, so relevance and filters match
 * what the page itself would show.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HydratedSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const term = query.trim();

  // opening always starts from a clean slate, so the previous query and its
  // results never flash back for a frame
  const openPalette = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setResults([]);
      setActive(0);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette]);

  useEffect(() => {
    if (!term) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const page = await fetchVaultPage(
          { q: term, tag: "", visibility: "all", sort: "updated" },
          null,
        );
        if (cancelled) return;
        setResults(page.snippets);
        setActive(0);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  const items = useMemo<Item[]>(() => {
    const lower = term.toLowerCase();
    const actions: Item[] = NAVIGATION.filter(
      (entry) => !lower || entry.label.toLowerCase().includes(lower),
    ).map((entry) => ({ kind: "action", id: entry.href, ...entry }));

    const snippets: Item[] = (term ? results : []).map((snippet) => ({
      kind: "snippet",
      id: snippet.id,
      title: snippet.title,
      language: snippet.language,
      tags: snippet.tags,
    }));

    return [
      { kind: "action", id: "/dashboard/new", label: "New snippet", href: "/dashboard/new", primary: true },
      ...snippets,
      ...actions,
    ];
  }, [results, term]);

  const go = useCallback(
    (item: Item) => {
      openPalette(false);
      router.push(item.kind === "snippet" ? `/dashboard/snippets/${item.id}` : item.href);
    },
    [openPalette, router],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(1, items.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + items.length) % Math.max(1, items.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[active];
      if (item) go(item);
    } else if (event.key === "Escape") {
      event.preventDefault();
      openPalette(false);
    }
  };

  // keep the highlighted row in view when the arrow keys walk the list
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[110] flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => openPalette(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the vault"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.26, ease: easeOutExpo }}
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-[22px] border border-line bg-card shadow-[0_36px_80px_-34px_rgba(11,11,15,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                role="combobox"
                autoFocus
                aria-expanded="true"
                aria-controls="command-palette-list"
                aria-activedescendant={`command-palette-option-${active}`}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLoading(Boolean(event.target.value.trim()));
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search snippets or jump to a page…"
                className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="shrink-0 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              id="command-palette-list"
              role="listbox"
              aria-label="Results"
              className="max-h-[52vh] overflow-y-auto p-2"
            >
              {items.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {loading
                    ? "Searching…"
                    : `Nothing in your vault matches “${term}”.`}
                </p>
              )}

              {items.map((item, index) => {
                const isActive = index === active;
                const id = `command-palette-option-${index}`;
                return (
                  <button
                    key={id}
                    id={id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      isActive ? "bg-primary/[0.08] text-foreground" : "text-soft hover:bg-muted/40",
                    )}
                  >
                    {item.kind === "snippet" ? (
                      <>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground">
                          <FileCode2 className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="block truncate font-mono text-[0.68rem] text-muted-foreground">
                            {LANGUAGE_META[item.language].label}
                            {item.tags.length > 0 && ` · ${item.tags.map((tag) => `#${tag}`).join(" ")}`}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60",
                            item.primary ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {item.primary ? (
                            <Plus className="size-3.5" />
                          ) : (
                            <ArrowUpRight className="size-3.5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {item.label}
                        </span>
                      </>
                    )}

                    {isActive && (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[0.65rem] text-muted-foreground">
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span className="ml-auto">{loading ? "searching…" : `${items.length} shown`}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
