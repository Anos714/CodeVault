"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Copy,
  Globe,
  Lock,
  Moon,
  Search,
  Sun,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 280, damping: 24 };

/* ---------------------------------------------------------------
   Editor — a dark mini code window with a blinking caret
   --------------------------------------------------------------- */
function CodeLine({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-3 shrink-0 select-none text-right text-white/20">
        {n}
      </span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap">{children ?? " "}</span>
    </div>
  );
}

export function EditorVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#141418] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-rounded text-[11px] font-semibold text-white/45">
          useDebouncedValue.ts
        </span>
        <span className="ml-auto rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white/55">
          TS
        </span>
      </div>

      <div className="relative space-y-0.5 p-3.5 font-mono text-[10px] leading-[1.7] sm:text-[11px]">
        <CodeLine n={1}>
          <span className="text-[#fa8c8f]">import</span>{" "}
          <span className="text-white/80">{"{ useEffect, useState }"}</span>{" "}
          <span className="text-[#fa8c8f]">from</span>{" "}
          <span className="text-[#8fd8a8]">&quot;react&quot;</span>
        </CodeLine>
        <CodeLine n={2} />
        <CodeLine n={3}>
          <span className="text-[#fa8c8f]">export function</span>{" "}
          <span className="text-[#9ee0f2]">useDebounced</span>
          <span className="text-white/70">(value, delay = 300) {"{"}</span>
        </CodeLine>
        <CodeLine n={4}>
          <span className="pl-3 text-[#fa8c8f]">const</span>{" "}
          <span className="text-white/80">[debounced, setDebounced]</span>{" "}
          <span className="text-white/70">= useState(value)</span>
        </CodeLine>
        <CodeLine n={5}>
          <span className="pl-3 text-[#fa8c8f]">useEffect</span>
          <span className="text-white/70">(() =&gt; {"{"}</span>
        </CodeLine>
        <CodeLine n={6}>
          <span className="pl-6 text-[#fa8c8f]">const</span>{" "}
          <span className="text-white/80">timer</span>{" "}
          <span className="text-white/70">
            = setTimeout(() =&gt; setDebounced(value), delay)
          </span>
        </CodeLine>
        <CodeLine n={7}>
          <span className="pl-6 text-[#fa8c8f]">return</span>{" "}
          <span className="text-white/70">() =&gt; clearTimeout(timer)</span>
        </CodeLine>
        <CodeLine n={8}>
          <span className="pl-3 text-white/70">{"}, [value, delay])"}</span>
          <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-caret bg-[#9ee0f2]" />
        </CodeLine>
      </div>

      <motion.span
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#33995c]/20 px-2 py-1 font-rounded text-[10px] font-semibold text-[#8fe0ae] ring-1 ring-[#33995c]/30"
      >
        <Check className="size-3" /> Saved
      </motion.span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#9eccff]/10 via-transparent to-[#b3bdff]/10"
      />
    </div>
  );
}

/* ---------------------------------------------------------------
   Search — a query that cycles through real-looking results
   --------------------------------------------------------------- */
const searchResults = [
  {
    title: "rateLimit middleware",
    lang: "JS",
    tag: "#auth",
    dot: "bg-[#ffd673]",
  },
  { title: "email regex", lang: "RE", tag: "#regex", dot: "bg-[#fa8c8f]" },
  {
    title: "fetchWithRetry",
    lang: "TS",
    tag: "#fetch",
    dot: "bg-[#9ee0f2]",
  },
];

