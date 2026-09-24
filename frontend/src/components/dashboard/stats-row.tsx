import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/motion";

type Stat = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
};

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <motion.div
          key={label}
          variants={fadeUp}
          className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-card"
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-60 blur-2xl",
              accent,
            )}
          />
          <div className="relative flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60",
                accent,
              )}
            >
              <Icon className="size-[1.05rem]" strokeWidth={1.9} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/70">
                {label}
              </span>
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {value}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
