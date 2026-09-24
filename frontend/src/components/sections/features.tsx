"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import {
  CopyArt,
  EditorArt,
  SearchArt,
  ShieldArt,
  TagArt,
  ThemeArt,
} from "@/components/site/feature-art";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  description: string;
  art: ComponentType;
  span: string;
};

const features: Feature[] = [
  {
    title: "A Monaco editor, in your browser",
    description:
      "The same engine that powers VS Code — real syntax highlighting, indentation, and instant language switching.",
    art: EditorArt,
    span: "sm:col-span-2 md:col-span-4",
  },
  {
    title: "Search that actually finds it",
    description: "Match on title, language, description, or tags.",
    art: SearchArt,
    span: "md:col-span-2",
  },
  {
    title: "Tags, not folders",
    description: "Organize flat and fast with #tags that travel with your code.",
    art: TagArt,
    span: "md:col-span-2",
  },
  {
    title: "Private by default",
    description: "Keep snippets to yourself, or flip one switch to share.",
    art: ShieldArt,
    span: "md:col-span-2",
  },
  {
    title: "Copy, don't rewrite",
    description: "One click and the snippet is on your clipboard, ready to ship.",
    art: CopyArt,
    span: "md:col-span-2",
  },
  {
    title: "Calm by day, focused by night",
    description:
      "A quiet light theme and a deep dark one — both tuned for long reading sessions.",
    art: ThemeArt,
    span: "sm:col-span-2 md:col-span-4",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-50" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need.{" "}
              <span className="text-primary">Nothing you don&apos;t.</span>
            </>
          }
          description="CodeVault does one job extremely well — it keeps your code findable."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          {...inViewProps}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
        >
          {features.map(({ title, description, art: Art, span }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/30 hover:bg-card",
                span,
              )}
            >
              <div className="relative mb-5 flex h-24 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 text-foreground">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
                <div className="relative h-full w-full p-3">
                  <Art />
                </div>
              </div>

              <h3 className="mb-1.5 text-[1.02rem] font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
