"use client";

import { motion } from "motion/react";

/**
 * Hand-built animated SVG artwork for the bento feature cards.
 * Shared viewBox so every card's art scales consistently.
 */

const VIEW = "0 0 160 100";

/* ---------- Monaco-style editor with a roaming, blinking caret ---------- */
export function EditorArt() {
  const lineY = [34, 48, 62, 76];
  return (
    <svg viewBox={VIEW} className="size-full" fill="none" aria-hidden>
      <rect
        x="10"
        y="10"
        width="140"
        height="80"
        rx="9"
        className="fill-card"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <circle cx="20" cy="21" r="2" className="fill-syntax-number/70" />
      <circle cx="28" cy="21" r="2" className="fill-primary/70" />
      <circle cx="36" cy="21" r="2" className="fill-syntax-function/70" />

      <rect x="20" y="30" width="58" height="5" rx="2.5" className="fill-syntax-function/80" />
      <rect x="20" y="44" width="88" height="5" rx="2.5" className="fill-syntax-string/80" />
      <rect x="32" y="58" width="66" height="5" rx="2.5" className="fill-syntax-keyword/80" />

      {/* typing line */}
      <motion.rect
        x="32"
        y="72"
        height="5"
        rx="2.5"
        className="fill-syntax-comment"
        animate={{ width: [8, 46, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* roaming caret */}
      <motion.rect
        x="20"
        width="5"
        height="11"
        rx="1.5"
        className="fill-primary"
        animate={{ y: [lineY[0], lineY[1], lineY[2], lineY[3], lineY[0]] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ---------- Instant search: pulsing magnifier over code ---------- */
export function SearchArt() {
  return (
    <svg viewBox={VIEW} className="size-full" aria-hidden>
      <rect x="18" y="24" width="70" height="5" rx="2.5" className="fill-muted-foreground/35" />
      <rect x="18" y="40" width="52" height="5" rx="2.5" className="fill-muted-foreground/25" />
      <rect x="30" y="56" width="40" height="5" rx="2.5" className="fill-muted-foreground/20" />

      {/* pulse rings */}
      {[0, 0.9].map((delay) => (
        <motion.circle
          key={delay}
          cx="98"
          cy="46"
          r="16"
          className="stroke-primary"
          strokeWidth="1.5"
          animate={{ scale: [0.7, 1.5], opacity: [0.55, 0] }}
          style={{ originX: "98px", originY: "46px" }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}

      <motion.g
        animate={{ x: [0, 5, 0], y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle
          cx="98"
          cy="46"
          r="15"
          className="fill-background stroke-syntax-function"
          strokeWidth="2.5"
        />
        <line
          x1="109"
          y1="57"
          x2="122"
          y2="70"
          className="stroke-syntax-function"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line x1="91" y1="46" x2="105" y2="46" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/* ---------- Tags sliding into place ---------- */
export function TagArt() {
  const tags = [
    { x: 22, y: 26, delay: 0, className: "fill-primary/15 stroke-primary/60" },
    { x: 56, y: 46, delay: 0.18, className: "fill-syntax-keyword/15 stroke-syntax-keyword/55" },
    { x: 30, y: 66, delay: 0.36, className: "fill-syntax-function/15 stroke-syntax-function/55" },
  ];
  return (
    <svg viewBox={VIEW} className="size-full" aria-hidden>
      {tags.map((tag, i) => (
        <motion.g
          key={i}
          initial={{ x: tag.x - 14, opacity: 0 }}
          whileInView={{ x: tag.x, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: tag.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect
            y={tag.y}
            width="52"
            height="22"
            rx="11"
            className={tag.className}
            strokeWidth="1.5"
          />
          <circle cx={tag.y + 0 + 12} cy={tag.y + 11} r="2.5" className="fill-foreground/50" />
          <line
            x1="22"
            y1={tag.y + 8}
            x2="42"
            y2={tag.y + 8}
            className="stroke-foreground/45"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="22"
            y1={tag.y + 14}
            x2="34"
            y2={tag.y + 14}
            className="stroke-foreground/30"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------- Privacy: shield with a drawn check ---------- */
export function ShieldArt() {
  return (
    <svg viewBox={VIEW} className="size-full" aria-hidden>
      <motion.circle
        cx="80"
        cy="50"
        r="30"
        className="stroke-primary"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.5, 0.25] }}
        style={{ originX: "80px", originY: "50px" }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M80 24 L102 32 V52 C102 68 92 77 80 82 C68 77 58 68 58 52 V32 Z"
        className="fill-primary/10 stroke-primary"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M71 50 L77.5 57 L90 43"
        className="stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ---------- One-click copy: sheets swapping with a check ---------- */
export function CopyArt() {
  return (
    <svg viewBox={VIEW} className="size-full" aria-hidden>
      <rect
        x="46"
        y="30"
        width="64"
        height="50"
        rx="8"
        className="fill-muted/60 stroke-foreground/20"
        strokeWidth="1.5"
      />
      <rect x="54" y="42" width="40" height="4" rx="2" className="fill-foreground/30" />
      <rect x="54" y="52" width="28" height="4" rx="2" className="fill-foreground/20" />

      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect
          x="52"
          y="22"
          width="64"
          height="50"
          rx="8"
          className="fill-card stroke-primary/50"
          strokeWidth="1.5"
        />
        <rect x="60" y="34" width="40" height="4" rx="2" className="fill-syntax-function/80" />
        <rect x="60" y="44" width="28" height="4" rx="2" className="fill-syntax-string/70" />
      </motion.g>

      <motion.circle
        cx="118"
        cy="30"
        r="11"
        className="fill-primary stroke-background"
        strokeWidth="2.5"
        animate={{ scale: [0.6, 1, 1, 0.6], opacity: [0, 1, 1, 0] }}
        style={{ originX: "118px", originY: "30px" }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
      />
      <motion.path
        d="M113.5 30 L117 33.5 L123 26.5"
        className="stroke-background"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
      />
    </svg>
  );
}

/* ---------- Light & dark: rotating sun rays with a cool crescent ---------- */
export function ThemeArt() {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox={VIEW} className="size-full" aria-hidden>
      <motion.g
        animate={{ rotate: 360 }}
        style={{ originX: "80px", originY: "50px" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {rays.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 80 + Math.cos(rad) * 26;
          const y1 = 50 + Math.sin(rad) * 26;
          const x2 = 80 + Math.cos(rad) * 33;
          const y2 = 50 + Math.sin(rad) * 33;
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-syntax-number"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
      </motion.g>

      <circle cx="80" cy="50" r="21" className="fill-syntax-number/20 stroke-syntax-number" strokeWidth="2" />

      {/* crescent moon sliding across */}
      <motion.g
        animate={{ x: [-6, 10, -6], opacity: [0.85, 0.15, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="80" cy="50" r="17" className="fill-background" />
        <circle
          cx="88"
          cy="44"
          r="17"
          className="fill-card stroke-foreground/25"
          strokeWidth="1.5"
        />
      </motion.g>

      <motion.circle
        cx="120"
        cy="30"
        r="2"
        className="fill-primary"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
        style={{ originX: "120px", originY: "30px" }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="40"
        cy="74"
        r="1.6"
        className="fill-syntax-function"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
        style={{ originX: "40px", originY: "74px" }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
      />
    </svg>
  );
}
