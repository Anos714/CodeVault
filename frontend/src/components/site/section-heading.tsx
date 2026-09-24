"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer(0.09)}
      {...inViewProps}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={fadeUp}
        className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUp}
          className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
