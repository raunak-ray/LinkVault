"use client";

import ConfirmModal, {
  ConfirmListItem,
} from "@/components/common/ConfirmModal";

export default function DeleteLinkModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  linkLabel,
  collectionName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  linkLabel: string;
  collectionName?: string;
}) {
  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isPending={isPending}
      ariaLabel="Delete link"
      title="Delete this link?"
      description={
        <span className="break-all">
          <span className="font-medium text-foreground">{linkLabel}</span> will
          be removed from your vault. This cannot be undone.
        </span>
      }
      consequences={
        <>
          <ConfirmListItem>
            The link and its saved metadata are permanently deleted.
          </ConfirmListItem>
          {collectionName ? (
            <ConfirmListItem>
              It is removed from{" "}
              <span className="font-medium text-foreground">
                {collectionName}
              </span>
              . The collection itself is kept.
            </ConfirmListItem>
          ) : (
            <ConfirmListItem>Its collection is kept.</ConfirmListItem>
          )}
        </>
      }
      cancelLabel="Keep link"
      confirmLabel="Delete link"
    />
  );
}
