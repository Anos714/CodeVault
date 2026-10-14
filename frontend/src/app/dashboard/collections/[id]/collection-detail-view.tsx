"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, Folder, Plus, Sparkles, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SnippetCard } from "@/components/dashboard/snippet-card";
import { CollectionShare } from "@/components/dashboard/collection-share";
import { Button } from "@/components/ui/button";
import {
  addSnippetToCollection,
  deleteCollection,
  removeSnippetFromCollection,
  updateCollection,
} from "@/server/actions/collections";
import type { Collection } from "@/lib/snippet-types";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CollectionDetailViewProps = {
  collection: Collection;
  candidates: Array<{ id: string; title: string }>;
};

export function CollectionDetailView({
  collection,
  candidates,
}: CollectionDetailViewProps) {
  const router = useRouter();
  const members = collection.snippets ?? [];

  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [picked, setPicked] = useState("");
  const [adding, setAdding] = useState(false);

  const dirty =
    name.trim() !== collection.name || description.trim() !== collection.description;

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !dirty) return;
    try {
      await updateCollection(collection.id, {
        name: name.trim(),
        description: description.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      router.refresh();
    } catch {
      /* gone — the refresh still reconciles */
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    try {
      await deleteCollection(collection.id);
    } catch {
      /* already gone — still leave the page */
    }
    router.push("/dashboard/collections");
  };

  const handleAdd = async () => {
    if (!picked || adding) return;
    setAdding(true);
    try {
      await addSnippetToCollection(collection.id, picked);
      setPicked("");
    } catch {
      /* not viewable anymore — the refresh still reconciles */
    } finally {
      setAdding(false);
      router.refresh();
    }
  };

  const handleRemove = async (snippetId: string) => {
    try {
      await removeSnippetFromCollection(collection.id, snippetId);
    } catch {
      /* already removed */
    }
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Link
        href="/dashboard/collections"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to collections
      </Link>

      <DashboardHeader
        eyebrow="Collection"
        title={collection.name}
        description={
          collection.description ||
          "A folder for related snippets — members, sharing, everything below."
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
        <div className="flex min-w-0 flex-col gap-6">
          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSave}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5"
          >
            <div className="grid grid-cols-1 gap-4">
              <label
                htmlFor="collection-name"
                className="flex flex-col gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80"
              >
                Name
                <input
                  id="collection-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  className="h-10 rounded-lg border border-input bg-background/60 px-3 font-sans text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </label>
              <label
                htmlFor="collection-description"
                className="flex flex-col gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80"
              >
                Description
                <span className="text-[0.6rem] normal-case tracking-normal text-muted-foreground/50">
                  optional
                </span>
                <input
                  id="collection-description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={220}
                  placeholder="What belongs in here?"
                  className="h-10 rounded-lg border border-input bg-background/60 px-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                size="lg"
                disabled={!dirty}
                className="h-9 gap-2 rounded-xl px-5"
              >
                {saved ? (
                  <>
                    <Check className="size-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Save changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-9 gap-2 rounded-xl px-4"
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                {confirmDelete ? "Click again to confirm" : "Delete"}
              </Button>
              {confirmDelete && (
                <span className="font-mono text-xs text-destructive">
                  members stay in your vault — only the folder goes
                </span>
              )}
            </div>
          </motion.form>

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/80">
              Add a snippet
            </span>
            {candidates.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={picked}
                  onChange={(event) => setPicked(event.target.value)}
                  aria-label="Pick a snippet from your vault"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background/60 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">Pick from your vault…</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.title}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!picked || adding}
                  className="h-10 shrink-0 gap-1.5 rounded-xl px-5"
                  onClick={handleAdd}
                >
                  <Plus className="size-4" />
                  {adding ? "Adding…" : "Add"}
                </Button>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Everything in your vault already lives here. Save a new snippet
                to grow the folder.
              </p>
            )}
          </div>

          {members.length > 0 ? (
            <motion.div
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {members.map((snippet, index) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  index={index}
                  onDelete={handleRemove}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
                <Folder className="size-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Empty folder
                </h3>
                <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                  Pick a snippet above to file the first one away.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <CollectionShare
            collectionId={collection.id}
            links={collection.shareLinks ?? []}
          />
          <p className={cn("font-mono text-[0.68rem] leading-relaxed text-muted-foreground/60")}>
            Deleting the folder never deletes snippets — members stay in your
            vault.
          </p>
        </div>
      </div>
    </div>
  );
}
