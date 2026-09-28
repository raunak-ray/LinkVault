"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
  type ToastInput,
} from "@/components/motion/animated-toast-stack";

type ToastFn = (title: string, description?: string) => string;

type ToastContextValue = {
  showToast: (input: ToastInput) => string;
  updateToast: (id: string, patch: Partial<ToastInput>) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  toast: ToastFn & {
    success: ToastFn;
    error: ToastFn;
    info: ToastFn;
    loading: ToastFn;
  };
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const {
    toasts,
    showToast,
    updateToast,
    dismissToast,
    clearToasts,
  } = useAnimatedToastStack({ defaultDuration: 4200, limit: 5 });

  const toast = useMemo(() => {
    const base = ((title: string, description?: string) =>
      showToast({ status: "neutral", title, description })) as ToastFn & {
      success: ToastFn;
      error: ToastFn;
      info: ToastFn;
      loading: ToastFn;
    };
    base.success = (title, description) =>
      showToast({ status: "success", title, description });
    base.error = (title, description) =>
      showToast({ status: "error", title, description });
    base.info = (title, description) =>
      showToast({ status: "info", title, description });
    base.loading = (title, description) =>
      showToast({ status: "loading", title, description, duration: 0 });
    return base;
  }, [showToast]);

  const value = useMemo<ToastContextValue>(
    () => ({ showToast, updateToast, dismissToast, clearToasts, toast }),
    [showToast, updateToast, dismissToast, clearToasts, toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Lifted above the mobile dock (bottom-24 on <md, bottom-6 on md+). */}
      <AnimatedToastStack
        toasts={toasts}
        onDismiss={dismissToast}
        position="bottom-right"
        placement="fixed"
        maxVisible={4}
        className="bottom-24 md:bottom-6"
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
