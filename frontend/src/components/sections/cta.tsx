"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";

export function CTA() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={staggerContainer(0.1)}
          {...inViewProps}
          className="relative flex flex-col items-center gap-7 overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          {/* backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid opacity-50 mask-fade" />
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[520px] -translate-x-1/2 -translate-y-1/2 glow-brand" />
          </div>

          <motion.div variants={fadeUp}>
            <LogoMark className="size-14" animated />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Stop rewriting code.{" "}
            <span className="text-gradient-brand">Start reusing it.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Your future self will thank you. Vault your first snippet in under a
            minute.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-11 gap-2 rounded-full px-7 text-[0.92rem]"
              render={<Link href="/snippets" />}
            >
              Open the app
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 gap-2 rounded-full px-7 text-[0.92rem]"
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
        </motion.div>
      </div>
    </section>
  );
}
