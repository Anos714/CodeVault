/**
 * Languages CodeVault recognises. Kept intentionally small and syntax-aware —
 * the editor surface grows when the Monaco integration lands.
 */
export const LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "go",
  "rust",
  "java",
  "csharp",
  "cpp",
  "php",
  "ruby",
  "shell",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
] as const;

export type Language = (typeof LANGUAGES)[number];

/** A mono label plus a token colour from the syntax palette */
export const LANGUAGE_META: Record<
  Language,
  { label: string; color: string }
> = {
  javascript: { label: "JavaScript", color: "text-syntax-number" },
  typescript: { label: "TypeScript", color: "text-syntax-function" },
  jsx: { label: "JSX", color: "text-syntax-number" },
  tsx: { label: "TSX", color: "text-syntax-function" },
  python: { label: "Python", color: "text-syntax-keyword" },
  go: { label: "Go", color: "text-syntax-string" },
  rust: { label: "Rust", color: "text-syntax-number" },
  java: { label: "Java", color: "text-syntax-function" },
  csharp: { label: "C#", color: "text-syntax-function" },
  cpp: { label: "C++", color: "text-syntax-function" },
  php: { label: "PHP", color: "text-syntax-keyword" },
  ruby: { label: "Ruby", color: "text-syntax-keyword" },
  shell: { label: "Shell", color: "text-syntax-string" },
  sql: { label: "SQL", color: "text-syntax-string" },
  html: { label: "HTML", color: "text-syntax-number" },
  css: { label: "CSS", color: "text-syntax-keyword" },
  json: { label: "JSON", color: "text-syntax-comment" },
  yaml: { label: "YAML", color: "text-syntax-string" },
  markdown: { label: "Markdown", color: "text-syntax-comment" },
};

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}
