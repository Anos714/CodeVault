"use client";

import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Logo } from "@/components/brand/logo";

type FooterLink = { label: string; href: string; external?: boolean };

const footerLinks: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Anos714/CodeVault",
        external: true,
      },
      {
        label: "Live demo",
        href: "https://codevault-olive.vercel.app/",
        external: true,
      },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

const socials = [
  {
    icon: FaGithub,
    href: "https://github.com/Anos714",
    label: "GitHub",
  },
  {
    icon: FaLinkedinIn,
    href: "https://linkedin.com/in/rahulxcode",
    label: "LinkedIn",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/RahulSain714",
    label: "X",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="CodeVault home">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The calm, syntax-aware library for the code you keep rewriting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-12 lg:gap-20">
            {footerLinks.map(({ heading, links }) => (
              <div key={heading} className="flex flex-col gap-3.5">
                <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground/70">
                  {heading}
                </h4>
                {links.map(({ label, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-border pt-7 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} CodeVault · MIT licensed
          </p>
          <div className="flex items-center gap-2.5">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
              >
                <Icon className="size-[1.05rem]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
