"use client";

import { motion } from "motion/react";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  tint: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I used to grep old repos for that one middleware I wrote last year. Now it's two keystrokes and a copy away.",
    name: "Aarav Mehta",
    role: "Backend Engineer",
    initials: "AM",
    accent: "bg-butter",
    tint: "from-butter/30",
  },
  {
    quote:
      "The Monaco editor sold me. It feels like VS Code, but the snippet is already organized the moment I save it.",
    name: "Sofia Lindqvist",
    role: "Full-stack Developer",
    initials: "SL",
    accent: "bg-sky",
    tint: "from-sky/30",
  },
  {
    quote:
      "Tagging instead of folders is the right call. My regex collection finally has a home that isn't a sticky note.",
    name: "Dev Patel",
    role: "Frontend Engineer",
    initials: "DP",
    accent: "bg-blush",
    tint: "from-blush/30",
  },
  {
    quote:
      "Private by default is exactly the default I wanted. Sharing is a switch, not a migration.",
    name: "Marta Oliveira",
    role: "Staff Engineer",
    initials: "MO",
    accent: "bg-periwinkle",
    tint: "from-periwinkle/30",
  },
  {
    quote:
      "Onboarding took four minutes. Four minutes later my whole team had a shared library of interview snippets.",
    name: "Kenji Watanabe",
    role: "Engineering Lead",
    initials: "KW",
    accent: "bg-aqua",
    tint: "from-aqua/30",
  },
];

function Stars() {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-syntax-number"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="size-3 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

function Card({ quote, name, role, initials, accent, tint }: Testimonial) {
  return (
    <figure
      className={cn(
        "group relative mb-4 break-inside-avoid overflow-hidden rounded-[26px] bg-gradient-to-br via-panel to-panel p-6 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_5%,transparent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-36px_color-mix(in_srgb,var(--foreground)_40%,transparent)]",
        tint,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          tint,
        )}
      />
      <Quote
        aria-hidden
        className="pointer-events-none absolute right-5 top-5 size-7 text-ink/[0.07]"
        strokeWidth={1.5}
      />

      <div className="relative flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full font-rounded text-[13px] font-bold text-ink shadow-[inset_0_0_0_1px_rgba(11,11,15,0.08)]",
            accent,
          )}
        >
          {initials}
        </span>
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-[15.5px] font-[650] tracking-[-0.02em] text-foreground">
            {name}
          </span>
          <span className="truncate font-rounded text-[13.5px] font-medium text-soft">
            {role}
          </span>
        </span>
      </div>

      <blockquote className="relative mt-4 text-pretty text-[16px] leading-[1.5] text-foreground">
        {quote}
      </blockquote>

      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 font-rounded text-[11.5px] font-semibold text-soft">
          <BadgeCheck className="size-3.5 text-success" />
          Early CodeVault user
        </span>
        <Stars />
      </div>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-[84px] sm:py-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-80 bg-gradient-to-r from-sky/10 via-blush/10 to-butter/10 blur-3xl dark:from-sky/5 dark:via-blush/5 dark:to-butter/5"
      />
      <div className="wrap">
        <SectionHeading
          eyebrow="Loved by developers"
          title={
            <>
              Built for people who{" "}
              <span className="accent-serif">write code daily</span>
            </>
          }
          description="A few words from early users of CodeVault."
        />

        <motion.div
          variants={staggerContainer(0.07)}
          {...inViewProps}
          className="mt-12 columns-1 gap-4 md:columns-2 lg:columns-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card {...t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
