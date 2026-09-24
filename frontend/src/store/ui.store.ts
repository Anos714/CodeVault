import { create } from "zustand";

export type DemoLanguage = "javascript" | "typescript" | "python";

type UIState = {
  /** mobile navigation drawer */
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  /** interactive hero/code-demo language picker */
  activeDemoLanguage: DemoLanguage;
  setActiveDemoLanguage: (language: DemoLanguage) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  activeDemoLanguage: "javascript",
  setActiveDemoLanguage: (language) => set({ activeDemoLanguage: language }),
}));
