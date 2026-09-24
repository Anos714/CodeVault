"use client";

import { useSyncExternalStore, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // false during SSR + hydration, true after — avoids a hydration mismatch
  // for the theme-dependent icon without a setState-in-effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  const handleToggle = async () => {
    const next = isDark ? "light" : "dark";

    // View Transition sweep, expanding from the toggle itself. Falls back to
    // an instant swap where the API is unavailable.
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      buttonRef.current
    ) {
      const rect = buttonRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const maxRadius = Math.hypot(
        Math.max(cx, innerWidth - cx),
        Math.max(cy, innerHeight - cy),
      );

      const transition = (
        document as Document & {
          startViewTransition: (cb: () => void) => {
            ready: Promise<void>;
          };
        }
      ).startViewTransition(() => {
        setTheme(next);
      });

      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${maxRadius}px at ${cx}px ${cy}px)`,
          ],
        },
        {
          duration: 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
      return;
    }

    setTheme(next);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Toggle theme"
      // `resolvedTheme` is undefined during SSR, so gate the theme-dependent
      // title on mount to keep server and client output identical.
      title={mounted ? (isDark ? "Switch to light" : "Switch to dark") : undefined}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ y: -8, opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: 8, opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="size-[1.05rem]" strokeWidth={1.75} />
            ) : (
              <Sun className="size-[1.05rem]" strokeWidth={1.75} />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
