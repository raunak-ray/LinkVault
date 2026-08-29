import {
    CenterMorphModal,
    CenterMorphModalClose,
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
        create(data, { onSuccess: () => { onOpenChange(false) } });
    });

    useEffect(() => {
        if (!open) reset()
    }, [open, reset])

    return (
        <CenterMorphModal open={open} onOpenChange={onOpenChange}>
            <CenterMorphModalContent
                ariaLabel="modal"
                className="bg-[#252e37] border p-4 max-w-md md:max-w-xl flex flex-col gap-4 border-white/20"
            >
                <div className="text-white flex flex-col items-start justify-center ">
                    <h1 className="text-md md:text-lg">Save a link</h1>
                    <p className="text-sm md:text-md text-white/60">
                        Paste a URL — the rest fills itself in.
                    </p>
                </div>
                <div>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <Controller
                            control={control}
                            name="url"
                            render={({ field, fieldState }) => (
                                <>
                                    <Input
                                        {...field}
                                        placeholder="http:localhost:5000"
                                        name="url"
                                        leftIcon={<Link className="size-4" />}
                                        label="Url"
                                        className=""
                                        classNames={{
                                            label: "text-white font-bold text-sm md:text-md",
                                            input: "placeholder:text-white/60 text-white",
                                        }}
                                    />
                                    {fieldState.error && <p className="text-red-500 text-sm md:text-md mt-2">{fieldState.error.message}</p>}
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="title"
                            render={({ field, fieldState }) => (
                                <>
                                    <Input
                                        {...field}
                                        placeholder="Docs"
                                        name="title"
                                        leftIcon={<Notebook className="size-4" />}
                                        label="Title (optional)"
                                        className=""
                                        classNames={{
                                            label: "text-white font-bold text-sm md:text-md",
                                            input: "placeholder:text-white/60 text-white",
                                        }}
                                    />
                                    {fieldState.error && <p className="text-red-500 text-sm md:text-md mt-2">{fieldState.error.message}</p>}
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="collectionId"
                            render={({ field, fieldState }) => (
                                <>
                                    <Input
                                        {...field}
                                        placeholder="Id"
                                        name="collectionId"
                                        label="Collection"
                                        className=""
                                        classNames={{
                                            label: "text-white font-bold text-sm md:text-md",
                                            input: "placeholder:text-white/60 text-white",
                                        }}
                                    />
                                    {fieldState.error && <p className="text-red-500 text-sm md:text-md mt-2">{fieldState.error.message}</p>}
                                </>
                            )}
                        />

                        <div className="flex gap-2 items-center justify-end">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-white font-semibold hover:bg-black/30 border-white/20">
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="bg-blue-800/50 hover:bg-blue-800/30 border-white/20 border">
                                Save Link
                            </Button>
                        </div>
                    </form>
                </div>
            </CenterMorphModalContent>
        </CenterMorphModal>
    );
}
