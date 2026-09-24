"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type TokenType =
  | "keyword"
  | "string"
  | "function"
  | "number"
  | "comment"
  | "punctuation"
  | "plain";

export interface Token {
  text: string;
  type?: TokenType;
}

export type CodeLine = Token[];

type CodeWindowProps = {
  filename?: string;
  lines: CodeLine[];
  typing?: boolean;
  loop?: boolean;
  className?: string;
  showLineNumbers?: boolean;
};

type Progress = { done: number; partial: number };

const tokenClass: Record<TokenType, string> = {
  keyword: "text-syntax-keyword",
  string: "text-syntax-string",
  function: "text-syntax-function",
  number: "text-syntax-number",
  comment: "text-syntax-comment",
  punctuation: "text-syntax-punctuation",
  plain: "text-foreground/90",
};

const lineToPlainText = (line: CodeLine) =>
  line.map((token) => token.text).join("");

/** render the first `count` characters of a line, preserving token colors */
function renderPartial(line: CodeLine, count: number) {
  let remaining = count;
  return line.map((token, i) => {
    if (remaining <= 0) return null;
    const take = Math.min(token.text.length, remaining);
    remaining -= take;
    return (
      <span key={i} className={tokenClass[token.type ?? "plain"]}>
        {token.text.slice(0, take)}
      </span>
    );
  });
}

export function CodeWindow({
  filename = "snippet.js",
  lines,
  typing = false,
  loop = false,
  className,
  showLineNumbers = true,
}: CodeWindowProps) {
  const [progress, setProgress] = useState<Progress>({ done: 0, partial: 0 });
  const [copied, setCopied] = useState(false);
  const progressRef = useRef<Progress>({ done: 0, partial: 0 });

  useEffect(() => {
    if (!typing) {
      progressRef.current = { done: lines.length, partial: 0 };
      setProgress(progressRef.current);
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      progressRef.current = { done: lines.length, partial: 0 };
      setProgress(progressRef.current);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    // reset so re-rendering with new `lines` (e.g. language switch) re-types
    progressRef.current = { done: 0, partial: 0 };
    setProgress(progressRef.current);

    const tick = () => {
      if (cancelled) return;
      const current = progressRef.current;

      if (current.done >= lines.length) {
        if (loop) {
          timer = setTimeout(() => {
            if (cancelled) return;
            progressRef.current = { done: 0, partial: 0 };
            setProgress(progressRef.current);
            timer = setTimeout(tick, 350);
          }, 2800);
        }
        return;
      }

      const lineLength = lineToPlainText(lines[current.done]).length;
      let next: Progress;
      let delay: number;

      if (current.partial < lineLength) {
        next = {
          done: current.done,
          partial: Math.min(lineLength, current.partial + 2),
        };
        delay = 26;
      } else {
        next = { done: current.done + 1, partial: 0 };
        delay = 110;
      }

      progressRef.current = next;
      setProgress(next);
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines, typing, loop]);

  const typingComplete = progress.done >= lines.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        lines.map(lineToPlainText).join("\n"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20",
        className,
      )}
    >
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-syntax-number/70" />
          <span className="size-2.5 rounded-full bg-primary/70" />
          <span className="size-2.5 rounded-full bg-syntax-function/70" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {filename}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy snippet"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3 text-primary" />
          ) : (
            <Copy className="size-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* code body */}
      <div className="relative bg-background/40 px-2 py-3.5 sm:px-4">
        <pre className="overflow-x-auto font-mono text-[0.78rem] leading-relaxed sm:text-[0.82rem]">
          <code>
            {lines.map((line, index) => {
              const isTyped = index < progress.done;
              const isCurrent = index === progress.done;
              return (
                <div
                  key={index}
                  className="flex min-h-[1.55em] items-start gap-3"
                >
                  {showLineNumbers && (
                    <span
                      className="select-none text-right text-muted-foreground/40 tabular-nums"
                      style={{ minWidth: "1.4rem" }}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="whitespace-pre">
                    {isTyped
                      ? line.map((token, i) => (
                          <span
                            key={i}
                            className={tokenClass[token.type ?? "plain"]}
                          >
                            {token.text}
                          </span>
                        ))
                      : isCurrent
                        ? renderPartial(line, progress.partial)
                        : null}
                    {isCurrent && !typingComplete && (
                      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-primary animate-caret" />
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>

        {/* shimmer sweep while typing */}
        {!typingComplete && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/[0.05] to-transparent animate-shimmer-x" />
          </div>
        )}
      </div>
    </div>
  );
}
