"use client";

import { useEffect } from "react";
import { useAuthStore, type User } from "@/store/auth.store";

const STORAGE_KEY = "codevault.session";

/**
 * Resolves the demo session on the client. The production version reads a
 * JWT from an httpOnly cookie via /api/auth/session — this keeps the flow
 * identical from the dashboard's point of view while that route is pending.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const signIn = useAuthStore((state) => state.signIn);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!loading) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) signIn(JSON.parse(stored) as User);
      else useAuthStore.setState({ loading: false });
    } catch {
      useAuthStore.setState({ loading: false });
    }
  }, [signIn, loading]);

  return <>{children}</>;
}

export function persistSession(user: User) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable */
  }
}

export function clearPersistedSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}
