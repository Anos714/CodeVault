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
          className="relative overflow-hidden rounded-[22px] bg-panel p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-[inset_0_0_0_1px_rgba(11,11,15,0.06)]",
                accent,
              )}
            >
              <Icon className="size-[1.05rem]" strokeWidth={1.9} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-rounded text-[0.66rem] font-bold uppercase tracking-[0.12em] text-soft/80">
                {label}
              </span>
              <span className="text-[26px] font-bold leading-tight tracking-[-0.04em] tabular-nums text-foreground">
                {value}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
