import { create } from "zustand";
import type { Snippet, Visibility } from "@/lib/snippet-data";
import { seedSnippets } from "@/lib/snippet-data";
import type { Language } from "@/lib/languages";

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
}));
