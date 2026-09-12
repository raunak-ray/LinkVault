"use client";

import { Star } from "lucide-motion";
import { motion } from "motion/react";
import { useState } from "react";

export default function FavouritesPinSvg() {
  const [isStarred, setIsStarred] = useState(true);

  return (
    <div className="relative w-full h-52 flex flex-col items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <div className="w-full max-w-[320px] rounded-xl border border-border bg-card p-3.5 shadow-sm transition-colors duration-200 hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary font-mono text-xs font-bold">
              LV
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-foreground">
                Next.js App Router Architecture
              </h4>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                nextjs.org/docs/app
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className="group/star relative flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-surface"
            aria-label="Toggle favourite"
          >
            <motion.div
              animate={{
                rotate: isStarred ? [0, -15, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Star
                className={`size-4 transition-colors ${
                  isStarred
                    ? "fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300"
                    : "text-muted-foreground group-hover/star:text-foreground"
                }`}
              />
            </motion.div>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Quick-Pinned
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            1-Click Access
          </span>
        </div>
      </div>
    </div>
  );
}
