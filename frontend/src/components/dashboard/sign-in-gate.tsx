"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { GoogleButton } from "@/components/site/google-button";
import { GithubButton } from "@/components/site/github-button";
import { signIn } from "@/lib/auth-client";
import { easeOutExpo } from "@/lib/motion";

type PendingProvider = "google" | "github" | "demo" | null;

type SignInGateProps = {
  /** only render providers whose credentials are actually configured */
  googleEnabled: boolean;
  githubEnabled: boolean;
};

export function SignInGate({
  googleEnabled,
  githubEnabled,
}: SignInGateProps) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingProvider>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocial = async (provider: "google" | "github") => {
    setPending(provider);
    setError(null);
    // hands the browser off to the OAuth provider; Better Auth redirects
    // back to the dashboard once the flow completes
    try {
      await signIn.social({ provider, callbackURL: "/dashboard" });
    } catch {
      setError("Could not start sign-in. Try the demo account instead.");
      setPending(null);
    }
  };

  const handleDemo = async () => {
    setPending("demo");
    setError(null);
    // the route signs in as the seeded demo user and sets the session cookie
    try {
      const response = await fetch("/api/auth/demo", { method: "POST" });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Demo sign-in failed.");
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Demo sign-in failed — try again.",
      );
      setPending(null);
    }
  };

  const busy = pending !== null;
  const hasSocial = googleEnabled || githubEnabled;

  return (
    <div className="hills-fill relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <div className="hero-shade" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="relative flex w-full max-w-md flex-col items-center gap-7 rounded-[28px] bg-background p-8 shadow-[0_40px_80px_-40px_rgba(6,30,60,0.6)] sm:p-10"
      >
        <div className="flex flex-col items-center gap-4">
          <Logo animated markClassName="size-12" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-balance text-[clamp(26px,3vw,32px)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground">
              Sign in to open{" "}
              <span className="accent-serif">your vault.</span>
            </h1>
            <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-soft">
              The dashboard is behind one sign-in. Your snippets, tags, and
              privacy settings live on the other side.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {hasSocial && (
            <>
              {googleEnabled && (
                <GoogleButton
                  label={
                    pending === "google"
                      ? "Redirecting…"
                      : "Continue with Google"
                  }
                  onClick={() => handleSocial("google")}
                />
              )}
              {githubEnabled && (
                <GithubButton
                  label={
                    pending === "github"
                      ? "Redirecting…"
                      : "Continue with GitHub"
                  }
                  onClick={() => handleSocial("github")}
                />
              )}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="font-rounded text-[11px] font-bold uppercase tracking-[0.14em] text-soft/70">
                  or
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}
          <Button
            variant="outline"
            className="h-12 w-full gap-2 rounded-2xl border-line bg-panel text-[15px] font-semibold text-foreground hover:bg-secondary"
            disabled={busy}
            onClick={handleDemo}
          >
            {pending === "demo" ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <Sparkles className="size-4 text-primary" />
            )}
            Continue with a demo account
          </Button>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to CodeVault
        </Link>
      </motion.div>
    </div>
  );
}
