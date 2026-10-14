import type { Language } from "@/lib/languages";

export type Visibility = "private" | "public";

export type ShareLink = {
  /** opaque token in the /s/[token] URL */
  token: string;
  /** ISO datestring, or null for a link that never expires */
  expiresAt: string | null;
  /** ISO datestring the link was minted */
  createdAt: string;
  /** set when the owner revokes the link */
  revoked: boolean;
};

export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  visibility: Visibility;
  /** author id — the seed data uses the demo user */
  authorId: string;
  authorName: string;
  favorites: number;
  copies: number;
  createdAt: string;
  updatedAt: string;
  /** unlisted share links minted from a private snippet */
  shareLinks?: ShareLink[];
  /** id of the snippet this one was forked from, if any */
  forkedFromId?: string;
  forkedFromAuthor?: string;
};

/**
 * A Snippet as the DAL hands it to pages: identical shape, plus whether the
 * current viewer starred it. Cards and toolbars read `starred` instead of a
 * global favorites list, so server data flows one way — props down.
 */
export type HydratedSnippet = Snippet & {
  starred: boolean;
};

/**
 * A named folder of snippets. Collections are always private; sharing runs
 * exclusively through unlisted links (collectionLinks), mirroring the
 * snippet share_links pattern.
 */
export type Collection = {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  snippetCount: number;
  /** members, newest-added first (owner + link views only) */
  snippets?: HydratedSnippet[];
  /** outstanding links (owner view only) */
  shareLinks?: ShareLink[];
  createdAt: string;
  updatedAt: string;
};
