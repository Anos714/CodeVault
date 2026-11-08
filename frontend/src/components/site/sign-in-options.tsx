"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/site/google-button";
import { GithubButton } from "@/components/site/github-button";
import { signIn } from "@/lib/auth-client";

type SignInOptionsProps = {
  /** only render providers whose credentials are actually configured */
  googleEnabled: boolean;
  githubEnabled: boolean;
};

/**
 * The entry points on /auth: Google, GitHub (when configured), or the seeded
 * demo account. Mirrors the sign-in gate shown when a session expires
 * mid-visit.
 */
export function SignInOptions({
  googleEnabled,
  githubEnabled,
}: SignInOptionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<
    "google" | "github" | "demo" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocial = async (provider: "google" | "github") => {
    setPending(provider);
    setError(null);
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
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Demo sign-in failed.");
      }
      // The POST above sets the session cookie. Refreshing /auth would only
      // re-render this page, so send the user to the dashboard instead; the
      // proxy gate now sees the cookie and renders the vault.
      router.replace("/dashboard");
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
    <div className="flex flex-col gap-5">
      {hasSocial && (
        <div className="flex flex-col gap-3">
          {googleEnabled && (
            <GoogleButton
              label={
                pending === "google" ? "Redirecting…" : "Continue with Google"
              }
              onClick={() => handleSocial("google")}
            />
          )}
          {githubEnabled && (
            <GithubButton
              label={
                pending === "github" ? "Redirecting…" : "Continue with GitHub"
              }
              onClick={() => handleSocial("github")}
            />
          )}
        </div>
      )}

      {hasSocial && (
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="font-rounded text-[11px] font-bold uppercase tracking-[0.14em] text-soft/70">
            or
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
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
  );
}
