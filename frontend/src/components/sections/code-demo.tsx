"use client";

import { AnimatePresence, motion } from "motion/react";
import { Tag, Search, Wand2 } from "lucide-react";
import { CodeWindow } from "@/components/site/code-window";
import { SectionHeading } from "@/components/site/section-heading";
import { demoSnippets, type DemoLanguage } from "@/lib/snippets";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  inViewProps,
  easeOutExpo,
} from "@/lib/motion";

const languages: DemoLanguage[] = ["javascript", "typescript", "python"];

const steps = [
  {
    icon: Wand2,
    number: "01",
    title: "Write or paste",
    description:
      "A Monaco-grade editor with the syntax you already love — indentation, highlighting, the works.",
    label: "text-syntax-function",
    chip: "bg-sky/70 text-ink",
    glow: "from-sky/50",
  },
  {
    icon: Tag,
    number: "02",
    title: "Tag & organize",
    description:
      "Group snippets with tags like #auth or #regex. Make them public to share, or keep them private.",
    label: "text-syntax-keyword",
    chip: "bg-blush/60 text-ink",
    glow: "from-blush/45",
  },
  {
    icon: Search,
    number: "03",
    title: "Search & reuse",
    description:
      "Find anything by title, language, or tag. Copy it in one click and ship. Never rewrite it again.",
    label: "text-syntax-string",
    chip: "bg-butter/80 text-ink",
    glow: "from-butter/55",
  },
];

export function CodeDemo() {
  const activeDemoLanguage = useUIStore((s) => s.activeDemoLanguage);
  const setActiveDemoLanguage = useUIStore((s) => s.setActiveDemoLanguage);
  const snippet = demoSnippets[activeDemoLanguage];

  return (
    <section id="demo" className="relative scroll-mt-24 py-[84px] sm:py-[120px]">
      <div className="wrap">
        <SectionHeading
          eyebrow="Interactive demo"
          title={
            <>
              The same utility,{" "}
              <span className="accent-serif">three vaults</span>
            </>
          }
          description="Switch the language and watch it type. Every snippet is stored exactly like this — ready to search and copy."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="mx-auto mt-12 max-w-[1040px]"
        >
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-sky/30 via-transparent to-periwinkle/30 blur-2xl dark:from-sky/10 dark:to-periwinkle/10"
            />

            <div className="rounded-[clamp(20px,2.8vw,34px)] bg-gradient-to-br from-sky/45 via-panel to-periwinkle/40 p-[clamp(8px,1.2vw,14px)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_6%,transparent),0_40px_80px_-50px_color-mix(in_srgb,var(--foreground)_35%,transparent)] dark:from-sky/15 dark:via-panel dark:to-periwinkle/15">
              <div className="overflow-hidden rounded-[clamp(12px,1.9vw,22px)] bg-card">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeDemoLanguage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: easeOutExpo }}
                  >
                    <CodeWindow
                      filename={snippet.filename}
                      lines={snippet.lines}
                      typing
                      className="rounded-none border-0 shadow-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-1.5 pt-5">
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => {
                const active = activeDemoLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setActiveDemoLanguage(language)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[14.5px] font-[550] transition-colors duration-200 active:scale-95",
                      active
                        ? "text-background"
                        : "text-foreground hover:bg-card",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="demo-language-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                      />
                    )}
                    <span className="relative z-10">
                      {demoSnippets[language].label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="inline-flex items-center gap-2 font-rounded text-[14px] font-medium text-soft">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Try it — this is the real editor behaviour.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12)}
          {...inViewProps}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {steps.map(
            ({ icon: Icon, number, title, description, label, chip, glow }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="group relative overflow-hidden rounded-[28px] bg-panel p-7 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_5%,transparent)] transition-shadow duration-300 hover:shadow-[0_28px_50px_-36px_color-mix(in_srgb,var(--foreground)_40%,transparent)]"
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                    glow,
                  )}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-6 top-4 font-rounded text-[46px] font-black leading-none tracking-[-0.06em] text-ink/[0.055]"
                >
                  {number}
                </span>

                <div
                  className={cn(
                    "relative mb-5 flex size-11 items-center justify-center rounded-2xl",
                    chip,
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>

                <span
                  className={cn(
                    "relative font-rounded text-[12px] font-bold uppercase tracking-[0.14em]",
                    label,
                  )}
                >
                  Step {number}
                </span>
                <h3 className="relative mb-2 mt-1 text-[22px] font-[650] tracking-[-0.03em] text-foreground">
                  {title}
                </h3>
                <p className="relative text-[16px] leading-relaxed text-soft">
                  {description}
                </p>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
