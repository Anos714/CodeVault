"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, FolderTree, PenLine, Rocket, Search } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Capture",
    description:
      "Paste a snippet or write it fresh in the Monaco editor. Add a title, a note, and pick the language.",
    note: "No forms to fight. The editor is already there.",
  },
  {
    icon: FolderTree,
    step: "02",
    title: "Organize",
    description:
      "Tag it with #auth, #regex, or whatever fits. Mark it public to share, or keep it private.",
    note: "Flat tags beat deep folders when you are in a hurry.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Reuse",
    description:
      "Search by title, language, or tag — then copy it in one click. That utility is never lost again.",
    note: "Or insert it straight into Chrome and VS Code.",
  },
];

const mockRows = [
  {
    title: "useDebouncedValue",
    lang: "TS",
    tag: "#react",
    meta: "2m ago",
    chip: "bg-sky text-ink",
  },
  {
    title: "rateLimit middleware",
    lang: "JS",
    tag: "#auth",
    meta: "1h ago",
    chip: "bg-butter text-ink",
  },
  {
    title: "email regex",
    lang: "RE",
    tag: "#regex",
    meta: "3h ago",
    chip: "bg-blush text-ink",
  },
  {
    title: "fetchWithRetry",
    lang: "TS",
    tag: "#fetch",
    meta: "1d ago",
    chip: "bg-periwinkle text-ink",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.index ?? 0,
            );
            setActive(index);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-x-clip py-[84px] sm:py-[120px]">
      <div className="wrap">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Three steps to a tidy{" "}
              <span className="accent-serif">code brain</span>
            </>
          }
          description="No setup rituals, no tagging spreadsheets. Capture it once and CodeVault handles the rest."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
          {/* sticky stage */}
          <div className="lg:sticky lg:top-[max(84px,50vh-240px)]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div
                aria-hidden
                className="halo absolute -inset-x-10 -top-8 bottom-0 opacity-25"
              />
              <div className="relative rounded-[26px] bg-gradient-to-br from-sky/45 via-panel to-blush/30 p-2.5 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_6%,transparent),0_40px_70px_-40px_color-mix(in_srgb,var(--foreground)_30%,transparent)] dark:from-sky/15 dark:via-panel dark:to-blush/12">
                <div className="overflow-hidden rounded-[18px] bg-card shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-none">
                  {/* window bar */}
                  <div className="flex items-center gap-2 border-b border-line bg-panel/80 px-4 py-3 backdrop-blur">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-blush" />
                      <span className="size-2.5 rounded-full bg-butter" />
                      <span className="size-2.5 rounded-full bg-success/80" />
                    </div>
                    <span className="ml-2 font-rounded text-[12px] font-semibold text-soft">
                      CodeVault
                    </span>
                    <span className="font-rounded text-[12px] text-soft/40">/</span>
                    <span className="font-rounded text-[12px] font-semibold text-foreground/80">
                      My snippets
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 font-rounded text-[10px] font-bold text-success">
                      <span className="size-1 rounded-full bg-success" />
                      Synced
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="mb-3 flex h-10 items-center gap-2 rounded-xl bg-panel px-3 text-soft shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]">
                      <Search className="size-4" />
                      <span className="font-rounded text-[13px] font-medium">
                        Search title, language, or #tag…
                      </span>
                      <span className="ml-auto rounded-md bg-card px-1.5 py-0.5 font-mono text-[10px] font-semibold text-soft shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                        ⌘K
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-foreground px-2.5 py-1 font-rounded text-[10px] font-bold text-background">
                        All
                      </span>
                      <span className="rounded-full bg-panel px-2.5 py-1 font-rounded text-[10px] font-semibold text-soft">
                        #react
                      </span>
                      <span className="rounded-full bg-panel px-2.5 py-1 font-rounded text-[10px] font-semibold text-soft">
                        #auth
                      </span>
                      <span className="ml-auto font-rounded text-[10.5px] font-medium text-soft/70">
                        4 snippets
                      </span>
                    </div>

                    <div className="grid gap-1.5">
                      {mockRows.map((row, index) => (
                        <motion.div
                          key={row.title}
                          initial={false}
                          animate={{
                            opacity: index === active ? 1 : 0.62,
                            scale: index === active ? 1 : 0.985,
                            y: index === active ? 0 : 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300",
                            index === active
                              ? "bg-panel shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent),0_12px_26px_-20px_color-mix(in_srgb,var(--foreground)_40%,transparent)]"
                              : "hover:bg-panel/60",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity duration-300",
                              index === active ? "bg-success opacity-100" : "opacity-0",
                            )}
                          />
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-xl font-mono text-[10px] font-bold shadow-[inset_0_0_0_1px_rgba(11,11,15,0.06)]",
                              row.chip,
                            )}
                          >
                            {row.lang}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold text-foreground">
                              {row.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5 font-rounded text-[11px] font-medium text-soft">
                              <span>{row.tag}</span>
                              <span className="text-soft/35">·</span>
                              <span className="text-soft/70">{row.meta}</span>
                            </span>
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-lg px-2 py-1 font-rounded text-[10.5px] font-semibold transition-all duration-300",
                              index === active
                                ? "bg-card text-foreground shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent)]"
                                : "text-soft/70 group-hover:text-soft",
                            )}
                          >
                            <Copy className="size-3" />
                            Copy
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 font-rounded text-[10.5px] font-medium text-soft/70">
                      <Check className="size-3 text-success" />
                      All changes saved
                      <span className="ml-auto inline-flex items-center gap-1">
                        <span className="size-1 rounded-full bg-sky" />
                        <span className="size-1 rounded-full bg-blush" />
                        <span className="size-1 rounded-full bg-butter" />
                        12 tags
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* chapters */}
          <div className="relative lg:pl-16">
            <div
              aria-hidden
              className="absolute bottom-16 left-[17px] top-16 hidden w-[2px] rounded bg-line lg:block"
            >
              <div
                className="w-full rounded bg-foreground transition-all duration-500"
                style={{
                  height: `${((active + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            <motion.div
              variants={staggerContainer(0.12)}
              {...inViewProps}
              className="flex flex-col"
            >
              {steps.map(
                ({ icon: Icon, step, title, description, note }, index) => (
                  <motion.div
                    key={step}
                    variants={fadeUp}
                    data-index={index}
                    ref={(node) => {
                      chapterRefs.current[index] = node;
                    }}
                    className={cn(
                      "relative flex min-h-[42vh] flex-col justify-center py-8 transition-opacity duration-500 lg:min-h-[56vh]",
                      active === index ? "opacity-100" : "lg:opacity-45",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute -left-16 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full font-rounded text-[13px] font-bold transition-all duration-500 lg:grid",
                        active === index
                          ? "bg-foreground text-background shadow-[0_0_0_6px_var(--background),0_0_0_8px_rgba(250,140,143,0.5)]"
                          : "bg-background text-soft shadow-[inset_0_0_0_1.5px_rgba(11,11,15,0.16),0_0_0_6px_var(--background)]",
                      )}
                    >
                      {step}
                    </span>

                    <span className="mb-3 flex items-center gap-2 font-rounded text-[14px] font-semibold text-soft">
                      <Icon className="size-4" strokeWidth={1.9} />
                      Step {step}
                    </span>
                    <h3 className="text-[clamp(28px,3.3vw,44px)] font-bold leading-[1.04] tracking-[-0.045em] text-foreground">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-[420px] text-[18px] leading-relaxed text-soft">
                      {description}
                    </p>
                    <p className="mt-3 max-w-[420px] font-rounded text-[14.5px] font-medium text-soft/80">
                      {note}
                    </p>
                  </motion.div>
                ),
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
