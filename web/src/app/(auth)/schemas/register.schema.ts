import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters").trim(),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be 8 characters long")
    .regex(/[A-Z]/, "Password must contains atleast one uppercase letter")
    .regex(/[a-z]/, "Password must contains atleast one lowercase characters")
    .regex(/[0-9]/, "Password must contains atleast one number"),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
