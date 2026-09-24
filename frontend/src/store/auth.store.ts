import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  /** avatar image URL, or null to fall back to initials */
  image: string | null;
};

type AuthState = {
  user: User | null;
  /** true until the session is resolved on the client */
  loading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

/**
 * Demo session. The real version resolves a JWT from an httpOnly cookie via the
 * /api/auth/session route — this keeps the dashboard UX testable before that
 * route exists.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: (user) => set({ user, loading: false }),
  signOut: () => set({ user: null, loading: false }),
}));
