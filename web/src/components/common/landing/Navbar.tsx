"use client";

import { Bookmark, Menu, X } from "lucide-motion";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/motion/button/base";

const navItems = [
  { id: "features", label: "Features", href: "#features" },
  { id: "how-it-works", label: "How it works", href: "#how-it-works" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-auto w-full max-w-4xl px-4 sm:top-6">
      <div className="relative">
        {/* Floating Glass Pill Bar - strictly inline row */}
        <nav className="flex h-12 items-center justify-between rounded-full border border-border/80 bg-background/85 px-3.5 sm:px-4 text-foreground shadow-soft backdrop-blur-xl transition-colors duration-200 dark:bg-card/80 dark:border-border/60">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:rotate-6">
              <Bookmark className="size-3.5" />
            </div>
            <span className="font-sans text-sm font-bold tracking-tight text-foreground sm:text-base">
              LinkVault
            </span>
          </Link>

          {/* Center: Desktop Navigation Links (strictly inline row, hidden on mobile) */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="relative rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: Actions (strictly inline row) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle className="size-8 rounded-full hover:bg-surface text-muted-foreground hover:text-foreground" />

            <Link href="/login" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                disableScale
                className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button
                variant="primary"
                size="sm"
                disableScale
                className="h-8 px-3.5 text-xs font-semibold shadow-xs"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu with snappy AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] md:hidden"
            >
              <div className="rounded-2xl border border-border/80 bg-background/95 p-3 shadow-lift backdrop-blur-xl dark:bg-card/95">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center rounded-xl py-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
