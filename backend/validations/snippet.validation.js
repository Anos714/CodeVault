import joi from "joi";

export const snippetSchema = joi.object({
  title: joi.string().min(1).max(100).required(),
  description: joi.string().max(500).allow(""),
  code: joi.string().min(1).required(),
  language: joi.string().required(),
  tags: joi.array().items(joi.string()),
  visibility: joi.string().valid("public", "private").required(),
});

export const patchedSnippetSchema = joi.object({
  title: joi.string().min(1).max(100),
  description: joi.string().max(500).allow(""),
  code: joi.string().min(1),
  language: joi.string(),
  tags: joi.array().items(joi.string()),
  visibility: joi.string().valid("public", "private"),
});
