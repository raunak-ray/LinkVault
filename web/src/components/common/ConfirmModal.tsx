"use client";

import { AlertTriangle } from "lucide-react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { Button } from "@/components/motion/button/base";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";

export type ConfirmTone = "danger" | "default";

/** One bullet in a `ConfirmModal` consequences list. */
export function ConfirmListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="text-destructive">
        &middot;
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Runs when the user confirms. Guarded by the confirm button's disabled state. */
  onConfirm: () => void;
  /** True while the mutation is in flight; locks the whole dialog. */
  isPending?: boolean;
  title: string;
  description?: ReactNode;
  /**
   * List items describing exactly what is lost. Pass `<li>` children; this
   * component supplies the surrounding `<ul>` and its warning styling.
   */
  consequences?: ReactNode;
  /**
   * When set, the user must type this text to arm the confirm button.
   * Matching is case-insensitive and ignores surrounding whitespace.
   */
  confirmPhrase?: string;
  /** Label for the confirm button. */
  confirmLabel: string;
  /** Label for the dismiss button. */
  cancelLabel?: string;
  ariaLabel?: string;
  tone?: ConfirmTone;
  /** Text for the field's helper line. */
  confirmHint?: string;
  /** Applies the destructive colour to the confirm button. Default true. */
  destructive?: boolean;
}

/**
 * Shared confirmation dialog for irreversible actions.
 *
 * With a `confirmPhrase` it behaves like a MongoDB Atlas prompt: the confirm
 * button stays disabled until the phrase is typed, so a stray click can never
 * destroy data. Without one it is a plain two-button confirmation.
 */
export default function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  title,
  description,
  consequences,
  confirmPhrase,
  confirmLabel,
  cancelLabel = "Cancel",
  ariaLabel,
  tone = "danger",
  confirmHint,
  destructive = true,
}: ConfirmModalProps) {
  const [typed, setTyped] = useState("");
  const [touched, setTouched] = useState(false);
  const fieldId = useId();
  const bodyId = `${fieldId}-body`;
  const hintId = `${fieldId}-hint`;

  // Never carry a half-typed phrase into the next time the dialog opens.
  useEffect(() => {
    if (open) return;
    setTyped("");
    setTouched(false);
  }, [open]);

  // Case-insensitive on purpose: the phrase guards against misclicks, not
  // against someone who deliberately set out to destroy their own data.
  // With no phrase, the action is unlocked immediately.
  const expected = confirmPhrase?.trim().toLowerCase();
  const matches = !expected || typed.trim().toLowerCase() === expected;

  const hasContent = typed.trim().length > 0;
  const showsMismatch = Boolean(expected) && touched && hasContent && !matches;
  const danger = tone === "danger" && destructive;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matches || isPending) return;
    onConfirm();
  };

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel={ariaLabel ?? title}
        ariaDescribedBy={bodyId}
        className="max-w-md border border-border bg-card"
      >
        <form onSubmit={submit} className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start gap-3 pr-8">
            <span
              aria-hidden
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                danger
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary",
              )}
            >
              <AlertTriangle className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {consequences ? (
            <ul
              id={bodyId}
              className={cn(
                "space-y-1.5 rounded-xl border p-3.5 text-sm text-muted-foreground",
                danger
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-muted/40",
              )}
            >
              {consequences}
            </ul>
          ) : (
            <span id={bodyId} className="hidden" />
          )}

          {confirmPhrase ? (
            <div className="space-y-1.5">
              <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-foreground"
              >
                Type{" "}
                <code className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] font-semibold text-foreground">
                  {confirmPhrase}
                </code>{" "}
                to confirm
              </label>
              <input
                id={fieldId}
                value={typed}
                onChange={(e) => {
                  setTyped(e.target.value);
                  setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isPending}
                placeholder={confirmPhrase}
                aria-describedby={hintId}
                aria-invalid={showsMismatch}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-background px-3.5 font-mono text-sm text-foreground caret-foreground outline-none transition-colors",
                  "placeholder:font-sans placeholder:text-muted-foreground/60",
                  "focus:border-ring focus:ring-2 focus:ring-ring/40",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  showsMismatch &&
                    "border-destructive focus:border-destructive focus:ring-destructive/25",
                  matches &&
                    expected &&
                    "border-primary/60 focus:border-primary focus:ring-primary/25",
                )}
              />
              <p
                id={hintId}
                className={cn(
                  "text-xs",
                  showsMismatch ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {showsMismatch
                  ? (confirmHint ??
                    "That does not match yet. Check the spelling.")
                  : (confirmHint ??
                    "The button unlocks once the text matches.")}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!matches || isPending}
              className={cn(
                "w-full sm:w-auto",
                danger &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              {isPending ? "Working…" : confirmLabel}
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
