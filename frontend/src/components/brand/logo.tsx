"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  animated?: boolean;
};

/**
 * CodeVault mark — a soft glass tile wrapping an ink app icon, with the
 * signature `</>` window. The frame stays light and the tile stays ink so
 * the mark reads the same on the paper site and the dark floating nav.
 */
export function LogoMark({ className, animated = false }: LogoMarkProps) {
  const content = (
    <>
      {/* glass frame */}
      <rect x="1.25" y="1.25" width="61.5" height="61.5" rx="15.25" fill="#eceef2" />
      <rect
        x="1.6"
        y="1.6"
        width="60.8"
        height="60.8"
        rx="14.9"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.9"
        strokeWidth="0.8"
      />

      {/* ink tile */}
      <rect x="5.75" y="5.75" width="52.5" height="52.5" rx="12.75" fill="#0b0b0f" />
      <rect
        x="6.15"
        y="6.15"
        width="51.7"
        height="51.7"
        rx="12.35"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.1"
        strokeWidth="0.8"
      />

      {/* code window */}
      <rect
        x="17.5"
        y="20.75"
        width="29"
        height="22.5"
        rx="6"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.92"
        strokeWidth="2"
      />
      <path
        d="M26.5 26.75 22.75 32l3.75 5.25"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.5 26.75 41.25 32l-3.75 5.25"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.5 25.75 29.5 38.25"
        fill="none"
        stroke="#9eccff"
        strokeWidth="2"
        strokeLinecap="round"
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
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        }}
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
        <span className="text-[1.05rem] font-[650] tracking-[-0.02em] text-current">
          CodeVault
        </span>
      )}
    </span>
  );
}
