"use client";

import { ArrowRight } from "lucide-motion";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/motion/button/base";

export default function HeroSection() {
  return (
    <section className="relative min-h-[96vh] w-full flex flex-col justify-center items-center px-4 pt-32 pb-24 text-center overflow-hidden sm:pt-36 sm:pb-28">
      {/* Static scenic background — full bleed, no opacity tricks.
          White text stays readable on it in every theme. */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/hero-night-lake.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Bottom fade — seamless flow into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-background via-background/35 to-transparent -z-10 pointer-events-none"
      />

      {/* Central Content */}
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* Eyebrow Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md shadow-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          <span className="font-medium text-white/90">
            A quiet home for your bookmarks
          </span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
            v1.0
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl md:leading-[1.12]"
        >
          Save links effortlessly. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-indigo-200 to-emerald-200">
            Find them in seconds.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-base md:text-lg"
        >
          No messy browser folders. No lost tabs. LinkVault keeps your favorite
          articles, tools, and docs neatly organized and always ready when you
          need them.
        </motion.p>

        {/* CTA Button Group — plain beui Buttons, no scale motion */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              disableScale
              className="w-full sm:w-auto gap-2 text-sm font-semibold shadow-lift"
            >
              Get started for free
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <a href="#features" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              disableScale
              className="w-full sm:w-auto text-sm font-medium border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/15"
            >
              See features
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
