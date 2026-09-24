import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";

type LegalLayoutProps = {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots mask-fade opacity-40" />

      <div className="mx-auto max-w-3xl px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
        <div className="mb-10 flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to CodeVault
          </Link>
          <Logo />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              Last updated: {updated}
            </p>
          </div>
          <p className="border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>

        <div className="prose-legal flex flex-col gap-10 text-[0.95rem] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
