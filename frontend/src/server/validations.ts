/**
 * Server-side input validation — the single contract for every snippet
 * mutation.
 *
 * The constraints mirror the composer UI (dashboard/new + edit pages) so a
 * request that passes the client form also passes here, and vice versa:
 * title ≤ 80, description ≤ 220, at most 5 tags. `code` is capped at 200k
 * chars to stay well under the 1MB Server Action body limit.
 *
 * Only imported from server code (actions, DAL, route handlers). Client
 * components keep their own lightweight checks for instant feedback.
 */

import { z } from "zod";

import { LANGUAGES } from "@/lib/languages";

/** Row id — `snip_<uuid>` for snippets, opaque text otherwise. */
export const snippetIdSchema = z.string().trim().min(1).max(128);

const titleSchema = z.string().trim().min(1, "Give the snippet a title.").max(80);

const descriptionSchema = z.string().trim().max(220).default("");

const languageSchema = z.enum(LANGUAGES);

const rawTagSchema = z.string().trim().min(1).max(40);

const tagsSchema = z
  .array(rawTagSchema)
  .max(5)
  .default([])
  .transform((tags) =>
    [...new Set(tags.map((tag) => tag.toLowerCase().replace(/^#/, "").trim()).filter(Boolean))].slice(
      0,
      5,
    ),
  );

const codeSchema = z
  .string()
  .min(1, "Paste or write some code.")
  .max(200_000, "Snippet is too large.");

const visibilitySchema = z.enum(["private", "public"]).default("private");

export const createSnippetSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  language: languageSchema,
  tags: tagsSchema,
  code: codeSchema,
  visibility: visibilitySchema,
});

export type CreateSnippetInput = z.input<typeof createSnippetSchema>;
export type CreateSnippetData = z.output<typeof createSnippetSchema>;

/** Partial update — at least one field must be present. */
export const updateSnippetSchema = z
  .object({
    title: titleSchema.optional(),
    description: z.string().trim().max(220).optional(),
    language: languageSchema.optional(),
    tags: z
      .array(rawTagSchema)
      .max(5)
      .transform((tags) =>
        [...new Set(tags.map((tag) => tag.toLowerCase().replace(/^#/, "").trim()).filter(Boolean))].slice(
          0,
          5,
        ),
      )
      .optional(),
    code: z.string().min(1).max(200_000).optional(),
    visibility: z.enum(["private", "public"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Nothing to update.",
  });

export type UpdateSnippetInput = z.input<typeof updateSnippetSchema>;
export type UpdateSnippetData = z.output<typeof updateSnippetSchema>;

/** Matches SHARE_EXPIRY_OPTIONS in lib/share.ts (null = never). */
export const shareExpirySchema = z.union([
  z.null(),
  z.literal(1),
  z.literal(7),
  z.literal(30),
]);

export type ShareExpiryInput = z.input<typeof shareExpirySchema>;

/** Row id — `col_<uuid>` for collections. */
export const collectionIdSchema = z.string().trim().min(1).max(128);

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Give the collection a name.").max(60),
  description: z.string().trim().max(220).default(""),
});

export type CreateCollectionData = z.output<typeof createCollectionSchema>;

export const updateCollectionSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    description: z.string().trim().max(220).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Nothing to update.",
  });

export type UpdateCollectionData = z.output<typeof updateCollectionSchema>;
