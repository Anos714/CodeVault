"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { GoogleButton } from "@/components/site/google-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuthStore, type User } from "@/store/auth.store";
import { persistSession } from "@/components/providers/session-provider";
import { easeOutExpo } from "@/lib/motion";

const emptySubscribe = () => () => {};

const demoUser: User = {
  id: "user_demo",
  name: "Rahul Sain",
  email: "rahul@codevault.dev",
  image: null,
};

export function SignInGate() {
  // false during SSR + first hydration, true after — keeps the gate itself
  // free of hydration mismatches while the store resolves.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const handleDemoSignIn = () => {
    persistSession(demoUser);
    useAuthStore.getState().signIn(demoUser);
  };

  const handleGoogleSignIn = () => {
    // OAuth handler lands with the backend; sign in as the demo user for now
    persistSession(demoUser);
    useAuthStore.getState().signIn(demoUser);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots mask-fade opacity-40" />
        <div className="absolute left-1/2 top-1/3 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="flex w-full max-w-md flex-col items-center gap-7 rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl sm:p-10"
      >
        <div className="flex flex-col items-center gap-4">
          <Logo animated markClassName="size-12" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
              Sign in to open your vault
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              The dashboard is behind one sign-in. Your snippets, tags, and
              privacy settings live on the other side.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <GoogleButton label="Continue with Google" onClick={handleGoogleSignIn} />
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
            onClick={handleDemoSignIn}
          >
            <Sparkles className="size-4 text-primary" />
            Continue with a demo account
          </Button>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to CodeVault
        </Link>
      </motion.div>
    </div>
  );
}
