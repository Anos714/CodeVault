"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/site/section-heading";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I used to grep old repos for that one middleware I wrote last year. Now it's two keystrokes and a copy away.",
    name: "Aarav Mehta",
    role: "Backend Engineer",
    initials: "AM",
    accent: "bg-primary/15 text-primary",
  },
  {
    quote:
      "The Monaco editor sold me. It feels like VS Code, but the snippet is already organized the moment I save it.",
    name: "Sofia Lindqvist",
    role: "Full-stack Developer",
    initials: "SL",
    accent: "bg-syntax-keyword/15 text-syntax-keyword",
  },
  {
    quote:
      "Tagging instead of folders is the right call. My regex collection finally has a home that isn't a sticky note.",
    name: "Dev Patel",
    role: "Frontend Engineer",
    initials: "DP",
    accent: "bg-syntax-function/15 text-syntax-function",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Loved by developers"
          title={
            <>
              Built for people who{" "}
              <span className="text-primary">write code daily</span>
            </>
          }
          description="A few words from early users of CodeVault."
        />

        <motion.div
          variants={staggerContainer(0.1)}
          {...inViewProps}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {testimonials.map(({ quote, name, role, initials, accent }) => (
            <motion.figure
              key={name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="flex flex-col gap-4">
                <span
                  className="font-mono text-3xl leading-none text-primary/50"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="text-pretty text-[0.94rem] leading-relaxed text-foreground/90">
                  {quote}
                </blockquote>
              </div>

              <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full font-mono text-xs font-semibold",
                    accent,
                  )}
                >
                  {initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {name}
                  </span>
                  <span className="text-xs text-muted-foreground">{role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
