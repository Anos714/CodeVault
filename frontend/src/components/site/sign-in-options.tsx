"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/site/google-button";
import { GithubButton } from "@/components/site/github-button";
import { signIn } from "@/lib/auth-client";

/**
 * The three entry points on /auth: Google, GitHub, or the seeded demo
 * account. Mirrors the sign-in gate shown when a session expires mid-visit.
 */
export function SignInOptions() {
  const router = useRouter();
  const [pending, setPending] = useState<
    "google" | "github" | "demo" | null
  >(null);

  const handleSocial = async (provider: "google" | "github") => {
    setPending(provider);
    await signIn.social({ provider, callbackURL: "/dashboard" });
  };

  const handleDemo = async () => {
    setPending("demo");
    await fetch("/api/auth/demo", { method: "POST" });
    router.refresh();
  };

  const busy = pending !== null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <GoogleButton
          label={pending === "google" ? "Redirecting…" : "Continue with Google"}
          onClick={() => handleSocial("google")}
        />
        <GithubButton
          label={pending === "github" ? "Redirecting…" : "Continue with GitHub"}
          onClick={() => handleSocial("github")}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground/60">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        className="h-11 w-full gap-2 rounded-xl"
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
    </div>
  );
}
