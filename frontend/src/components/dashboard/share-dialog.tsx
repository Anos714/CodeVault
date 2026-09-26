"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clock,
  Copy,
  FileCode2,
  Globe,
  Link2,
  ShieldOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSnippetStore } from "@/store/snippet.store";
import {
  SHARE_EXPIRY_OPTIONS,
  shareUrl,
  expiryLabel,
  type ShareExpiryDays,
} from "@/lib/share";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import type { Snippet } from "@/lib/snippet-data";

type ShareDialogProps = {
  snippet: Snippet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShareDialog({ snippet, open, onOpenChange }: ShareDialogProps) {
  const createShareLink = useSnippetStore((state) => state.createShareLink);
  const revokeShareLinks = useSnippetStore((state) => state.revokeShareLinks);
  const snippets = useSnippetStore((state) => state.snippets);

  // read live share-link state from the store so mint/revoke show instantly
  const current = snippets.find((item) => item.id === snippet.id) ?? snippet;
  const links = current.shareLinks ?? [];

  const [expiry, setExpiry] = useState<ShareExpiryDays>(null);
  const [justMinted, setJustMinted] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleMint = () => {
    const link = createShareLink(snippet.id, expiry);
    if (link) {
      setJustMinted(link.token);
      setCopied(null);
    }
  };

  const handleCopy = async (url: string, token: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(token);
      setTimeout(() => setCopied((value) => (value === token ? null : value)), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleRevoke = () => {
    revokeShareLinks(snippet.id);
    setJustMinted(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 px-5 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h2
                  id="share-dialog-title"
                  className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
                >
                  <Link2 className="size-4 text-primary" />
                  Share this snippet
                </h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileCode2 className="size-3.5" />
                  {snippet.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close share dialog"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {snippet.visibility === "public" ? (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3.5 text-sm leading-relaxed text-muted-foreground">
                <Globe className="mt-0.5 size-4 shrink-0 text-syntax-function" />
                <span>
                  This snippet is <strong className="text-foreground">public</strong>,
                  so anyone with the link can already see it on Explore. An unlisted
                  link below hands out a direct URL instead.
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3.5 text-sm leading-relaxed text-muted-foreground">
                <ShieldOff className="mt-0.5 size-4 shrink-0" />
                <span>
                  It stays <strong className="text-foreground">private</strong> in
                  your vault — these links are unlisted, and revoking one kills
                  every link issued for it.
                </span>
              </div>
            )}

            {/* mint a new link */}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                Expiry
              </span>
              <div className="flex flex-wrap gap-2">
                {SHARE_EXPIRY_OPTIONS.map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => setExpiry(option.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-xs transition-all",
                      expiry === option.value
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="h-9 w-fit gap-2 rounded-full px-5"
                onClick={handleMint}
              >
                <Link2 className="size-4" />
                Create unlisted link
              </Button>
            </div>

            {/* outstanding links */}
            {links.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  Active links
                </span>
                <ul className="flex flex-col gap-2">
                  {links
                    .slice()
                    .reverse()
                    .map((link) => {
                      const url = shareUrl(link.token);
                      const isNew = link.token === justMinted;
                      return (
                        <li
                          key={link.token}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border p-2",
                            link.revoked
                              ? "border-border bg-muted/20 opacity-60"
                              : isNew
                                ? "border-primary/40 bg-primary/[0.06]"
                                : "border-border bg-muted/30",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60",
                              link.revoked
                                ? "text-muted-foreground"
                                : "text-syntax-function",
                            )}
                          >
                            {link.revoked ? (
                              <ShieldOff className="size-3.5" />
                            ) : (
                              <Link2 className="size-3.5" />
                            )}
                          </span>
                          <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                            {url}
                          </code>
                          <Badge
                            variant={link.revoked ? "destructive" : "secondary"}
                            className="shrink-0 gap-1 font-mono"
                          >
                            <Clock className="size-3" />
                            {link.revoked ? "revoked" : expiryLabel(link)}
                          </Badge>
                          {!link.revoked && (
                            <button
                              type="button"
                              onClick={() => handleCopy(url, link.token)}
                              aria-label="Copy link"
                              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {copied === link.token ? (
                                <Check className="size-3.5 text-primary" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </button>
                          )}
                        </li>
                      );
                    })}
                </ul>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <ShieldOff className="size-3.5" />
                  Revoke all links
                </button>
              </div>
            )}

            <p className="border-t border-border pt-4 font-mono text-[0.68rem] leading-relaxed text-muted-foreground/60">
              Embed it in a README:{" "}
              <code className="text-foreground/80">
                {`<iframe src="${typeof window !== "undefined" ? window.location.origin : "https://codevault-olive.vercel.app"}/embed/${snippet.id}" …/>`}
              </code>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
