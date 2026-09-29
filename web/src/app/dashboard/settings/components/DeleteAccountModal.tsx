"use client";

import ConfirmModal, {
  ConfirmListItem,
} from "@/components/common/ConfirmModal";

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
  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isPending={isPending}
      ariaLabel="Delete account"
      title="Delete your account?"
      description="This is permanent. There is no undo, no backup and no support recovery."
      consequences={
        <>
          <ConfirmListItem>
            Every link you saved will be deleted from the database.
          </ConfirmListItem>
          <ConfirmListItem>
            Every collection, including your favourites and tags, will be
            removed.
          </ConfirmListItem>
          <ConfirmListItem>
            {email ? (
              <>
                <span className="font-medium break-all text-foreground">
                  {email}
                </span>{" "}
                will be signed out and freed for reuse.
              </>
            ) : (
              "Your email address will be signed out and freed for reuse."
            )}
          </ConfirmListItem>
        </>
      }
      confirmPhrase={CONFIRMATION_PHRASE}
      confirmHint="The button unlocks only when the phrase matches exactly."
      cancelLabel="Cancel, keep my account"
      confirmLabel="Delete my account forever"
    />
  );
}