export function SearchVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((index) => (index + 1) % searchResults.length),
      1900,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full min-h-[190px] flex-col rounded-2xl bg-[#141418] p-3 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white/[0.08] px-3">
        <Search className="size-3.5 text-white/45" />
        <span className="font-rounded text-[11.5px] font-semibold text-white/85">
          {searchResults[active].tag}
        </span>
        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/45">
          ⌘K
        </span>
      </div>

      <div className="mt-2 grid gap-1.5">
        {searchResults.map((result, index) => (
          <motion.div
            key={result.title}
            animate={{
              backgroundColor:
                index === active
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.03)",
            }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2"
          >
            <span className={cn("size-1.5 rounded-full", result.dot)} />
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/85">
              {result.title}
            </span>
            <span className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[8.5px] text-white/45">
              {result.lang}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-1.5 font-rounded text-[9.5px] font-medium text-white/35">
        <span className="size-1 rounded-full bg-[#8fe0ae]" />3 results in 12ms
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Tags — floating pastel chips over a tag input
   --------------------------------------------------------------- */
const tags = [
  { label: "#react", className: "bg-[#9eccff] text-[#0b0b0f]", delay: 0 },
  { label: "#auth", className: "bg-[#ffd673] text-[#0b0b0f]", delay: 0.3 },
  { label: "#regex", className: "bg-[#fa8c8f] text-[#0b0b0f]", delay: 0.6 },
  { label: "#fetch", className: "bg-[#b3bdff] text-[#0b0b0f]", delay: 0.9 },
  { label: "#cache", className: "bg-[#9ee0f2] text-[#0b0b0f]", delay: 1.2 },
];

export function TagsVisual() {
  return (
    <div className="relative h-full min-h-[150px] overflow-hidden rounded-2xl bg-card p-3 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30 mask-fade" />

      <div className="relative flex items-center gap-2 rounded-xl bg-panel px-3 py-2">
        <Tag className="size-3.5 text-soft" />
        <span className="font-rounded text-[11px] font-medium text-soft">
          Add a tag…
        </span>
        <span className="ml-auto inline-block h-3.5 w-px animate-caret bg-ink/40" />
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <motion.span
            key={tag.label}
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 3.2,
              delay: tag.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "rounded-full px-2.5 py-1 font-rounded text-[11px] font-bold",
              tag.className,
            )}
          >
            {tag.label}
          </motion.span>
        ))}
        <span className="rounded-full bg-panel px-2.5 py-1 font-rounded text-[11px] font-bold text-soft">
          +
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Privacy — a live toggle between private and public
   --------------------------------------------------------------- */
export function PrivacyVisual() {
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setIsPublic((value) => !value), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full min-h-[150px] flex-col items-center justify-center gap-2.5 rounded-2xl bg-card shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isPublic ? "public" : "private"}
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "grid size-8 place-items-center rounded-full",
              isPublic
                ? "bg-[#33995c]/15 text-[#33995c]"
                : "bg-ink/[0.07] text-soft",
            )}
          >
            {isPublic ? (
              <Globe className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>
        <span className="font-rounded text-[13px] font-bold text-foreground">
          {isPublic ? "Public" : "Private"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsPublic((value) => !value)}
        aria-label="Toggle snippet visibility"
        aria-pressed={isPublic}
        className={cn(
          "relative h-8 w-14 rounded-full p-1 transition-colors duration-300",
          isPublic ? "bg-[#33995c]" : "bg-ink/[0.15]",
        )}
      >
        <motion.span
          layout
          transition={spring}
          className="block size-6 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
        />
      </button>

      <p className="font-rounded text-[10.5px] font-medium text-soft">
        {isPublic ? "Anyone with the link" : "Only you can see this"}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------
   Copy — a looping copy-to-clipboard confirmation
   --------------------------------------------------------------- */
export function CopyVisual() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let reset: ReturnType<typeof setTimeout>;
    let next: ReturnType<typeof setTimeout>;

    const tick = () => {
      setCopied(true);
      reset = setTimeout(() => {
        setCopied(false);
        next = setTimeout(tick, 1400);
      }, 1300);
    };

    next = setTimeout(tick, 900);
    return () => {
      clearTimeout(reset);
      clearTimeout(next);
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-[150px] flex-col items-center justify-center gap-3 rounded-2xl bg-card shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
      <div className="w-[190px] rounded-xl bg-panel px-3 py-2.5 font-mono text-[9.5px] leading-relaxed text-soft shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
        <span className="text-[#8a4baf]">const</span> user ={" "}
        <span className="text-[#2f7d55]">await</span> db.user.find()
      </div>

      <button
        type="button"
        onClick={() => setCopied(true)}
        className={cn(
          "relative inline-flex h-8 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 font-rounded text-[11px] font-bold transition-colors duration-300",
          copied
            ? "bg-[#33995c]/15 text-[#33995c]"
            : "bg-foreground text-background",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1"
            >
              <Check className="size-3" /> Copied
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1"
            >
              <Copy className="size-3" /> Copy
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   Theme — a light/dark split with a sweeping divider
   --------------------------------------------------------------- */
export function ThemeVisual() {
  return (
    <div className="relative h-full min-h-[180px] overflow-hidden rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_9%,transparent)]">
      <div className="grid h-full grid-cols-2">
        <div className="bg-white p-3">
          <div className="flex items-center gap-1.5 font-rounded text-[9px] font-semibold text-soft">
            <Sun className="size-3" /> Day
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-[9px] leading-relaxed">
            <div className="text-[#8a4baf]">export const vault = {"{"}</div>
            <div className="pl-3 text-[#2f7d55]">&quot;snippets&quot;: 128,</div>
            <div className="pl-3 text-[#2f7d55]">&quot;tags&quot;: 24,</div>
            <div className="pl-3 text-[#2f7d55]">&quot;theme&quot;: &quot;light&quot;,</div>
            <div className="pl-3 text-[#2f7d55]">&quot;synced&quot;: true,</div>
            <div className="text-[#8a4baf]">{"}"}</div>
          </div>
        </div>

        <div className="bg-[#141418] p-3">
          <div className="flex items-center justify-end gap-1.5 font-rounded text-[9px] font-semibold text-white/50">
            Night <Moon className="size-3" />
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-[9px] leading-relaxed">
            <div className="text-[#d0a2f0]">export const vault = {"{"}</div>
            <div className="pl-3 text-[#8fd8a8]">&quot;snippets&quot;: 128,</div>
            <div className="pl-3 text-[#8fd8a8]">&quot;tags&quot;: 24,</div>
            <div className="pl-3 text-[#8fd8a8]">&quot;theme&quot;: &quot;dark&quot;,</div>
            <div className="pl-3 text-[#8fd8a8]">&quot;synced&quot;: true,</div>
            <div className="text-[#d0a2f0]">{"}"}</div>
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden
        animate={{ left: ["18%", "82%", "18%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-3 w-px bg-gradient-to-b from-transparent via-ink/30 to-transparent"
      />
    </div>
  );
}
