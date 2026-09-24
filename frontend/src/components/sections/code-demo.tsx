"use client";

import { motion } from "motion/react";
import { Tag, Search, Wand2 } from "lucide-react";
import { CodeWindow } from "@/components/site/code-window";
import { SectionHeading } from "@/components/site/section-heading";
import { demoSnippets, type DemoLanguage } from "@/lib/snippets";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, inViewProps, easeOutExpo } from "@/lib/motion";

const languages: DemoLanguage[] = ["javascript", "typescript", "python"];

const steps = [
  {
    icon: Wand2,
    title: "Write or paste",
    description:
      "A Monaco-grade editor with the syntax you already love — indentation, highlighting, the works.",
    accent: "text-syntax-function",
  },
  {
    icon: Tag,
    title: "Tag & organize",
    description:
      "Group snippets with tags like #auth or #regex. Make them public to share, or keep them private.",
    accent: "text-syntax-keyword",
  },
  {
    icon: Search,
    title: "Search & reuse",
    description:
      "Find anything by title, language, or tag. Copy it in one click and ship. Never rewrite it again.",
    accent: "text-primary",
  },
];

export function CodeDemo() {
  const activeDemoLanguage = useUIStore((s) => s.activeDemoLanguage);
  const setActiveDemoLanguage = useUIStore((s) => s.setActiveDemoLanguage);
  const snippet = demoSnippets[activeDemoLanguage];

  return (
    <section id="demo" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Interactive demo"
          title={
            <>
              The same utility, <span className="text-primary">three vaults</span>
            </>
          }
          description="Switch the language and watch it type. Every snippet is stored exactly like this — ready to search and copy."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* editor + tabs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setActiveDemoLanguage(language)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-xs transition-all",
                    activeDemoLanguage === language
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {demoSnippets[language].label}
                </button>
              ))}
            </div>

            <CodeWindow
              key={activeDemoLanguage}
              filename={snippet.filename}
              lines={snippet.lines}
              typing
            />
          </motion.div>

          {/* steps */}
          <motion.div
            variants={staggerContainer(0.12)}
            {...inViewProps}
            className="flex flex-col gap-4"
          >
            {steps.map(({ icon: Icon, title, description, accent }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group flex gap-4 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/30 hover:bg-card"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 transition-colors group-hover:bg-primary/10">
                  <Icon className={cn("size-5", accent)} strokeWidth={1.75} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[0.98rem] font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
