"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  animated?: boolean;
};

/**
 * CodeVault mark — stacked code blocks forming a vault.
 * Static by default; animates a layered draw-in when `animated`.
 */
export function LogoMark({ className, animated = false }: LogoMarkProps) {
  const layers = [
    {
      y: 29,
      fillOpacity: 0.1,
      strokeOpacity: 0.22,
      className: "stroke-[#2FBF9B] fill-[#2FBF9B]",
    },
    {
      y: 23,
      fillOpacity: 0.16,
      strokeOpacity: 0.32,
      className: "stroke-[#2FBF9B] fill-[#2FBF9B]",
    },
  ];

  const content = (
    <>
      <defs>
        <linearGradient id="cv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F151B" />
          <stop offset="1" stopColor="#182230" />
        </linearGradient>
        <linearGradient id="cv-accent" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2FBF9B" />
          <stop offset="1" stopColor="#5BC0EB" />
        </linearGradient>
        <radialGradient id="cv-glow" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#2FBF9B" stopOpacity="0.3" />
          <stop offset="1" stopColor="#2FBF9B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#cv-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#cv-glow)" />
      <rect
        x="2.75"
        y="2.75"
        width="58.5"
        height="58.5"
        rx="15.25"
        stroke="url(#cv-accent)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />

      {/* stacked layers */}
      {layers.map((layer, i) => (
        <rect
          key={i}
          x="15"
          y={layer.y}
          width="34"
          height="20"
          rx="5"
          fillOpacity={layer.fillOpacity}
          strokeOpacity={layer.strokeOpacity}
          strokeWidth="1.5"
          className={layer.className}
        />
      ))}

      {/* top code window */}
      <rect
        x="15"
        y="17"
        width="34"
        height="21"
        rx="5"
        fill="#0C1116"
        stroke="url(#cv-accent)"
        strokeOpacity="0.85"
        strokeWidth="1.6"
      />
      <circle cx="21.5" cy="23.5" r="1.9" fill="#E8B84B" />
      <circle cx="28" cy="23.5" r="1.9" fill="#2FBF9B" />
      <circle cx="34.5" cy="23.5" r="1.9" fill="#6E9BE8" />
      <rect
        x="21"
        y="29"
        width="14"
        height="2.2"
        rx="1.1"
        fill="#6E9BE8"
        fillOpacity="0.85"
      />
      <rect
        x="21"
        y="33.5"
        width="19"
        height="2.2"
        rx="1.1"
        fill="#8FA6BC"
        fillOpacity="0.7"
      />
    </>
  );

  if (!animated) {
    return (
      <svg
        viewBox="0 0 64 64"
        className={cn("h-8 w-8", className)}
        role="img"
        aria-label="CodeVault logo"
        fill="none"
      >
        {content}
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="CodeVault logo"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.g
        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.g>
    </motion.svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  animated?: boolean;
  showWordmark?: boolean;
};

export function Logo({
  className,
  markClassName,
  animated = false,
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} animated={animated} />
      {showWordmark && (
        <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
          Code<span className="text-primary">Vault</span>
        </span>
      )}
    </span>
  );
}
