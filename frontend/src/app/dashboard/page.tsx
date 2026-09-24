"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  FileCode2,
  Globe,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsRow } from "@/components/dashboard/stats-row";
import { SnippetCard } from "@/components/dashboard/snippet-card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useSnippetStore } from "@/store/snippet.store";
import { staggerContainer } from "@/lib/motion";

export default function OverviewPage() {
  const user = useAuthStore((state) => state.user);
  const snippets = useSnippetStore((state) => state.snippets);

  const mine = snippets.filter((s) => s.authorId === user?.id);
  const publicCount = mine.filter((s) => s.visibility === "public").length;
  const privateCount = mine.length - publicCount;
  const totalCopies = mine.reduce((sum, s) => sum + s.copies, 0);
  const recent = mine.slice(0, 6);

  const stats = [
    {
      label: "Snippets",
      value: mine.length,
      icon: FileCode2,
      accent: "text-primary",
    },
    {
      label: "Public",
      value: publicCount,
      icon: Globe,
      accent: "text-syntax-function",
    },
    {
      label: "Private",
      value: privateCount,
      icon: Lock,
      accent: "text-muted-foreground",
    },
    {
      label: "Times copied",
      value: totalCopies,
      icon: TrendingUp,
      accent: "text-syntax-string",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <DashboardHeader
        eyebrow="Overview"
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "developer"}.`}
        description="Your vault at a glance — what you've stored, what's public, and what's getting reused."
        actions={
          <>
            <Button
              size="lg"
              className="hidden h-9 gap-1.5 rounded-full px-4 sm:inline-flex"
              render={<Link href="/dashboard/new" />}
            >
              <Sparkles className="size-3.5" />
              New snippet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-9 gap-1.5 rounded-full px-4"
              render={<Link href="/dashboard/snippets" />}
            >
              Browse all
              <ArrowRight className="size-3.5" />
            </Button>
          </>
        }
      />

      <StatsRow stats={stats} />

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <Star
                className="size-4 text-syntax-number"
                fill="currentColor"
                strokeWidth={0}
              />
              Recently updated
            </h2>
            <p className="text-sm text-muted-foreground">
              {mine.length} snippet{mine.length === 1 ? "" : "s"} in your vault
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 text-muted-foreground"
            render={<Link href="/dashboard/snippets" />}
          >
            View all
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {recent.length > 0 ? (
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {recent.map((snippet, index) => (
              <SnippetCard key={snippet.id} snippet={snippet} index={index} />
            ))}
          </motion.div>
        ) : (
          <EmptyVault />
        )}
      </section>
    </div>
  );
}

function EmptyVault() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
        <FileCode2 className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-foreground">
          Your vault is empty
        </h3>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Save your first snippet and stop rewriting the same utility. Tag it,
          set it public or private, and find it in seconds.
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
  );
}
