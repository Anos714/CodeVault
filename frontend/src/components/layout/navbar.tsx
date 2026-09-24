"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } =
    useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          aria-label="CodeVault home"
        >
          <Logo />
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Anos714/CodeVault"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CodeVault on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <FaGithub className="size-[1.05rem]" />
          </a>
          <ThemeToggle />
          <Button
            size="lg"
            render={<Link href="/snippets" />}
            className="hidden h-9 gap-1.5 rounded-full px-4 sm:inline-flex"
          >
            Open the app
            <ArrowRight className="size-3.5" />
          </Button>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground transition-colors hover:bg-muted md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="size-[1.05rem]" />
            ) : (
              <Menu className="size-[1.05rem]" />
            )}
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Button
                size="lg"
                className="mt-2 h-10 gap-1.5 rounded-full"
                render={
                  <Link
                    href="/snippets"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                }
              >
                Open the app
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
