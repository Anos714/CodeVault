"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";

export function Topbar() {
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/75 px-4 backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground transition-colors hover:bg-muted"
      >
        <Menu className="size-[1.05rem]" />
      </button>

      <Link href="/dashboard" className="md:hidden">
        <Logo markClassName="size-7" />
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="h-9 gap-1.5 rounded-full px-4"
          render={<Link href="/dashboard/new" />}
        >
          <Plus className="size-4" />
          New
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
