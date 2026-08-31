import z from "zod";

export const CreateCollectionSchema = z.object({
    name: z.string("Name is required"),
    icon: z.string().optional(),
    color: z.string().optional()
})

export type CreateCollectionSchemaType = z.infer<typeof CreateCollectionSchema>;
