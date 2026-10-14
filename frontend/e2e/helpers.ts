import { test, expect, type Page } from "@playwright/test";

/**
 * Shared helpers: demo sign-in plus snippet setup/teardown through the real
 * UI, so every spec starts from a logged-in vault and leaves it clean.
 */

export async function signInDemo(page: Page) {
  const resp = await page.request.post("/api/auth/demo");
  expect(resp.status()).toBe(200);
  await page.goto("/dashboard");
  await expect(page.getByText(/Welcome back/)).toBeVisible();
}

export function uniqueTitle(prefix: string) {
  return `E2E ${prefix} ${Date.now().toString(36)}`;
}

/** Create a snippet through the composer; returns its detail URL + title. */
export async function createSnippet(
  page: Page,
  opts: { title: string; code?: string; visibility?: "private" | "public" },
) {
  await page.goto("/dashboard/new");
  await page.locator("#snippet-title").fill(opts.title);
  await page.locator(".monaco-editor").click();
  await page.keyboard.type(opts.code ?? "export const e2e = 1;", { delay: 5 });
  if (opts.visibility === "public") {
    // accessible name is lowercase — the capitalize is CSS-only
    await page.getByRole("button", { name: "public", exact: true }).click();
  }
  await page.getByRole("button", { name: /Save to vault/ }).click();
  await page.waitForURL(/\/dashboard\/snippets\/snip_/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: opts.title })).toBeVisible();
  return { url: page.url(), title: opts.title };
}

/** Two-click delete from the detail toolbar, back on the vault list. */
export async function deleteCurrentSnippet(page: Page) {
  const del = page.getByRole("button", { name: /Delete/ });
  await del.click();
  await page.getByRole("button", { name: /Click again to confirm/ }).click();
  await page.waitForURL(/\/dashboard\/snippets([?#]|$)/, { timeout: 20_000 });
}

export { test, expect };
