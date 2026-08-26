import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email().nonempty(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[A-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
})

export type LoginSchemaType = z.infer<typeof LoginSchema>;
