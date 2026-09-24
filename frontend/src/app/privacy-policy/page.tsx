import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CodeVault handles your snippets, account information, and cookies — explained in plain language.",
};

const sections = [
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          Only what CodeVault needs to work. When you create an account we
          store your <strong>username</strong> and <strong>email</strong>, plus
          a scrambled (hashed) version of your password. We never see or store
          your password in plain text — not even briefly.
        </p>
        <p>
          Everything else is the content you choose to save: a snippet&apos;s{" "}
          <strong>title, description, code, language, tags</strong>, and whether
          it&apos;s public or private.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <ul>
        <li>To sign you in and keep you signed in, securely.</li>
        <li>To show you your own snippets, exactly as you saved them.</li>
        <li>To power search, so you can find that regex you wrote in 2023.</li>
        <li>
          That&apos;s it. No analytics on your code, no training models on your
          snippets, no selling anything to anyone.
        </li>
      </ul>
    ),
  },
  {
    id: "public-private",
    title: "Public vs. private snippets",
    body: (
      <>
        <p>
          Every snippet is <strong>private by default</strong>. Only you can see
          it. Nothing about a private snippet is shown to anyone else.
        </p>
        <p>
          If you flip a snippet to <strong>public</strong>, it appears in the
          public library and anyone can view it. You can switch it back to
          private at any time — but keep in mind that something already viewed
          or copied may have been saved elsewhere.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & tokens",
    body: (
      <p>
        CodeVault uses two <strong>HttpOnly cookies</strong> to keep you logged
        in: a short-lived access token (15 minutes) and a refresh token (7
        days). They&apos;re marked HttpOnly, which means JavaScript on a page
        can&apos;t read them, and they&apos;re sent only over secure
        connections in production. We don&apos;t use third-party tracking
        cookies.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Who else sees your data",
    body: (
      <p>
        The hosted demo runs on Vercel and stores data in MongoDB Atlas — both
        see only encrypted data in transit and at rest, and neither reads your
        snippets. If you self-host CodeVault (it&apos;s open source and you&apos;re
        welcome to), no third party is involved at all.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights & your data",
    body: (
      <ul>
        <li>
          <strong>Export</strong> — copy any snippet to your clipboard in one
          click, any time.
        </li>
        <li>
          <strong>Delete</strong> — remove any snippet permanently. It&apos;s
          gone, not archived.
        </li>
        <li>
          <strong>Own it</strong> — your code is yours. CodeVault is a tool for
          storing it, not a claim on it.
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        Passwords are hashed with bcrypt, sessions are token-based rather than
        stateful, and access tokens expire quickly by design. No system is
        perfect, but if we ever found a real issue affecting your data we&apos;d
        disclose it openly — the project is public.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Questions",
    body: (
      <p>
        If something here is unclear or you want a specific piece of your data
        removed, open an issue on{" "}
        <a
          href="https://github.com/Anos714/CodeVault"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{" "}
        or email{" "}
        <a href="mailto:sainrahul374@gmail.com">sainrahul374@gmail.com</a>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="September 2026"
      intro="The short version: CodeVault stores the code you save and almost nothing else. This page explains exactly what that means, in plain language — no legalese, no surprises."
    >
      {sections.map(({ id, title, body }) => (
        <section key={id} id={id}>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {title}
          </h2>
          <div className="flex flex-col gap-4">{body}</div>
        </section>
      ))}
    </LegalLayout>
  );
}
