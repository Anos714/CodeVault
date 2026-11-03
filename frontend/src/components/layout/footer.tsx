"use client";

import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Logo } from "@/components/brand/logo";

type FooterLink = { label: string; href: string; external?: boolean };

const footerLinks: FooterLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Extensions", href: "#extensions" },
  { label: "FAQ", href: "#faq" },
  {
    label: "GitHub",
    href: "https://github.com/Anos714/CodeVault",
    external: true,
  },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
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
    <footer className="px-0 pb-11 pt-7 text-[14px] text-soft">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/"
            aria-label="CodeVault home"
            className="inline-flex items-center text-ink"
          >
            <Logo markClassName="size-6" />
          </Link>
          <span>
            © {new Date().getFullYear()} CodeVault · MIT licensed
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            Built by{" "}
            <a
              href="https://github.com/Anos714"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink hover:underline"
            >
              Rahul Sain
            </a>
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex size-8 items-center justify-center rounded-full bg-panel text-soft transition-colors hover:bg-ink hover:text-background"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
