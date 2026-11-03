"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check, CornerDownLeft, Search } from "lucide-react";
import { SiGooglechrome } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

const perks = [
  { icon: Check, label: "Save any selection" },
  { icon: Search, label: "Search your vault" },
  { icon: CornerDownLeft, label: "Insert at cursor" },
];

const clients = [
  {
    name: "Chrome extension",
    description: "Save selections from any page",
    href: "https://github.com/Anos714/CodeVault/tree/main/chrome-extension",
    icon: SiGooglechrome,
    chip: "bg-sky/70 text-ink",
    ring: "hover:ring-sky/50",
  },
  {
    name: "VS Code extension",
    description: "Insert snippets at your cursor",
    href: "https://github.com/Anos714/CodeVault/tree/main/vscode-extension",
    icon: VscVscode,
    chip: "bg-aqua/70 text-ink",
    ring: "hover:ring-aqua/50",
  },
];

export function Extensions() {
  return (
    <section
      id="extensions"
      className="relative scroll-mt-24 py-[84px] sm:py-[120px]"
    >
      <div className="wrap">
        <motion.div
          variants={staggerContainer(0.08)}
          {...inViewProps}
          className="relative overflow-hidden rounded-[36px] bg-panel p-6 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_5%,transparent)] sm:p-9 lg:p-11"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky/20 via-transparent to-blush/20 dark:from-sky/8 dark:to-blush/8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-sky/25 blur-3xl dark:bg-sky/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-butter/20 blur-3xl dark:bg-butter/8"
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12">
            <div>
              <motion.span variants={fadeUp} className="eyebrow">
                Extensions
              </motion.span>

              <motion.h2
                variants={fadeUp}
                className="mt-3 max-w-xl text-[clamp(30px,4vw,46px)] font-bold leading-[1.04] tracking-[-0.045em] text-foreground"
              >
                Use CodeVault{" "}
                <span className="accent-serif">where you code.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-lg text-pretty text-[16.5px] leading-relaxed text-soft"
              >
                Save a selection, search your vault, and drop snippets straight
                into Chrome or VS Code — same account, no context switch.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-5 flex flex-wrap gap-2"
              >
                {perks.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 font-rounded text-[12px] font-semibold text-soft shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_6%,transparent)] backdrop-blur"
                  >
                    <Icon className="size-3.5 text-success" strokeWidth={2.4} />
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="grid gap-3">
              {clients.map(
                ({ name, description, href, icon: Icon, chip, ring }) => (
                  <motion.a
                    key={name}
                    variants={fadeUp}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-2 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-28px_color-mix(in_srgb,var(--foreground)_45%,transparent)]",
                      ring,
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-xl shadow-[inset_0_0_0_1px_rgba(11,11,15,0.06)]",
                        chip,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-foreground">
                        {name}
                      </span>
                      <span className="block truncate font-rounded text-[12px] font-medium text-soft">
                        {description}
                      </span>
                    </span>

                    <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-foreground px-2.5 font-rounded text-[11.5px] font-bold text-background transition-transform duration-300 group-hover:-translate-y-0.5">
                      Get
                      <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </motion.a>
                ),
              )}

              <motion.p
                variants={fadeUp}
                className="px-1 font-rounded text-[11.5px] font-medium text-soft/80"
              >
                Connect with a personal access token from Settings → API tokens.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
