"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { LogoMark } from "@/components/brand/logo";
import { fadeUp, staggerContainer, inViewProps } from "@/lib/motion";

export function CTA() {
  return (
    <section className="relative pb-7 pt-[84px] sm:pt-[120px]">
      <div className="wrap">
        <motion.div
          variants={staggerContainer(0.1)}
          {...inViewProps}
          className="hills-card relative flex flex-col items-center overflow-clip rounded-[40px] px-6 pb-24 pt-[clamp(90px,13vw,130px)] text-center text-white"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-[24px] bg-white/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md"
          >
            <LogoMark className="size-16 text-[#0b0b0f]" animated />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-10 max-w-3xl text-balance text-[clamp(34px,5.2vw,64px)] font-bold leading-[1.02] tracking-[-0.05em] text-white [text-shadow:0_2px_26px_rgba(6,56,140,0.35)]"
          >
            Stop rewriting code.{" "}
            <span className="accent-serif">Start reusing it.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-pretty text-[clamp(16px,1.9vw,19px)] leading-relaxed text-white/90"
          >
            Your future self will thank you. Vault your first snippet in under a
            minute — free, open source, and no credit card in sight.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/auth"
              className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-white px-7 text-[16.5px] font-semibold text-black shadow-[0_10px_26px_-12px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
            >
              Open the app
              <ArrowRight className="size-[18px]" />
            </Link>
            <a
              href="https://github.com/Anos714/CodeVault"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-white/15 px-7 text-[16.5px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25"
            >
              <FaGithub className="size-[18px]" />
              Star on GitHub
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-4 font-rounded text-[13.5px] font-medium text-white/75"
          >
            MIT licensed · self-hostable · your code stays yours
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
