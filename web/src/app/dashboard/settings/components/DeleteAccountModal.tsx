"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/motion/button/base";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";

/** Phrase the user has to type verbatim to arm the destructive action. */
const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT";

export default function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  email,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  email?: string;
}) {
  const [typed, setTyped] = useState("");
  const [touched, setTouched] = useState(false);
  const fieldId = useId();

  // Never keep a half-typed phrase around between openings.
  useEffect(() => {
    if (open) return;
    setTyped("");
    setTouched(false);
  }, [open]);

  const matches = typed.trim() === CONFIRMATION_PHRASE;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matches || isPending) return;
    onConfirm();
  };

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel="Delete account"
        ariaDescribedBy={`${fieldId}-description`}
        className="max-w-xl border border-border bg-card"
      >
        <form onSubmit={submit} className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start gap-3 pr-8">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            >
              <AlertTriangle className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Delete your account?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This is permanent. There is no undo, no backup and no support
                recovery.
              </p>
            </div>
          </div>

          <ul
            id={`${fieldId}-description`}
            className="space-y-1.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-muted-foreground"
          >
            <li className="flex gap-2">
              <span aria-hidden className="text-destructive">
                &middot;
              </span>
              <span>
                Every link you saved will be deleted from the database.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-destructive">
                &middot;
              </span>
              <span>
                Every collection, including your favourites and tags, will be
                removed.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-destructive">
                &middot;
              </span>
              <span>
                {email ? (
                  <>
                    <span className="font-medium text-foreground break-all">
                      {email}
                    </span>{" "}
                    will be signed out and freed for reuse.
                  </>
                ) : (
                  "Your email address will be signed out and freed for reuse."
                )}
              </span>
            </li>
          </ul>

          <div className="space-y-1.5">
            <label
              htmlFor={fieldId}
              className="block text-sm font-medium text-foreground"
            >
              Type{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] font-semibold text-foreground">
                {CONFIRMATION_PHRASE}
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
              autoCapitalize="characters"
              spellCheck={false}
              disabled={isPending}
              placeholder={CONFIRMATION_PHRASE}
              aria-describedby={`${fieldId}-hint`}
              aria-invalid={touched && typed.trim().length > 0 && !matches}
              className={cn(
                "h-11 w-full rounded-xl border border-border bg-background px-3.5 font-mono text-sm text-foreground caret-foreground outline-none transition-colors",
                "placeholder:font-sans placeholder:text-muted-foreground/60",
                "focus:border-ring focus:ring-2 focus:ring-ring/40",
                "disabled:cursor-not-allowed disabled:opacity-60",
                touched &&
                  typed.trim().length > 0 &&
                  !matches &&
                  "border-destructive focus:border-destructive focus:ring-destructive/25",
                matches &&
                  "border-primary/60 focus:border-primary focus:ring-primary/25",
              )}
            />
            <p
              id={`${fieldId}-hint`}
              className={cn(
                "text-xs",
                touched && !matches && typed.trim().length > 0
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {touched && !matches && typed.trim().length > 0
                ? "The phrase does not match yet. Check for typos and capitalisation."
                : "The delete button unlocks only when the phrase matches exactly."}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel, keep my account
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!matches || isPending}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
            >
              {isPending ? "Deleting…" : "Delete my account forever"}
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
