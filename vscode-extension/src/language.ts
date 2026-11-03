/** Map VS Code language ids to CodeVault's 19 supported slugs. */

import type { Language } from "./types";

const LANGUAGE_MAP: Record<string, Language> = {
  javascript: "javascript",
  javascriptreact: "jsx",
  typescript: "typescript",
  typescriptreact: "tsx",
  python: "python",
  go: "go",
  rust: "rust",
  java: "java",
  csharp: "csharp",
  cpp: "cpp",
  c: "cpp",
  php: "php",
  ruby: "ruby",
  shellscript: "shell",
  sh: "shell",
  sql: "sql",
  html: "html",
  css: "css",
  scss: "css",
  less: "css",
  json: "json",
  jsonc: "json",
  yaml: "yaml",
  yml: "yaml",
  markdown: "markdown",
};

export function toCodeVaultLanguage(languageId: string): Language {
  return LANGUAGE_MAP[languageId] ?? "typescript";
}
