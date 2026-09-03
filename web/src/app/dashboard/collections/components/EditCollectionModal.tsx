"use client";

import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateCollectionSchema } from "../schema/update-collection.schema";
import useUpdateCollection from "../hooks/useUpdateCollection";
import { Input } from "@/components/motion/input";
import { Button } from "@/components/motion/button/base";
import { useEffect } from "react";
import { Folder, Palette } from "lucide-motion";
import { CollectionResponse } from "../../(dashboard)/types";
import IconPicker from "@/components/common/IconPicker";

const PRESET_COLORS = ["#6366F1", "#14b8a6", "#22c55e", "#f59e0b", "#f97316", "#ec4899", "#06b6d4", "#8b5cf6"];

export default function EditCollectionModal({
  open,
  onOpenChange,
  collection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: CollectionResponse;
}) {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(UpdateCollectionSchema),
    defaultValues: {
      name: collection.name,
      icon: collection.icon ?? "",
      color: collection.color ?? PRESET_COLORS[0],
    },
  });

  const selectedColor = watch("color");
  const { mutate: update, isPending } = useUpdateCollection();

  const onSubmit = handleSubmit((data) => {
    update(
      {
        id: collection.id,
        data: {
          name: data.name?.trim() || undefined,
          icon: data.icon?.trim() || undefined,
          color: data.color?.trim() || undefined,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  });

  useEffect(() => {
    if (open) {
      reset({
        name: collection.name,
        icon: collection.icon ?? "",
        color: collection.color ?? PRESET_COLORS[0],
      });
    }
  }, [open, collection, reset]);

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel="Edit collection modal"
        className="bg-card border p-5 max-w-md md:max-w-lg flex flex-col gap-4 border-border"
      >
        <div className="flex flex-col items-start">
          <h1 className="text-md md:text-lg font-semibold text-card-foreground">Edit collection</h1>
          <p className="text-sm text-muted-foreground">Update collection details.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Collection name"
                label="Name"
                leftIcon={<Folder className="size-4" />}
                classNames={{ label: "text-card-foreground font-semibold text-sm", input: "placeholder:text-muted-foreground/60" }}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker value={field.value ?? ""} onChange={(v) => field.onChange(v)} />
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="#6366F1"
                  label="Color"
                  leftIcon={<Palette className="size-4" />}
                  classNames={{ label: "text-card-foreground font-semibold text-sm", input: "placeholder:text-muted-foreground/60" }}
                  error={fieldState.error?.message}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue("color", c, { shouldDirty: true })}
                      className={`size-7 rounded-full border-2 transition-all ${selectedColor === c ? "border-foreground scale-110" : "border-border hover:border-foreground/40"}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Pick ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}
          />

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
