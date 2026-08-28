import z from "zod";

export const UpdateLinkSchema = z.object({
    title: z.string().optional(),
    url: z.url("Please enter a valid url").optional(),
    collectionId: z.string().optional(),
})

export type UpdateLinkSchemaType = z.infer<typeof UpdateLinkSchema>;
