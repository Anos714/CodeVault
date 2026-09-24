import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/layout/auth-split";
import { GoogleButton } from "@/components/site/google-button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to CodeVault with Google to access your code snippets.",
};

export default function AuthPage() {
  return (
    <AuthSplit>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Get started
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            One account, one click. Sign in with Google and your vault is
            waiting — snippets, tags, and history, exactly as you left them.
          </p>
        </div>

        <GoogleButton label="Continue with Google" />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground/60">
            More options soon
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center font-mono text-xs text-muted-foreground/60">
          By continuing you agree to our{" "}
          <Link
            href="/terms-and-conditions"
            className="underline-offset-4 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthSplit>
  );
}
