import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be 8 characters"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
