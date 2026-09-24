"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import { Code2, Copy, Lock, Search, SunMoon, Tag } from "lucide-react";
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

type Accent = {
  /** accent text color */
  text: string;
  /** soft tint behind the art */
  tint: string;
  /** hover border color */
  border: string;
  /** glow blob color */
  glow: string;
  /** gradient line color */
  line: string;
};

const accents: Record<string, Accent> = {
  primary: {
    text: "text-primary",
    tint: "bg-primary/[0.06]",
    border: "group-hover:border-primary/40",
    glow: "bg-primary/25",
    line: "via-primary",
  },
  function: {
    text: "text-syntax-function",
    tint: "bg-syntax-function/[0.06]",
    border: "group-hover:border-syntax-function/40",
    glow: "bg-syntax-function/25",
    line: "via-syntax-function",
  },
  keyword: {
    text: "text-syntax-keyword",
    tint: "bg-syntax-keyword/[0.06]",
    border: "group-hover:border-syntax-keyword/40",
    glow: "bg-syntax-keyword/25",
    line: "via-syntax-keyword",
  },
  string: {
    text: "text-syntax-string",
    tint: "bg-syntax-string/[0.06]",
    border: "group-hover:border-syntax-string/40",
    glow: "bg-syntax-string/25",
    line: "via-syntax-string",
  },
  number: {
    text: "text-syntax-number",
    tint: "bg-syntax-number/[0.06]",
    border: "group-hover:border-syntax-number/40",
    glow: "bg-syntax-number/25",
    line: "via-syntax-number",
  },
};

type Feature = {
  title: string;
  description: string;
  art: ComponentType;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconLabel: string;
  accent: Accent;
  span: string;
};

const features: Feature[] = [
  {
    title: "A Monaco editor, in your browser",
    description:
      "The same engine that powers VS Code — real syntax highlighting, indentation, and instant language switching.",
    art: EditorArt,
    icon: Code2,
    iconLabel: "Editor",
    accent: accents.function,
    span: "sm:col-span-2 md:col-span-4",
  },
  {
    title: "Search that actually finds it",
    description: "Match on title, language, description, or tags.",
    art: SearchArt,
    icon: Search,
    iconLabel: "Search",
    accent: accents.primary,
    span: "md:col-span-2",
  },
  {
    title: "Tags, not folders",
    description: "Organize flat and fast with #tags that travel with your code.",
    art: TagArt,
    icon: Tag,
    iconLabel: "Tags",
    accent: accents.keyword,
    span: "md:col-span-2",
  },
  {
    title: "Private by default",
    description: "Keep snippets to yourself, or flip one switch to share.",
    art: ShieldArt,
    icon: Lock,
    iconLabel: "Privacy",
    accent: accents.number,
    span: "md:col-span-4",
  },
  {
    title: "Copy, don't rewrite",
    description: "One click and the snippet is on your clipboard, ready to ship.",
    art: CopyArt,
    icon: Copy,
    iconLabel: "Copy",
    accent: accents.string,
    span: "md:col-span-2",
  },
  {
    title: "Calm by day, focused by night",
    description:
      "A quiet light theme and a deep dark one — both tuned for long reading sessions.",
    art: ThemeArt,
    icon: SunMoon,
    iconLabel: "Themes",
    accent: accents.primary,
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
          {features.map(
            ({ title, description, art: Art, icon: Icon, iconLabel, accent, span }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-5 transition-colors",
                  accent.border,
                  "hover:bg-card",
                  span,
                )}
              >
                {/* accent glow */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                    accent.glow,
                  )}
                />

                {/* top accent line on hover */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    accent.line,
                  )}
                />

                <div
                  className={cn(
                    "relative mb-5 flex h-24 items-center justify-center overflow-hidden rounded-xl border border-border",
                    accent.tint,
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
                  <div className="relative h-full w-full p-3">
                    <Art />
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/60",
                      accent.text,
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.9} />
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/70">
                    {iconLabel}
                  </span>
                </div>

                <h3 className="mb-1.5 text-[1.02rem] font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
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
