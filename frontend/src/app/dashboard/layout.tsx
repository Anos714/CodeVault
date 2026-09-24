"use client";

import { useAuthStore } from "@/store/auth.store";
import { SessionProvider } from "@/components/providers/session-provider";
import { SignInGate } from "@/components/dashboard/sign-in-gate";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="font-mono text-xs text-muted-foreground">
            Opening your vault…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignInGate />;
  }

  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar variant="rail" />
      <Sidebar variant="drawer" />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
