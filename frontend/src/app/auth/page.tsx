import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/layout/auth-split";
import { SignInOptions } from "@/components/site/sign-in-options";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to CodeVault with Google or GitHub to access your code snippets.",
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
            One account, one click. Sign in and your vault is waiting —
            snippets, tags, and history, exactly as you left it.
          </p>
        </div>

        <SignInOptions />

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
