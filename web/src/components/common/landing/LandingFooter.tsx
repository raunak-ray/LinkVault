"use client";

import { motion } from "motion/react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Sign In", href: "/login" },
  { label: "Get Started", href: "/register" },
];

const word = "LinkVault";

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/80 pt-14 transition-colors duration-200">
      {/* Subtle background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-15 dark:opacity-30"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Simple link row */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Animated giant wordmark */}
        <motion.div
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="mt-10 flex justify-center overflow-hidden select-none"
        >
          {word.split("").map((letter, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: static wordmark
              key={i}
              variants={{
                hidden: { opacity: 0, y: "0.35em" },
                show: {
                  opacity: 1,
                  y: "0em",
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="bg-gradient-to-b from-foreground to-foreground/35 bg-clip-text text-transparent text-[19vw] leading-[0.85] font-extrabold tracking-tight sm:text-[9rem]"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border/60 bg-background/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} LinkVault. All rights reserved.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <title>GitHub repository</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
