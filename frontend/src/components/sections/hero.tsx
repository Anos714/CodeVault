"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { LogoMark } from "@/components/brand/logo";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden />
      <div className="hero-shade" aria-hidden />

      <motion.div
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full flex-col items-center px-6 pb-10 pt-[clamp(92px,13vh,132px)]"
      >
        <motion.a
          variants={fadeUp}
          href="#extensions"
          className="kicker group inline-flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-75"
        >
          CodeVault — now on Chrome &amp; VS Code
          <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1 variants={fadeUp} className="hero-title mt-3">
          <span className="line">Your code,</span>{" "}
          <span className="line accent">remembered.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="hero-sub">
          The calm, syntax-aware home for the snippets you keep rewriting. Save
          once, tag it, and find it in seconds — right where you code.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-[clamp(16px,3vh,30px)] flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/auth"
            className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-white px-7 text-[16.5px] font-semibold text-black shadow-[0_10px_26px_-12px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
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

        <motion.p variants={fadeUp} className="hero-fine">
          Free · open source · works everywhere you code
        </motion.p>

        {/* mascot / product hint */}
        <motion.div
          variants={fadeUp}
          className="mt-[clamp(18px,3.4vh,34px)] grid justify-items-center gap-3"
        >
          <div className="relative grid place-items-center">
            <div
              aria-hidden
              className="halo absolute size-52 opacity-50 sm:size-64"
            />
            <div className="relative rounded-[26px] bg-white/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_50px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <LogoMark
                className="size-[clamp(64px,11vh,96px)] text-[#0b0b0f]"
                animated
              />
            </div>
          </div>

          <Link
            href="/dashboard"
            aria-label="Open CodeVault and search your vault"
            className="inline-flex h-[52px] items-center gap-3 rounded-full bg-gradient-to-b from-[#303030] to-[#171717] px-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_40px_-18px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-white/12 text-white/85">
              <Search className="size-4" />
            </span>
            <span className="grid leading-tight">
              <span className="font-rounded text-[13px] font-semibold text-white">
                Search your vault
              </span>
              <span className="font-rounded text-[11px] font-medium text-white/60">
                #auth · #regex · #fetch
              </span>
            </span>
            <span className="ml-1 rounded-md bg-white/12 px-1.5 py-1 font-mono text-[10px] font-semibold text-white/75">
              ⌘K
            </span>
          </Link>
        </motion.div>

        <motion.a
          variants={fadeUp}
          href="#features"
          className="hero-hint mt-auto inline-flex items-center gap-2 pt-8 transition-opacity hover:opacity-100"
        >
          <ArrowDown className="size-4" />
          Scroll to explore
        </motion.a>
      </motion.div>
    </section>
  );
}
