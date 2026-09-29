"use client";

import ConfirmModal, {
  ConfirmListItem,
} from "@/components/common/ConfirmModal";

export default function DeleteCollectionModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  collectionName,
  linkCount = 0,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  collectionName: string;
  linkCount?: number;
}) {
  const hasLinks = linkCount > 0;

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isPending={isPending}
      ariaLabel="Delete collection"
      title={`Delete "${collectionName}"?`}
      description="This cannot be undone."
      consequences={
        hasLinks ? (
          <>
            <ConfirmListItem>
              The{" "}
              <span className="font-medium text-foreground">
                {linkCount} {linkCount === 1 ? "link" : "links"}
              </span>{" "}
              inside will be deleted too. A link cannot exist without a
              collection, so they are removed together.
            </ConfirmListItem>
            <ConfirmListItem>
              Their saved metadata (title, description and favicon) goes with
              them.
            </ConfirmListItem>
            <ConfirmListItem>
              This is not a move — nothing is reassigned to another collection.
            </ConfirmListItem>
          </>
        ) : (
          <>
            <ConfirmListItem>
              This collection is empty, so only the collection itself is
              removed.
            </ConfirmListItem>
            <ConfirmListItem>
              Any links you add to it later will be unaffected.
            </ConfirmListItem>
          </>
        )
      }
      confirmPhrase={collectionName}
      confirmHint="Type the collection name exactly as shown. Capitalisation doesn't matter."
      cancelLabel="Keep collection"
      confirmLabel={
        hasLinks
          ? `Delete collection and ${linkCount} ${linkCount === 1 ? "link" : "links"}`
          : "Delete collection"
      }
    />
  );
}
