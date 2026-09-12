"use client";

import { CheckCircle2, Compass } from "lucide-react";
import { motion } from "motion/react";
import StepProgressSvg from "./svg/StepProgressSvg";

const steps = [
  {
    step: 1 as const,
    badge: "STEP 01",
    title: "Save any link",
    description:
      "Paste any link into your vault. The title, description, and website icon are saved automatically.",
    perks: [
      "Auto-saves title and icon",
      "One-click capture",
      "No manual formatting",
    ],
  },
  {
    step: 2 as const,
    badge: "STEP 02",
    title: "Organize into spaces",
    description:
      "Group links into collections like Work, Design, or Reading. Pick colors and icons to keep things tidy.",
    perks: ["Choose custom icons", "Group by project", "Simple to navigate"],
  },
  {
    step: 3 as const,
    badge: "STEP 03",
    title: "Find in a flash",
    description:
      "Hit ⌘K anytime to bring up the search bar and open whatever you need immediately.",
    perks: ["Instant ⌘K shortcut", "Search titles and URLs", "Zero waiting"],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Compass className="size-3.5" />
          <span>Workflow</span>
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Three simple steps
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          From link discovery to instant retrieval.
        </p>
      </motion.div>

      {/* Step Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.step}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-lift"
          >
            <div>
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  {item.badge}
                </span>
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                  {item.step}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.description}
              </p>

              {/* Perks */}
              <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
                {item.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-xs text-foreground/80"
                  >
                    <CheckCircle2 className="size-3.5 text-mint shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SVG Visualizer */}
            <div className="mt-6">
              <StepProgressSvg step={item.step} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
