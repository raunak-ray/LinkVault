"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { useOffline } from "@/lib/hooks/use-online";
import { useToast } from "@/lib/toast/toast-provider";

/**
 * Non-blocking offline indicator. Renders a small floating pill at the top
 * while the browser is offline and fires a "Back online" toast on reconnect.
 * Must be mounted inside <ToastProvider>.
 */
export default function OfflineBanner() {
  const isOffline = useOffline();
  const { toast } = useToast();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (isOffline) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      toast.success("Back online", "Connection restored. You're good to go.");
    }
  }, [isOffline, toast]);

  return (
    <AnimatePresence>
      {isOffline ? (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="assertive"
          className="fixed left-1/2 top-3 z-[95] -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-destructive/30 bg-card/95 py-2 pl-3 pr-4 shadow-2xl backdrop-blur-xl">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <WifiOff className="size-3.5" />
            </span>
            <p className="whitespace-nowrap text-xs font-medium">
              You&apos;re offline
              <span className="ml-1.5 font-normal text-muted-foreground">
                Changes will sync when you reconnect
              </span>
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
