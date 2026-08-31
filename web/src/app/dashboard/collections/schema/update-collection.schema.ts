import z from "zod";

export const UpdateCollectionSchema = z.object({
    name: z.string("Name is required").optional(),
    icon: z.string().optional(),
    color: z.string().optional()
})

export type UpdateCollectionSchemaType = z.infer<typeof UpdateCollectionSchema>;
