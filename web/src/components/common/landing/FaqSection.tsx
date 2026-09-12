"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    q: "How does LinkVault grab titles and icons?",
    a: "When you paste a link, LinkVault automatically checks the page's public information to pull the real title, preview summary, and site icon. You don't have to copy-paste titles manually.",
  },
  {
    q: "Can I organize links into custom collections?",
    a: "Yes. You can create as many collections as you like (such as Work, Design, or Reading) and customize each with its own icon and color badge.",
  },
  {
    q: "How does the ⌘K instant search work?",
    a: "Press ⌘K on Mac or Ctrl+K on Windows anytime. A fast search bar pops up immediately, letting you search through your links by title, url, or tag without lag.",
  },
  {
    q: "Does LinkVault support both Dark and Light modes?",
    a: "Yes, fully. LinkVault adapts to your system theme by default, and you can switch between dark and light mode anytime with one click in the navbar.",
  },
  {
    q: "Is my vault private and secure?",
    a: "Yes. Your links belong exclusively to your account. We don't sell browsing data, show ads, or track what you save.",
  },
  {
    q: "What are 1-Click Favorites?",
    a: "Clicking the star icon on any link pins it directly to your favorites list so you can open daily tools and docs in a single click.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Heading & Info (Inspired by Drizzle ORM) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
        >
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Quick answers to help you get the most out of your vault.
          </p>

          <div className="mt-8 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
            <h4 className="text-sm font-bold text-foreground">
              Ready to save time?
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Create your personal vault in seconds. It is completely free to
              start.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              Get started for free →
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Accordion Items with Stable Width & Smooth Height */}
        <div className="lg:col-span-8 flex flex-col divide-y divide-border/80">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 py-2 text-left font-medium transition-colors hover:text-primary focus-visible:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground sm:text-base">
                    {item.q}
                  </span>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface border border-border/80 text-muted-foreground transition-colors hover:text-foreground">
                    <Plus
                      className={`size-4 transition-transform duration-200 ${
                        isOpen ? "rotate-45 text-primary" : ""
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2 pb-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
