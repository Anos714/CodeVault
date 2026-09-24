"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Hash, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useSnippetStore } from "@/store/snippet.store";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { LANGUAGE_META } from "@/lib/languages";

export default function TagsPage() {
  const user = useAuthStore((state) => state.user);
  const snippets = useSnippetStore((state) => state.snippets);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    snippets
      .filter((snippet) => snippet.authorId === user?.id)
      .forEach((snippet) => {
        snippet.tags.forEach((tag) => {
          map.set(tag, (map.get(tag) ?? 0) + 1);
        });
      });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [snippets, user?.id]);

  const languages = useMemo(() => {
    const map = new Map<string, number>();
    snippets
      .filter((snippet) => snippet.authorId === user?.id)
      .forEach((snippet) => {
        map.set(snippet.language, (map.get(snippet.language) ?? 0) + 1);
      });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [snippets, user?.id]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Tags"
        title="Organize flat, not in folders"
        description="Tags travel with your code. Click one to jump straight to a filtered vault."
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

      {tags.length > 0 ? (
        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2.5"
        >
          {tags.map(([tag, count]) => (
            <motion.div key={tag} variants={fadeUp}>
              <Link
                href={`/dashboard/snippets?tag=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 transition-all hover:border-primary/40 hover:bg-card"
              >
                <Hash
                  className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                  strokeWidth={2}
                />
                <span className="font-mono text-sm text-foreground">{tag}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {count}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
            <Hash className="size-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">
              No tags yet
            </h3>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Tag a snippet with <code className="font-mono">#auth</code> or{" "}
              <code className="font-mono">#regex</code> and it shows up here.
            </p>
          </div>
          <Button
            size="lg"
            className="h-9 gap-1.5 rounded-full px-5"
            render={<Link href="/dashboard/new" />}
          >
            <Sparkles className="size-3.5" />
            Tag your first snippet
          </Button>
        </div>
      )}

      {languages.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
            Languages you use
          </h2>
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {languages.map(([language, count]) => {
              const meta = LANGUAGE_META[
                language as keyof typeof LANGUAGE_META
              ] ?? {
                label: language,
                color: "text-muted-foreground",
              };
              return (
                <motion.div
                  key={language}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 transition-colors hover:bg-card"
                >
                  <span
                    className={`size-2.5 shrink-0 rounded-full bg-current ${meta.color}`}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-mono text-sm text-foreground">
                      {meta.label}
                    </span>
                    <span className="font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                      {count} snippet{count === 1 ? "" : "s"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}
    </div>
  );
}
