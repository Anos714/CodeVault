import { test, expect, signInDemo } from "./helpers";

test.describe("auth", () => {
  test("anonymous dashboard traffic lands on sign-in", async ({ page }) => {
    await page.goto("/dashboard/snippets");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("demo login opens the dashboard with real vault data", async ({
    page,
  }) => {
    await signInDemo(page);
    // seeded rows render from Neon, not mocks — the list shows the whole
    // vault (the overview only shows the 6 most recent)
    await page.goto("/dashboard/snippets");
    await expect(page.getByText("Tiny LRU cache").first()).toBeVisible();
  });

  test("social buttons redirect to the providers", async ({ page }) => {
    // signIn.social navigates the browser itself — assert the destination
    await page.goto("/auth");
    await page.getByRole("button", { name: /Google/i }).click();
    await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 20_000 });

    await page.goto("/auth");
    await page.getByRole("button", { name: /GitHub/i }).click();
    // GitHub may interpose a login page before the OAuth authorize screen
    await expect(page).toHaveURL(/github\.com\/login/, {
      timeout: 20_000,
    });
  });

  test("sign-out returns to a gated dashboard", async ({ page }) => {
    await signInDemo(page);
    await page.goto("/dashboard/settings");
    await page
      .getByRole("main")
      .getByRole("button", { name: /Sign out/ })
      .click();
    await expect(page).toHaveURL("/");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth/);
  });
});
