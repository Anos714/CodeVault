import { create } from "zustand";

export type DemoLanguage = "javascript" | "typescript" | "python";

type UIState = {
  /** landing-page mobile navigation drawer */
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  /** interactive hero/code-demo language picker */
  activeDemoLanguage: DemoLanguage;
  setActiveDemoLanguage: (language: DemoLanguage) => void;

  /** dashboard sidebar — collapsed on desktop, a drawer on mobile */
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  /** snippet composer draft, shared between the form and its live preview */
  composerLanguage: DemoLanguage;
  setComposerLanguage: (language: DemoLanguage) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  activeDemoLanguage: "javascript",
  setActiveDemoLanguage: (language) => set({ activeDemoLanguage: language }),

  isSidebarCollapsed: false,
  isSidebarOpen: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  composerLanguage: "javascript",
  setComposerLanguage: (language) => set({ composerLanguage: language }),
}));
