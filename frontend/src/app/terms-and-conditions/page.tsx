import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms for using CodeVault — an open source, MIT-licensed code snippet library.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <Link href="/" aria-label="CodeVault home">
        <Logo />
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="mt-10 flex flex-col gap-8 text-[0.94rem] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            The project
          </h2>
          <p>
            CodeVault is free, open source software released under the MIT
            license. It is provided “as is”, without warranty of any kind.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Your content
          </h2>
          <p>
            You own everything you save. You are responsible for the snippets
            you store and share, and for ensuring you have the right to publish
            any code you mark as public.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Acceptable use
          </h2>
          <p>
            Don&apos;t use CodeVault to store anything malicious or illegal.
            Abuse of the hosted instance may result in content removal or
            account suspension.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Self-hosting
          </h2>
          <p>
            The MIT license lets you run, modify, and distribute CodeVault
            freely. If you self-host, these terms don&apos;t apply to your
            instance — you set your own.
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
