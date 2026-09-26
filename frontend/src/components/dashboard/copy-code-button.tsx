"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copy affordance for the read-only share/embed surfaces, where loading the
 * Monaco editor would be overkill. Styled inline so callers don't need a
 * wrapper span.
 */
export function CopyCodeButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy snippet"
      className={
        className ??
        "ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {copied ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
