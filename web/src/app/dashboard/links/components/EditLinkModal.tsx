"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link as LinkIcon, Notebook } from "lucide-motion";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CollectionPicker from "@/components/common/CollectionPicker";
import { Button } from "@/components/motion/button/base";
import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { Input } from "@/components/motion/input";
import type { LinkResponse } from "../../(dashboard)/types";
import useUpdateLink from "../hooks/useUpdateLink";
import { UpdateLinkSchema } from "../schemas/update-link.schema";
import type { UpdateLinkPayload } from "../types";

export default function EditLinkModal({
  open,
  onOpenChange,
  link,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkResponse;
}) {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(UpdateLinkSchema),
    defaultValues: {
      url: link.url,
      title: link.title ?? "",
      collectionId: link.collection.id,
    },
  });

  const { mutate: update, isPending } = useUpdateLink();

  const onSubmit = handleSubmit((data) => {
    // Send only the fields that actually changed; the API rejects an empty body.
    const payload: UpdateLinkPayload = {};
    if (data.url && data.url !== link.url) payload.url = data.url;
    if (data.title !== (link.title ?? ""))
      payload.title = data.title || undefined;
    if (data.collectionId && data.collectionId !== link.collection.id)
      payload.collectionId = data.collectionId;

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }
    update(
      { id: link.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  });

  useEffect(() => {
    if (open)
      reset({
        url: link.url,
        title: link.title ?? "",
        collectionId: link.collection.id,
      });
  }, [open, link, reset]);

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel="Edit link"
        className="bg-card border p-5 max-w-md md:max-w-xl flex flex-col gap-4 border-border"
      >
        <div className="flex flex-col items-start">
          <h1 className="text-base md:text-lg font-semibold">Edit link</h1>
          <p className="text-sm text-muted-foreground">
            Update URL, title or move to another collection.
          </p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Url"
                leftIcon={<LinkIcon className="size-4" />}
                placeholder="https://..."
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Title"
                leftIcon={<Notebook className="size-4" />}
                placeholder="Title (optional)"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="collectionId"
            render={({ field }) => (
              <CollectionPicker value={field.value} onChange={field.onChange} />
            )}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="min-w-24"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
