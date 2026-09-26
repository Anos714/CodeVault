"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, GitFork } from "lucide-react";
import { useSnippetStore } from "@/store/snippet.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

type ForkButtonProps = {
  snippetId: string;
  className?: string;
  /** inline variant for cards, outlined for the detail toolbar */
  variant?: "ghost" | "outline";
  label?: string;
};

/**
 * Copies someone else's snippet into your own vault as a private draft,
 * crediting the original author. Hidden for your own snippets — you already
 * have the source.
 */
export function ForkButton({
  snippetId,
  className,
  variant = "ghost",
  label = "Fork",
}: ForkButtonProps) {
  const router = useRouter();
  const forkSnippet = useSnippetStore((state) => state.forkSnippet);
  const user = useAuthStore((state) => state.user);
  const snippets = useSnippetStore((state) => state.snippets);
  const [forked, setForked] = useState(false);

  const snippet = snippets.find((item) => item.id === snippetId);
  if (!snippet || snippet.authorId === user?.id) return null;

  const handleFork = () => {
    if (!user) return;
    const fork = forkSnippet(snippetId, { id: user.id, name: user.name });
    if (!fork) return;
    setForked(true);
    setTimeout(() => router.push(`/dashboard/snippets/${fork.id}`), 500);
  };

  return (
    <button
      type="button"
      onClick={handleFork}
      aria-label="Fork snippet to my vault"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg transition-colors",
        variant === "ghost"
          ? "px-1.5 py-0.5 text-muted-foreground hover:text-foreground"
          : "border border-border bg-background/60 px-4 py-2 text-sm font-medium hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {forked ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <GitFork className="size-3.5" />
      )}
      {forked ? "Forked" : label}
    </button>
  );
}
