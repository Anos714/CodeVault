import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  coerceSettings,
  disconnect,
  getSettings,
  isConnected,
  saveSettings,
  SETTINGS_KEY,
} from "../src/shared/storage";
import { DEFAULT_SETTINGS } from "../src/shared/types";

const store = new Map<string, unknown>();

const chromeMock = {
  storage: {
    local: {
      get: async (key: string) => ({ [key]: store.get(key) }),
      set: async (items: Record<string, unknown>) => {
        for (const [key, value] of Object.entries(items)) store.set(key, value);
      },
    },
  },
};

beforeEach(() => {
  store.clear();
  vi.stubGlobal("chrome", chromeMock);
});

describe("settings storage", () => {
  it("returns defaults on a fresh install", async () => {
    await expect(getSettings()).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it("persists a patch and reads it back", async () => {
    const saved = await saveSettings({
      baseUrl: "https://vault.example.com/",
      token: "cv_pat_abc",
      defaultVisibility: "public",
    });

    expect(saved.baseUrl).toBe("https://vault.example.com");
    expect(saved.token).toBe("cv_pat_abc");
    expect(saved.defaultVisibility).toBe("public");
    expect(store.get(SETTINGS_KEY)).toEqual(saved);
    await expect(getSettings()).resolves.toEqual(saved);
  });

  it("repairs corrupt stored values", () => {
    const repaired = coerceSettings({
      baseUrl: "not a url",
      token: "   ",
      defaultVisibility: "weird",
    });
    expect(repaired.baseUrl).toBe(DEFAULT_SETTINGS.baseUrl);
    expect(repaired.token).toBeNull();
    expect(repaired.defaultVisibility).toBe("private");
  });

  it("keeps a stored token when only visibility changes", async () => {
    await saveSettings({ token: "cv_pat_keep" });
    const next = await saveSettings({ defaultVisibility: "public" });
    expect(next.token).toBe("cv_pat_keep");
    expect(next.defaultVisibility).toBe("public");
  });

  it("disconnect removes the token but keeps the URL", async () => {
    await saveSettings({ baseUrl: "http://localhost:4000", token: "cv_pat_x" });
    const next = await disconnect();
    expect(next.token).toBeNull();
    expect(next.baseUrl).toBe("http://localhost:4000");
    expect(isConnected(next)).toBe(false);
  });
});
