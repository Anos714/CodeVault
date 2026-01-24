import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (val) => /[a-z]/.test(val),
      "Password must contain at least one lowercase letter",
    )
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter",
    )
    .refine(
      (val) => /[!@#$%^&*]/.test(val),
      "Password must contain at least one symbol",
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number",
    ),
});
