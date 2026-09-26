import { create } from "zustand";
import type { Snippet, Visibility, ShareLink } from "@/lib/snippet-data";
import { seedSnippets } from "@/lib/snippet-data";
import type { Language } from "@/lib/languages";
import { mintShareLink, type ShareExpiryDays } from "@/lib/share";

export type NewSnippet = {
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  visibility: Visibility;
};

type SnippetState = {
  snippets: Snippet[];
  /** ids the current user has starred */
  favorites: string[];
  addSnippet: (input: NewSnippet, author: { id: string; name: string }) => Snippet;
  updateSnippet: (id: string, input: Partial<NewSnippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementCopies: (id: string) => void;
  /** mint an unlisted /s/[token] link off a private snippet */
  createShareLink: (id: string, expiry: ShareExpiryDays) => ShareLink | null;
  /** invalidate every outstanding link for a snippet */
  revokeShareLinks: (id: string) => void;
  /** copy someone else's snippet into your own vault, crediting the original */
  forkSnippet: (id: string, author: { id: string; name: string }) => Snippet | null;
};

const byUpdated = (a: Snippet, b: Snippet) =>
  b.updatedAt.localeCompare(a.updatedAt);

export const useSnippetStore = create<SnippetState>((set) => ({
  snippets: [...seedSnippets].sort(byUpdated),

  favorites: ["snip_lru", "snip_go_graceful"],

  addSnippet: (input, author) => {
    const now = new Date().toISOString();
    const snippet: Snippet = {
      ...input,
      authorId: author.id,
      authorName: author.name,
      id: `snip_${crypto.randomUUID()}`,
      favorites: 0,
      copies: 0,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ snippets: [snippet, ...state.snippets] }));
    return snippet;
  },

  updateSnippet: (id, input) =>
    set((state) => ({
      snippets: state.snippets
        .map((snippet) =>
          snippet.id === id
            ? { ...snippet, ...input, updatedAt: new Date().toISOString() }
            : snippet,
        )
        .sort(byUpdated),
    })),

  deleteSnippet: (id) =>
    set((state) => ({
      snippets: state.snippets.filter((snippet) => snippet.id !== id),
      favorites: state.favorites.filter((favoriteId) => favoriteId !== id),
    })),

  toggleFavorite: (id) =>
    set((state) => {
      const isFavorite = state.favorites.includes(id);
      return {
        favorites: isFavorite
          ? state.favorites.filter((favoriteId) => favoriteId !== id)
          : [...state.favorites, id],
        snippets: state.snippets.map((snippet) =>
          snippet.id === id
            ? {
                ...snippet,
                favorites: isFavorite
                  ? Math.max(0, snippet.favorites - 1)
                  : snippet.favorites + 1,
              }
            : snippet,
        ),
      };
    }),

  incrementCopies: (id) =>
    set((state) => ({
      snippets: state.snippets.map((snippet) =>
        snippet.id === id ? { ...snippet, copies: snippet.copies + 1 } : snippet,
      ),
    })),

  createShareLink: (id, expiry) => {
    let created: ShareLink | null = null;
    set((state) => ({
      snippets: state.snippets.map((snippet) => {
        if (snippet.id !== id) return snippet;
        // carry over any prior links so revocation history isn't lost
        const links = [...(snippet.shareLinks ?? []), (created = mintShareLink(expiry))];
        return { ...snippet, shareLinks: links, updatedAt: new Date().toISOString() };
      }),
    }));
    return created;
  },

  revokeShareLinks: (id) =>
    set((state) => ({
      snippets: state.snippets.map((snippet) =>
        snippet.id === id && snippet.shareLinks?.length
          ? {
              ...snippet,
              shareLinks: snippet.shareLinks.map((link) => ({
                ...link,
                revoked: true,
              })),
              updatedAt: new Date().toISOString(),
            }
          : snippet,
      ),
    })),

  forkSnippet: (id, author) => {
    const original = useSnippetStore.getState().snippets.find((s) => s.id === id);
    if (!original) return null;

    const now = new Date().toISOString();
    const fork: Snippet = {
      ...original,
      id: `snip_${crypto.randomUUID()}`,
      authorId: author.id,
      authorName: author.name,
      // a fork starts private and loses the original's share links
      visibility: "private",
      shareLinks: [],
      favorites: 0,
      copies: 0,
      createdAt: now,
      updatedAt: now,
      forkedFromId: original.id,
      forkedFromAuthor: original.authorName,
    };
    set((state) => ({ snippets: [fork, ...state.snippets] }));
    return fork;
  },
}));
