"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } =
    useUIStore();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu when clicking (or touching) outside of it
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  // lock body scroll while the drawer is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed left-1/2 top-0 z-50 -translate-x-1/2 transition-[width,height,top,border-radius,background,box-shadow] duration-500",
        "[transition-timing-function:cubic-bezier(.3,1.25,.4,1)]",
        scrolled
          ? "nav-floating top-3.5 h-[54px] w-[min(880px,calc(100vw-32px))] rounded-[18px] px-2.5"
          : "h-[76px] w-[min(1112px,calc(100vw-48px))] rounded-[18px] bg-transparent px-1",
      )}
    >
      <nav className="flex h-full items-center justify-between gap-4 text-white">
        <Link
          href="/"
          className="flex shrink-0 items-center text-white transition-opacity hover:opacity-85"
          aria-label="CodeVault home"
        >
          <Logo markClassName="size-8" />
        </Link>

        {/* desktop links */}
        <div
          className={cn(
            "hidden items-center transition-all md:flex",
            scrolled ? "gap-5 text-[14px]" : "gap-[26px] text-[14.5px]",
          )}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/Anos714/CodeVault"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] transition-colors hover:bg-white/25"
          >
            <FaGithub className="size-3.5" />
            GitHub
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="border-0 bg-white/15 text-white hover:bg-white/25 hover:text-white" />
          <Link
            href="/auth"
            className="hidden h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[14.5px] font-semibold text-black transition-transform duration-200 active:scale-95 hover:scale-[1.04] sm:inline-flex"
          >
            Open the app
            <ArrowRight className="size-3.5" />
          </Link>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="relative inline-flex size-9 items-center justify-center rounded-[10px] bg-white/15 text-white transition-colors hover:bg-white/25 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute flex items-center justify-center"
                >
                  <X className="size-[1.05rem]" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute flex items-center justify-center"
                >
                  <Menu className="size-[1.05rem]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="nav-floating absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[18px] p-2 md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/dashboard/snippets"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1.5 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-semibold text-black"
              >
                Open the app
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
