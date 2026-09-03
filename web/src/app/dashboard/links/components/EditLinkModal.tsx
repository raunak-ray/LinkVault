"use client";

import { CenterMorphModal, CenterMorphModalContent } from "@/components/motion/center-morph-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateLinkSchema } from "../schemas/update-link.schema";
import useUpdateLink from "../hooks/useUpdateLink";
import { Input } from "@/components/motion/input";
import { Link as LinkIcon, Notebook } from "lucide-motion";
import { Button } from "@/components/motion/button/base";
import { useEffect } from "react";
import CollectionPicker from "@/components/common/CollectionPicker";
import { LinkResponse } from "../../(dashboard)/types";

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
    const payload: any = {};
    if (data.url && data.url !== link.url) payload.url = data.url;
    if (data.title !== undefined && data.title !== (link.title ?? "")) payload.title = data.title || undefined;
    if (data.collectionId && data.collectionId !== link.collection.id) payload.collectionId = data.collectionId;
    // include at least title if empty? api allows title undefined -> will error if no values, so ensure we send something if changed
    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }
    update({ id: link.id, data: payload }, { onSuccess: () => onOpenChange(false) });
  });

  useEffect(() => {
    if (open) reset({ url: link.url, title: link.title ?? "", collectionId: link.collection.id });
  }, [open, link, reset]);

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent ariaLabel="Edit link" className="bg-card border p-5 max-w-md md:max-w-xl flex flex-col gap-4 border-border">
        <div className="flex flex-col items-start">
          <h1 className="text-md md:text-lg font-semibold">Edit link</h1>
          <p className="text-sm text-muted-foreground">Update URL, title or move to another collection.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <Input {...field} label="Url" leftIcon={<LinkIcon className="size-4" />} placeholder="https://..." error={fieldState.error?.message} />
            )}
          />
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Input {...field} label="Title" leftIcon={<Notebook className="size-4" />} placeholder="Title (optional)" error={fieldState.error?.message} />
            )}
          />
          <Controller control={control} name="collectionId" render={({ field }) => <CollectionPicker value={field.value} onChange={field.onChange} />} />
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending} className="min-w-24">
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
