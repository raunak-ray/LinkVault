"use client";

import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateCollectionSchema } from "../schema/create-collection.schema";
import useCreateCollection from "../hooks/useCreateCollection";
import { Input } from "@/components/motion/input";
import { Button } from "@/components/motion/button/base";
import { useEffect } from "react";
import { Folder, Palette, Smile } from "lucide-motion";

const PRESET_COLORS = ["#6366F1", "#14b8a6", "#22c55e", "#f59e0b", "#f97316", "#ec4899", "#06b6d4", "#8b5cf6"];

export default function CreateCollectionModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: "",
      icon: "",
      color: PRESET_COLORS[0],
    },
  });

  const selectedColor = watch("color");
  const { mutate: create, isPending } = useCreateCollection();

  const onSubmit = handleSubmit((data) => {
    create(
      {
        name: data.name.trim(),
        icon: data.icon?.trim() || undefined,
        color: data.color?.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  });

  useEffect(() => {
    if (!open) reset({ name: "", icon: "", color: PRESET_COLORS[0] });
  }, [open, reset]);

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel="Create collection modal"
        className="bg-card border p-5 max-w-md md:max-w-lg flex flex-col gap-4 border-border"
      >
        <div className="flex flex-col items-start">
          <h1 className="text-md md:text-lg font-semibold text-card-foreground">New collection</h1>
          <p className="text-sm text-muted-foreground">Group related links together.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="e.g. Programming"
                  label="Name"
                  leftIcon={<Folder className="size-4" />}
                  classNames={{
                    label: "text-card-foreground font-semibold text-sm",
                    input: "placeholder:text-muted-foreground/60",
                  }}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="icon"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="e.g. code, folder, brain"
                  label="Icon (lucide name, optional)"
                  leftIcon={<Smile className="size-4" />}
                  classNames={{
                    label: "text-card-foreground font-semibold text-sm",
                    input: "placeholder:text-muted-foreground/60",
                  }}
                  error={fieldState.error?.message}
                />
                <p className="text-xs text-muted-foreground/70 mt-1">Use any lucide icon name like `folder`, `code`, `book-open`.</p>
              </div>
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="#6366F1"
                  label="Color (hex, optional)"
                  leftIcon={<Palette className="size-4" />}
                  classNames={{
                    label: "text-card-foreground font-semibold text-sm",
                    input: "placeholder:text-muted-foreground/60",
                  }}
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
                      aria-label={`Pick color ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}
          />

          <div className="flex gap-2 items-center justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending} className="min-w-24">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
