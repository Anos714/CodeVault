import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms for using CodeVault — open source, MIT-licensed, and explained plainly.",
};

const sections = [
  {
    id: "acceptance",
    title: "By using CodeVault, you agree to these terms",
    body: (
      <p>
        That&apos;s the whole first section, really. If you don&apos;t agree,
        that&apos;s fine — the project is open source under the MIT license, so
        you&apos;re also free to run your own copy under your own rules.
      </p>
    ),
  },
  {
    id: "your-account",
    title: "Your account",
    body: (
      <ul>
        <li>
          Keep your password to yourself. You&apos;re responsible for anything
          done from your account.
        </li>
        <li>
          One account per human, please — no bots, no farms, no resale of
          accounts.
        </li>
        <li>
          If you think your account was compromised, change your password and{" "}
          <a
            href="https://github.com/Anos714/CodeVault"
            target="_blank"
            rel="noopener noreferrer"
          >
            let us know
          </a>
          .
        </li>
      </ul>
    ),
  },
  {
    id: "your-content",
    title: "Your content stays yours",
    body: (
      <>
        <p>
          You own everything you save. CodeVault claims no rights over your
          snippets — no license to your code, no reusing it elsewhere, nothing.
          Saving a snippet here doesn&apos;t transfer ownership to anyone.
        </p>
        <p>
          By marking a snippet <strong>public</strong>, you&apos;re confirming
          you have the right to share that code, and that it doesn&apos;t
          contain secrets you didn&apos;t mean to publish — API keys, tokens,
          passwords. Please double-check before flipping that switch.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "What not to do",
    body: (
      <ul>
        <li>Store or share anything illegal in your jurisdiction.</li>
        <li>
          Malware, phishing kits, or code clearly built to harm others.
        </li>
        <li>
          Spam, abuse, or anything that tries to disrupt the service or other
          users.
        </li>
        <li>
          Scraping the public library at scale. Browse it like a human, not a
          crawler farm.
        </li>
      </ul>
    ),
  },
  {
    id: "availability",
    title: "The service, as-is",
    body: (
      <p>
        CodeVault is a free, open source project, provided <strong>as is</strong>{" "}
        without warranty of any kind. We aim for it to be up and fast, but
        there&apos;s no uptime guarantee — and no refunds to give, because
        there&apos;s nothing to buy. For anything mission-critical,
        self-hosting is the supported answer.
      </p>
    ),
  },
  {
    id: "limits",
    title: "Fair limits",
    body: (
      <p>
        The hosted demo is shared, so it has soft limits on how much you can
        store and how hard you can hit the API. They&apos;re generous for
        personal use and we&apos;d rather warn than cut anyone off — but
        runaway abuse can be suspended without a committee meeting.
      </p>
    ),
  },
  {
    id: "changes",
    title: "When these terms change",
    body: (
      <p>
        If something material changes, it&apos;ll be noted here with a new date
        at the top, and significant changes get announced in the repository
        rather than buried. Continuing to use CodeVault after that means you&apos;re
        cool with the update.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Questions",
    body: (
      <p>
        Something unfair, unclear, or just weird? Open an issue on{" "}
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

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="September 2026"
      intro="The short version: be a decent human, don't put secrets or malware in public snippets, your code stays yours, and this is a free open source project provided as-is. The rest is just that, spelled out."
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
