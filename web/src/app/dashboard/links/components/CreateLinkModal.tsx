import {
  CenterMorphModal,
  CenterMorphModalContent,
} from "@/components/motion/center-morph-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateLinkSchema } from "../schemas/create-link.schema";
import useCreateLink from "../hooks/useCreateLink";
import { Input } from "@/components/motion/input";
import { Link, Notebook } from "lucide-motion";
import { Button } from "@/components/motion/button/base";
import { useEffect } from "react";
import CollectionPicker from "@/components/common/CollectionPicker";

export default function CreateLinkModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(CreateLinkSchema),
    defaultValues: {
      url: "",
      collectionId: "",
      title: "",
    },
  });

  const { mutate: create } = useCreateLink();

  const onSubmit = handleSubmit((data) => {
    create(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <CenterMorphModal open={open} onOpenChange={onOpenChange}>
      <CenterMorphModalContent
        ariaLabel="Save link modal"
        className="bg-card border p-5 max-w-md md:max-w-xl flex flex-col gap-4 border-border"
      >
        <div className="flex flex-col items-start">
          <h1 className="text-md md:text-lg font-semibold">Save a link</h1>
          <p className="text-sm text-muted-foreground">Paste a URL — the rest fills itself in.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="https://example.com/article"
                  leftIcon={<Link className="size-4" />}
                  label="Url"
                  classNames={{ label: "text-card-foreground font-medium text-sm", input: "placeholder:text-muted-foreground/60" }}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="My favorite docs"
                  leftIcon={<Notebook className="size-4" />}
                  label="Title (optional)"
                  classNames={{ label: "text-card-foreground font-medium text-sm", input: "placeholder:text-muted-foreground/60" }}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="collectionId"
            render={({ field, fieldState }) => (
              <div>
                <CollectionPicker value={field.value} onChange={field.onChange} />
                {fieldState.error && <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />

          <div className="flex gap-2 items-center justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="min-w-24">
              Save Link
            </Button>
          </div>
        </form>
      </CenterMorphModalContent>
    </CenterMorphModal>
  );
}
