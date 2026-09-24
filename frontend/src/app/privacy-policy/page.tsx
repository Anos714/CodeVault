import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CodeVault handles your data — snippets, account information, and cookies.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <Link href="/" aria-label="CodeVault home">
        <Logo />
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="prose-custom mt-10 flex flex-col gap-8 text-[0.94rem] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            What we store
          </h2>
          <p>
            CodeVault stores the snippets you save — title, description, code,
            language, tags, and visibility — along with your account details
            (username, email, and a bcrypt-hashed password). We never store
            passwords in plain text.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Public vs. private snippets
          </h2>
          <p>
            Snippets are private by default. Only you can see them. If you mark
            a snippet as public, it becomes viewable by anyone browsing the
            public library.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Cookies
          </h2>
          <p>
            We use HttpOnly cookies to keep you signed in. These contain a
            short-lived access token and a refresh token — no personal data is
            stored client-side.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Your data is yours
          </h2>
          <p>
            CodeVault is open source and self-hostable. You can export or delete
            your snippets at any time, and running your own instance means your
            data never leaves your infrastructure.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Questions
          </h2>
          <p>
            This page is a summary — the full legal text is being finalized.
            Reach out via{" "}
            <a
              href="https://github.com/Anos714/CodeVault"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              GitHub
            </a>{" "}
            with any questions.
          </p>
        </section>
      </div>
    </div>
  );
}
