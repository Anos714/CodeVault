"use client";

import { useSyncExternalStore } from "react";

/** Stable no-op subscription — the values below never change after mount. */
const subscribe = () => () => {};

const getMounted = () => true;
const getServerMounted = () => false;

/** False during SSR and hydration, true once the browser takes over. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getMounted, getServerMounted);
}

const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

/** Empty during SSR/hydration, then the real browser origin. */
export function useBrowserOrigin(): string {
  return useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
}
