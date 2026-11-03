/** Wire types for the CodeVault `/api/v1` REST API. */

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
