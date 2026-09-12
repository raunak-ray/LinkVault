"use client";

import {
  Bookmark,
  FolderHeart,
  Lock,
  Search,
  Sparkles,
  Zap,
} from "lucide-motion";
import { motion } from "motion/react";
import CollectionGridSvg from "./svg/CollectionGridSvg";
import FavouritesPinSvg from "./svg/FavouritesPinSvg";
import LinkEnrichmentSvg from "./svg/LinkEnrichmentSvg";
import SearchCommandSvg from "./svg/SearchCommandSvg";
import SecurityLockSvg from "./svg/SecurityLockSvg";

const cardClass =
  "group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-lift flex flex-col justify-between";

export default function BentoFeatures() {
  return (
    <section
      id="features"
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
          <Sparkles className="size-3.5" />
          <span>Features</span>
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Everything you need. Nothing in your way.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Save pages in one tap and pull them back up whenever you need them.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {/* Card 1: Auto Enrichment (7 cols on md) */}
        <div className={`${cardClass} md:col-span-7`}>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="size-3.5" />
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                AUTOMATIC
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-foreground sm:text-xl">
              Automatic titles and icons
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Just paste a link. LinkVault grabs the page title, preview
              summary, and site icon so your list stays clean without extra
              effort.
            </p>
          </div>

          <div className="mt-6">
            <LinkEnrichmentSvg />
          </div>
        </div>

        {/* Card 2: ⌘K Global Search (5 cols on md) */}
        <div className={`${cardClass} md:col-span-5`}>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search className="size-3.5" />
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                INSTANT
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-foreground sm:text-xl">
              Instant ⌘K search
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Press ⌘K or Ctrl+K anywhere to search across all your saved links
              in a flash.
            </p>
          </div>

          <div className="mt-6">
            <SearchCommandSvg />
          </div>
        </div>

        {/* Card 3: Custom Collections (4 cols on md) */}
        <div className={`${cardClass} md:col-span-4`}>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bookmark className="size-3.5" />
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                SPACES
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground sm:text-lg">
              Custom collections
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Group links by project, topic, or hobby. Add custom icons and
              colors to tell them apart easily.
            </p>
          </div>

          <div className="mt-5">
            <CollectionGridSvg />
          </div>
        </div>

        {/* Card 4: Favourites & Quick Pin (4 cols on md) */}
        <div className={`${cardClass} md:col-span-4`}>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderHeart className="size-3.5" />
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                FAVORITES
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground sm:text-lg">
              1-Click favorites
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Star daily references and docs so they stay pinned right at the
              top of your vault.
            </p>
          </div>

          <div className="mt-5">
            <FavouritesPinSvg />
          </div>
        </div>

        {/* Card 5: Vault Security (4 cols on md) */}
        <div className={`${cardClass} md:col-span-4`}>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="size-3.5" />
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                PRIVATE
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground sm:text-lg">
              Private to you
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              No ads, no tracking feeds. Just your own clean personal vault for
              saved content.
            </p>
          </div>

          <div className="mt-5">
            <SecurityLockSvg />
          </div>
        </div>
      </div>
    </section>
  );
}
