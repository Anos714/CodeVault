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
 * Left: brand panel with the logo, tagline, and floating code-blocks.
 * Right: the form area (children), centered.
 */
export function AuthSplit({ children }: AuthSplitProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ---------- brand panel ---------- */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card/30 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dots mask-fade opacity-40" />
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-8, 12, -8] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
          />
          <motion.div
            animate={{ x: [16, -16, 16], y: [10, -10, 10] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-syntax-function/10 blur-3xl"
          />
        </div>

        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to CodeVault
        </Link>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          className="flex max-w-md flex-col gap-6"
        >
          <motion.div variants={fadeUp}>
            <Logo markClassName="size-12" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl"
          >
            The developer&apos;s{" "}
            <span className="text-gradient-brand">second brain</span> for code.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Save a snippet once, tag it, and find it in seconds — with a Monaco
            editor, instant search, and one-click copy.
          </motion.p>

          <motion.ul
            variants={fadeUp}
            className="flex flex-col gap-3 pt-2 text-sm text-muted-foreground"
          >
            {[
              "Monaco-grade editing, in the browser",
              "Search by title, language, or tag",
              "Private by default, public when you choose",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <p className="font-mono text-xs text-muted-foreground/60">
          MIT licensed · open source · self-hostable
        </p>
      </div>

      {/* ---------- form panel ---------- */}
      <div className="relative flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-30 lg:hidden" />
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
