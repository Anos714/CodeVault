import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/layout/auth-split";
import { SignInOptions } from "@/components/site/sign-in-options";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to CodeVault with Google or GitHub to access your code snippets.",
  alternates: { canonical: "/auth" },
};

export default function AuthPage() {
  // mirror the lazy provider registration in src/server/auth.ts — a provider
  // with no credentials must not render a button that cannot work
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const githubEnabled = Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  );

  return (
    <AuthSplit>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Get started</span>
          <h1 className="text-balance text-[clamp(30px,4vw,40px)] font-bold leading-[1.02] tracking-[-0.05em] text-foreground">
            Your vault is{" "}
            <span className="accent-serif">waiting.</span>
          </h1>
          <p className="text-pretty text-[15px] leading-relaxed text-soft">
            One account, one click. Sign in and your snippets, tags, and history
            are exactly as you left them.
          </p>
        </div>

        <SignInOptions
          googleEnabled={googleEnabled}
          githubEnabled={githubEnabled}
        />

        <p className="text-center font-rounded text-[12px] font-medium text-soft/70">
          By continuing you agree to our{" "}
          <Link
            href="/terms-and-conditions"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthSplit>
  );
}
