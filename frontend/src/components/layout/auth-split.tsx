"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { fadeUp, staggerContainer, easeOutExpo } from "@/lib/motion";

type AuthSplitProps = {
  children: React.ReactNode;
};

/**
 * Shared split-screen shell for the auth pages.
 * Left: a full-bleed hills panel with the brand story.
 * Right: the form area (children), centered on paper.
 */
export function AuthSplit({ children }: AuthSplitProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ---------- brand panel ---------- */}
      <div className="relative hidden overflow-hidden p-3 lg:block">
        <div className="hills-fill relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] p-12 text-white">
          <div className="hero-shade" aria-hidden />

          <Link
            href="/"
            className="relative inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to CodeVault
          </Link>

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="visible"
            className="relative flex max-w-md flex-col gap-6"
          >
            <motion.div variants={fadeUp}>
              <Logo className="text-white" markClassName="size-12" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-balance text-[clamp(32px,3.6vw,46px)] font-bold leading-[1.02] tracking-[-0.05em] text-white [text-shadow:0_2px_26px_rgba(6,56,140,0.35)]"
            >
              Your code,{" "}
              <span className="accent-serif">remembered.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="max-w-sm text-pretty text-base leading-relaxed text-white/85"
            >
              Save a snippet once, tag it, and find it in seconds — with a
              Monaco editor, instant search, and one-click copy.
            </motion.p>

            <motion.ul
              variants={fadeUp}
              className="flex flex-col gap-3 pt-1 text-sm font-medium text-white/90"
            >
              {[
                "Monaco-grade editing, in the browser",
                "Search by title, language, or tag",
                "Private by default, public when you choose",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-5 shrink-0 place-items-center rounded-full bg-white/20"
                  >
                    <span className="size-1.5 rounded-full bg-white" />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <p className="relative font-rounded text-xs font-medium text-white/75 [text-shadow:0_1px_12px_rgba(6,40,70,0.65)]">
            MIT licensed · open source · self-hostable
          </p>
        </div>
      </div>

      {/* ---------- form panel ---------- */}
      <div className="relative flex items-center justify-center bg-background px-5 py-16 sm:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-25 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
