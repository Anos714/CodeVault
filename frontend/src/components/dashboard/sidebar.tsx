"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, X, LogOut, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { dashboardNav } from "@/lib/dashboard-nav";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

type SidebarProps = {
  /** mobile drawer variant — slides over content with a scrim */
  variant?: "rail" | "drawer";
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Dashboard">
      <span
        className={cn(
          "px-3 pb-2 pt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/60",
          collapsed && "sr-only",
        )}
      >
        Vault
      </span>
      <ul className="flex flex-col gap-1">
        {dashboardNav.map(({ label, href, icon: Icon, matchPrefix }) => {
          const active = matchPrefix
            ? pathname.startsWith(matchPrefix)
            : pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
                onClick={() => useUIStore.getState().setSidebarOpen(false)}
                className={cn(
                  "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-full bg-primary"
                    transition={{ duration: 0.3, ease: easeOutExpo }}
                  />
                )}
                <Icon
                  className="size-[1.05rem] shrink-0"
                  strokeWidth={active ? 2 : 1.75}
                />
                <span
                  className={cn(
                    "truncate transition-opacity",
                    collapsed
                      ? "pointer-events-none w-0 opacity-0"
                      : "opacity-100",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-border p-3">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-2",
          collapsed && "justify-center",
        )}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name}
            className="size-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-semibold text-primary">
            {initials(user.name)}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate font-mono text-[0.68rem] text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-full gap-2 rounded-lg text-muted-foreground hover:text-foreground",
          collapsed && "px-0",
        )}
        onClick={signOut}
        title={collapsed ? "Sign out" : undefined}
      >
        <LogOut className="size-4" />
        <span className={cn(collapsed && "sr-only")}>Sign out</span>
      </Button>
    </div>
  );
}

export function Sidebar({ variant = "rail" }: SidebarProps) {
  const collapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  if (variant === "drawer") {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="fixed inset-y-0 left-0 z-70 flex w-72 flex-col border-r border-border bg-card"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                  <Logo />
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-[1.05rem]" />
                </button>
              </div>
              <SidebarNav collapsed={false} />
              <SidebarFooter collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? "4.5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-card/50 md:flex"
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        <Link href="/dashboard" className="transition-opacity hover:opacity-80">
          {collapsed ? <Logo showWordmark={false} markClassName="size-8" /> : <Logo />}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground",
            collapsed && "absolute right-2 top-4 z-10",
          )}
        >
          <ChevronLeft
            className={cn(
              "size-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />

      <div
        className={cn(
          "border-t border-border p-3",
          collapsed && "flex justify-center",
        )}
      >
        <Link
          href="/"
          target="_blank"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[0.68rem] text-muted-foreground transition-colors hover:text-foreground",
            collapsed && "px-0",
          )}
          title={collapsed ? "View the landing page" : undefined}
        >
          <ExternalLink className="size-3.5" />
          <span className={cn(collapsed && "sr-only")}>codevault.dev</span>
        </Link>
      </div>
    </motion.aside>
  );
}
