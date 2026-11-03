"use client";

import { AnimatePresence, motion } from "motion/react";
import { CodeWindow } from "@/components/site/code-window";
import { SectionHeading } from "@/components/site/section-heading";
import { demoSnippets, type DemoLanguage } from "@/lib/snippets";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

const languages: DemoLanguage[] = ["javascript", "typescript", "python"];

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
      </div>
    </section>
  );
}
