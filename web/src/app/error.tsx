"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import ErrorBrand from "@/components/common/ErrorBrand";
import { Scramble } from "@/components/motion/not-found/glitch";
import { NotFoundStage } from "@/components/motion/not-found/shared";
import { SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { useToast } from "@/lib/toast/toast-provider";

export default function ErrorRouteBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const { toast } = useToast();

  useEffect(() => {
    console.error(error);
    toast.error("Something went wrong", "Your vault is safe — try again.");
  }, [error, toast]);

  const whileTap = reduce ? undefined : { scale: 0.96 };
  const whileHover = reduce || !canHover ? undefined : { scale: 1.02 };

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <div className="flex justify-center pt-8">
        <ErrorBrand />
      </div>
      <div className="flex flex-1 items-center justify-center pb-16">
        <NotFoundStage>
          <div className="group relative select-none font-mono font-bold leading-none tracking-tighter text-foreground [font-size:clamp(5rem,18vw,11rem)]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 text-[#ff0040] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
            >
              <Scramble text="500" />
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 text-[#00e5ff] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:-translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
            >
              <Scramble text="500" />
            </span>
            <h1 className="relative">
              <Scramble text="500" />
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-foreground">
              Something went wrong
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              An unexpected error broke this page. Your vault is safe — try
              again or head back.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={reset}
              whileTap={whileTap}
              whileHover={whileHover}
              transition={SPRING_PRESS}
              className="inline-flex h-11 cursor-pointer select-none items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </motion.button>
            <motion.a
              href="/"
              whileTap={whileTap}
              whileHover={whileHover}
              transition={SPRING_PRESS}
              className="inline-flex h-11 select-none items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
            >
              Back home
            </motion.a>
          </div>
        </NotFoundStage>
      </div>
    </main>
  );
}
