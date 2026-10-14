"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Copy, Link2, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  createCollectionLink,
  revokeCollectionLinks,
} from "@/server/actions/collections";
import {
  SHARE_EXPIRY_OPTIONS,
  type ShareExpiryDays,
} from "@/lib/share";
import { expiryLabel } from "@/lib/share";
import type { ShareLink } from "@/lib/snippet-types";
import { cn } from "@/lib/utils";

function collectionUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://codevault-olive.vercel.app";
  return `${base}/c/${token}`;
}

type CollectionShareProps = {
  collectionId: string;
  links: ShareLink[];
};

/**
 * Mint/revoke panel for a collection's unlisted links — the same pattern as
 * the snippet share dialog, inline on the collection detail page.
 */
export function CollectionShare({ collectionId, links }: CollectionShareProps) {
  const router = useRouter();
  const [expiry, setExpiry] = useState<ShareExpiryDays>(null);
  const [justMinted, setJustMinted] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleMint = async () => {
    try {
      const link = await createCollectionLink(collectionId, expiry);
      setJustMinted(link.token);
      setCopied(null);
      router.refresh();
    } catch {
      /* gone — the refresh still reconciles */
      router.refresh();
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

  const handleRevoke = async () => {
    try {
      await revokeCollectionLinks(collectionId);
      setJustMinted(null);
    } catch {
      /* already gone */
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Link2 className="size-4 text-primary" />
          Share this folder
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Unlisted links open the whole collection — members included, even
          private ones. Revoking kills every link at once.
        </p>
      </div>

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
                const url = collectionUrl(link.token);
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
    </div>
  );
}
