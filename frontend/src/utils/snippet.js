import { z } from "zod";

export const snippetSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters")
    .trim(),

  language: z.string().min(1, "Please select a language"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description is too long (max 500 chars)")
    .trim(),

  code: z
    .string()
    .min(10, "Code snippet is too short")
    .refine((val) => val !== "// Write your code here...", {
      message: "Please replace the default placeholder with actual code",
    }),

  // NEW: Visibility Field
  visibility: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Please select visibility type" }),
  }),

  tags: z.string().optional(),
});
