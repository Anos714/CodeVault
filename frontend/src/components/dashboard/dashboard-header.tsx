import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function DashboardHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 font-rounded text-[0.68rem] font-bold uppercase tracking-[0.14em] text-soft/80">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="text-balance text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.04] tracking-[-0.05em] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-soft">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
