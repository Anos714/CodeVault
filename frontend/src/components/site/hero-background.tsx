"use client";

import { motion } from "motion/react";

/**
 * Hero backdrop — floating, layered code-blocks that echo the CodeVault logo
 * mark. Kept very low-contrast so it stays calm and never competes with the
 * foreground content.
 */
export function HeroBackground() {
  const blocks = [
    {
      x: 4,
      y: 12,
      delay: 0,
      duration: 13,
      className: "rotate-[-6deg]",
      opacity: 0.5,
    },
    {
      x: 78,
      y: 8,
      delay: 1.4,
      duration: 15,
      className: "rotate-[5deg] scale-90",
      opacity: 0.4,
    },
    {
      x: 14,
      y: 62,
      delay: 0.8,
      duration: 16,
      className: "rotate-[4deg] scale-75",
      opacity: 0.32,
    },
    {
      x: 66,
      y: 58,
      delay: 2.1,
      duration: 12,
      className: "rotate-[-4deg] scale-[0.6]",
      opacity: 0.26,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* soft vignette base */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 glow-brand" />

      {blocks.map((block, i) => (
        <motion.div
          key={i}
          className={`absolute left-0 top-0 ${block.className}`}
          style={{ x: `${block.x}vw`, y: `${block.y}vh`, opacity: block.opacity }}
          animate={{ y: [`${block.y}vh`, `calc(${block.y}vh - 22px)`, `${block.y}vh`] }}
          transition={{
            duration: block.duration,
            delay: block.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        >
          <svg
            width="180"
            height="120"
            viewBox="0 0 180 120"
            fill="none"
            className="fill-card stroke-foreground/10"
          >
            <rect x="6" y="22" width="150" height="88" rx="10" strokeWidth="1" />
            <rect
              x="14"
              y="14"
              width="150"
              height="88"
              rx="10"
              strokeWidth="1"
              className="fill-secondary/30"
            />
            <circle cx="26" cy="28" r="2.5" className="fill-syntax-number/60" />
            <circle cx="36" cy="28" r="2.5" className="fill-primary/60" />
            <circle cx="46" cy="28" r="2.5" className="fill-syntax-function/60" />
            <rect x="26" y="44" width="70" height="5" rx="2.5" className="fill-syntax-function/35" />
            <rect x="26" y="58" width="104" height="5" rx="2.5" className="fill-syntax-string/30" />
            <rect x="40" y="72" width="76" height="5" rx="2.5" className="fill-syntax-keyword/30" />
            <rect x="40" y="86" width="52" height="5" rx="2.5" className="fill-foreground/15" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
