"use client";

import { motion } from "motion/react";
import { FolderTree, PenLine, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Capture",
    description:
      "Paste a snippet or write it fresh in the Monaco editor. Add a title, a note, and pick the language.",
  },
  {
    icon: FolderTree,
    step: "02",
    title: "Organize",
    description:
      "Tag it with #auth, #regex, or whatever fits. Mark it public to share, or keep it private.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Reuse",
    description:
      "Search by title, language, or tag — then copy it in one click. That utility is never lost again.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Three steps to a tidy{" "}
              <span className="text-primary">code brain</span>
            </>
          }
          description="No setup rituals, no tagging spreadsheets. Capture it once and CodeVault handles the rest."
        />

        <div className="relative mt-14">
          {/* connector line with a traveling light pulse (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-9 hidden h-px md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute left-0 top-1/2 h-px w-16 -translate-y-1/2 animate-travel-x bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_var(--primary)]" />
          </div>

          <motion.div
            variants={staggerContainer(0.14)}
            {...inViewProps}
            className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8"
          >
            {steps.map(({ icon: Icon, step, title, description }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex size-18 items-center justify-center rounded-2xl border border-border bg-card">
                  <div className="absolute inset-0 rounded-2xl bg-primary/5" />
                  <Icon className="size-7 text-primary" strokeWidth={1.6} />
                  <span className="absolute -right-2 -top-2.5 rounded-full border border-border bg-background px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
