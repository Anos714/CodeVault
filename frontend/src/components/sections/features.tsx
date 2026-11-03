"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
import { Code2, Copy, Lock, Search, SunMoon, Tag } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import {
  CopyVisual,
  EditorVisual,
  PrivacyVisual,
  SearchVisual,
  TagsVisual,
  ThemeVisual,
} from "@/components/site/feature-visuals";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  description: string;
  visual: ComponentType;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  iconLabel: string;
  chip: string;
  span: string;
};

const features: Feature[] = [
  {
    title: "A real editor, in your browser",
    description:
      "The same engine that powers VS Code — real syntax highlighting, indentation, and instant language switching.",
    visual: EditorVisual,
    icon: Code2,
    iconLabel: "Editor",
    chip: "bg-sky/70 text-ink",
    span: "sm:col-span-2 lg:col-span-4",
  },
  {
    title: "Search that actually finds it",
    description: "Match on title, language, description, or tags.",
    visual: SearchVisual,
    icon: Search,
    iconLabel: "Search",
    chip: "bg-butter/80 text-ink",
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    title: "Tags, not folders",
    description: "Organize flat and fast with #tags that travel with your code.",
    visual: TagsVisual,
    icon: Tag,
    iconLabel: "Tags",
    chip: "bg-blush/60 text-ink",
    span: "lg:col-span-2",
  },
  {
    title: "Private by default",
    description: "Keep snippets to yourself, or flip one switch to share.",
    visual: PrivacyVisual,
    icon: Lock,
    iconLabel: "Privacy",
    chip: "bg-aqua/70 text-ink",
    span: "lg:col-span-2",
  },
  {
    title: "Copy, don't rewrite",
    description: "One click and it's on your clipboard — ready to ship.",
    visual: CopyVisual,
    icon: Copy,
    iconLabel: "Copy",
    chip: "bg-periwinkle/70 text-ink",
    span: "lg:col-span-2",
  },
  {
    title: "Calm by day, focused by night",
    description:
      "A quiet light theme and a deep dark one — both tuned for long reading sessions.",
    visual: ThemeVisual,
    icon: SunMoon,
    iconLabel: "Themes",
    chip: "bg-success/15 text-success",
    span: "sm:col-span-2 lg:col-span-6",
  },
];

function FeatureCard({
  title,
  description,
  visual: Visual,
  icon: Icon,
  iconLabel,
  chip,
  span,
  wide = false,
}: Feature & { wide?: boolean }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[30px] bg-panel p-5 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_5%,transparent)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_color-mix(in_srgb,var(--foreground)_45%,transparent)] sm:p-6",
        span,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent opacity-70 dark:from-white/[0.04]"
      />

      <div
        className={cn(
          "relative",
          wide
            ? "flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8"
            : "flex flex-1 flex-col",
        )}
      >
        <div className={cn("relative", wide ? "flex-1 lg:order-2" : "flex-1")}>
          <Visual />
        </div>

        <div
          className={cn(
            "relative mt-6",
            wide && "lg:mt-0 lg:w-[38%] lg:shrink-0",
          )}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl",
                chip,
              )}
            >
              <Icon className="size-4" strokeWidth={2} />
            </span>
            <span className="font-rounded text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
              {iconLabel}
            </span>
          </div>

          <h3 className="mb-1.5 text-[21px] font-[650] leading-[1.15] tracking-[-0.03em] text-foreground">
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-soft">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-[84px] sm:py-[120px]">
      <div className="wrap">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need.{" "}
              <span className="accent-serif">Nothing you don&apos;t.</span>
            </>
          }
          description="CodeVault does one job extremely well — it keeps your code findable."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          {...inViewProps}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} wide={feature.span.endsWith("col-span-6")} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
