"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Folder, FolderPlus, Sparkles, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  createCollection,
  deleteCollection,
} from "@/server/actions/collections";
import type { Collection } from "@/lib/snippet-types";
import { staggerContainer, fadeUp } from "@/lib/motion";

type CollectionsViewProps = {
  collections: Collection[];
};

export function CollectionsView({ collections }: CollectionsViewProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    setError(null);
    try {
      const { id } = await createCollection({ name: trimmed });
      setName("");
      router.push(`/dashboard/collections/${id}`);
    } catch {
      setError("Could not create the collection.");
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id);
    } catch {
      /* already gone — the refresh still reconciles */
    }
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Collections"
        title="Folders for your vault"
        description="Group snippets into named collections and share the whole folder with one unlisted link."
      />

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <FolderPlus
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name a collection… e.g. Interview prep"
            aria-label="Collection name"
            maxLength={60}
            className="h-10 w-full rounded-lg border border-input bg-background/60 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={creating || !name.trim()}
          className="h-10 shrink-0 gap-1.5 rounded-xl px-5"
        >
          <Sparkles className="size-4" />
          {creating ? "Creating…" : "New collection"}
        </Button>
      </form>
      {error && (
        <span className="text-sm text-destructive" role="alert">
          {error}
        </span>
      )}

      {collections.length > 0 ? (
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={fadeUp}
              className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 text-primary">
                  <Folder className="size-5" strokeWidth={1.75} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Link
                    href={`/dashboard/collections/${collection.id}`}
                    className="truncate text-[0.98rem] font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary"
                  >
                    {collection.name}
                  </Link>
                  <span className="font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                    {collection.snippetCount} snippet
                    {collection.snippetCount === 1 ? "" : "s"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(collection.id)}
                  aria-label={`Delete ${collection.name}`}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {collection.description && (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
            <Folder className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">
              No collections yet
            </h3>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Bundle interview prep, project glue, or regexes you always forget
              — then share the folder with one link.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
