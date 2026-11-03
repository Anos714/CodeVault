import { test, expect, signInDemo, uniqueTitle } from "./helpers";

/**
 * The settings UI is the only place a user can mint a token for the
 * extensions, so it gets its own end-to-end pass: create → show once →
 * reload (secret gone) → revoke → the token stops authenticating.
 */

test.describe("settings — API tokens", () => {
  test("create, show once, list, and revoke", async ({ page }) => {
    await signInDemo(page);
    await page.goto("/dashboard/settings");

    const name = uniqueTitle("ui token");
    await page.getByLabel("Token name").fill(name);
    await page.getByRole("button", { name: "Create token" }).click();

    const raw = page.getByTestId("raw-api-token");
    await expect(raw).toBeVisible({ timeout: 20_000 });
    const token = (await raw.textContent())?.trim() ?? "";
    expect(token).toMatch(/^cv_pat_[A-Za-z0-9_-]{32,}$/);

    const row = page.locator("li").filter({ hasText: name }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(token.slice(0, 13));

    // the secret is shown once — a reload must not bring it back
    await page.reload();
    await expect(page.getByTestId("raw-api-token")).toHaveCount(0);
    const reloadedRow = page.locator("li").filter({ hasText: name }).first();
    await expect(reloadedRow).toBeVisible();
    await expect(reloadedRow).not.toContainText(token);

    // two-click revoke
    await reloadedRow.getByRole("button", { name: "Revoke" }).click();
    await reloadedRow
      .getByRole("button", { name: "Confirm revoke" })
      .click();
    await expect(reloadedRow.getByText("revoked")).toBeVisible({
      timeout: 15_000,
    });

    // revoked means revoked
    const response = await page.request.get("/api/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(401);
    expect((await response.json()).error.code).toBe("invalid_token");
  });
});
