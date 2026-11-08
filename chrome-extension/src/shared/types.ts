/** Wire types shared by the popup, options page, save window, and worker. */

export type Visibility = "private" | "public";

export type Language =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "csharp"
  | "cpp"
  | "php"
  | "ruby"
  | "shell"
  | "sql"
  | "html"
  | "css"
  | "json"
  | "yaml"
  | "markdown";

export const LANGUAGES: readonly Language[] = [
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
];

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  defaultPrivate: boolean;
  createdAt: string;
};

export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  visibility: Visibility;
  authorId: string;
  authorName: string;
  favorites: number;
  copies: number;
  createdAt: string;
  updatedAt: string;
  forkedFromId?: string;
  forkedFromAuthor?: string;
};

export type SnippetList = {
  snippets: Snippet[];
  total: number;
  nextCursor: string | null;
};

export type CreateSnippetInput = {
  title: string;
  description?: string;
  language: Language;
  tags?: string[];
  code: string;
  visibility: Visibility;
};

export type UpdateSnippetInput = Partial<CreateSnippetInput>;

export type Settings = {
  baseUrl: string;
  token: string | null;
  defaultVisibility: Visibility;
};

export const DEFAULT_SETTINGS: Settings = {
  baseUrl: "https://codevault-olive.vercel.app",
  token: null,
  defaultVisibility: "private",
};

export type PendingSave = {
  title: string;
  code: string;
  url: string;
  language: Language;
  visibility: Visibility;
};
