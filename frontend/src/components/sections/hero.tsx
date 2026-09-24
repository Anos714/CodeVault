"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { CodeWindow } from "@/components/site/code-window";
import { demoSnippets } from "@/lib/snippets";
import { fadeUp, staggerContainer, easeOutExpo } from "@/lib/motion";

const float = (duration: number, delay = 0, distance = 10) => ({
  animate: {
    y: [0, -distance, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
});

export function Hero() {
  const snippet = demoSnippets.javascript;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade opacity-70" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 glow-brand" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        {/* copy */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-6"
        >
          <motion.a
            href="https://github.com/Anos714/CodeVault"
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pl-1.5 pr-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-primary">
              <Star className="size-3 fill-current" /> Open source
            </span>
            MIT licensed, built in public
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            The developer&apos;s{" "}
            <span className="text-gradient-brand">second brain</span> for code.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            CodeVault is the calm, syntax-aware home for the snippets you keep
            rewriting. Save it once, tag it, and find it in seconds — with a
            Monaco editor and one-click copy.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-11 gap-2 rounded-full px-6 text-[0.92rem]"
              render={<Link href="/snippets" />}
            >
              Open the app
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 gap-2 rounded-full px-6 text-[0.92rem]"
              render={
                <a
                  href="https://github.com/Anos714/CodeVault"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <FaGithub className="size-4" /> Star on GitHub
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 font-mono text-xs text-muted-foreground/80"
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              Monaco editor
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-syntax-function" />
              Instant search
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-syntax-keyword" />
              Public or private
            </span>
          </motion.div>
        </motion.div>

        {/* visual */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
            className="relative"
          >
            <motion.div {...float(7, 0.4, 8)} className="relative">
              <CodeWindow
                filename={snippet.filename}
                lines={snippet.lines}
                typing
                loop
              />
            </motion.div>

            {/* floating syntax chips */}
            <motion.span
              {...float(5.5, 1.2, 12)}
              className="absolute -left-6 -top-5 hidden rounded-lg border border-border bg-card/90 px-2.5 py-1.5 font-mono text-xs text-syntax-keyword shadow-lg backdrop-blur sm:block"
            >
              {"{ }"}
            </motion.span>
            <motion.span
              {...float(6.5, 0.6, 10)}
              className="absolute -right-4 top-1/4 hidden rounded-lg border border-border bg-card/90 px-2.5 py-1.5 font-mono text-xs text-syntax-function shadow-lg backdrop-blur sm:block"
            >
              {"</>"}
            </motion.span>
            <motion.span
              {...float(6, 1.8, 14)}
              className="absolute -bottom-6 left-6 hidden rounded-lg border border-border bg-card/90 px-2.5 py-1.5 font-mono text-xs text-primary shadow-lg backdrop-blur sm:block"
            >
              #auth
            </motion.span>
          </motion.div>

          {/* soft shadow base */}
          <div className="absolute -bottom-10 left-1/2 -z-10 h-24 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
