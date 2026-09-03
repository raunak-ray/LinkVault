import z from "zod";

export const CreateLinkSchema = z.object({
  title: z.string().optional(),
  url: z.url("Please enter a valid url"),
  collectionId: z.string(),
});

export type CreateLinkSchemaType = z.infer<typeof CreateLinkSchema>;
