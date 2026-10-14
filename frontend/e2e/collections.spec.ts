import { test, expect, signInDemo } from "./helpers";

function uniqueName(prefix: string) {
  return `E2E ${prefix} ${Date.now().toString(36)}`;
}

test.describe("collections", () => {
  test("create → rename → add → share loop → remove → delete", async ({
    page,
    context,
  }) => {
    await signInDemo(page);
    const name = uniqueName("folder");

    // create from the list page, landing on the detail view
    await page.goto("/dashboard/collections");
    await page.getByLabel("Collection name").fill(name);
    await page.getByRole("button", { name: /New collection/ }).click();
    await page.waitForURL(/\/dashboard\/collections\/col_/, { timeout: 20_000 });
    const detailUrl = page.url();
    await expect(page.getByRole("heading", { name })).toBeVisible();

    // rename + describe
    await page.getByLabel("Name", { exact: true }).fill(`${name} v2`);
    await page.getByLabel("Description").fill("folders group related work");
    await page.getByRole("button", { name: /Save changes/ }).click();
    await expect(page.getByText("Saved")).toBeVisible({ timeout: 15_000 });

    // file a seeded snippet away
    await page
      .getByLabel("Pick a snippet from your vault")
      .selectOption({ label: "Tiny LRU cache" });
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText("Tiny LRU cache").first()).toBeVisible({
      timeout: 15_000,
    });

    // mint an unlisted folder link…
    await page.getByRole("button", { name: "Create unlisted link" }).click();
    const linkCode = page.locator("li code").first();
    await expect(linkCode).toBeVisible({ timeout: 15_000 });
    const folderUrl = (await linkCode.textContent())?.trim() ?? "";
    expect(folderUrl).toMatch(/\/c\/[0-9a-f]{32}$/);

    // …a logged-out window sees the folder and its member…
    const anon = await context.newPage();
    await anon.goto(new URL(folderUrl).pathname);
    await expect(
      anon.getByRole("heading", { name: `${name} v2` }),
    ).toBeVisible();
    await expect(anon.getByText("Tiny LRU cache").first()).toBeVisible();
    await expect(anon.getByText(/unlisted folder/)).toBeVisible();

    // …until the owner revokes every link
    await page.getByRole("button", { name: /Revoke all links/ }).click();
    await expect(page.getByText("revoked").first()).toBeVisible({
      timeout: 15_000,
    });
    const gone = await anon.goto(new URL(folderUrl).pathname);
    expect(gone?.status()).toBe(404);
    await anon.close();

    // unfile the member, then delete the folder (snippets survive)
    const memberCard = page
      .locator("article", { hasText: "Tiny LRU cache" })
      .first();
    await memberCard.getByRole("button", { name: "Delete snippet" }).click();
    await expect(
      page.locator("article", { hasText: "Tiny LRU cache" }),
    ).toHaveCount(0, { timeout: 15_000 });

    const del = page.getByRole("button", { name: /Delete/ });
    await del.click();
    await page
      .getByRole("button", { name: /Click again to confirm/ })
      .click();
    await page.waitForURL(/\/dashboard\/collections([?#]|$)/, {
      timeout: 20_000,
    });
    await expect(page.getByText(`${name} v2`)).toHaveCount(0);

    // the seed snippet itself is untouched
    await page.goto("/dashboard/snippets/snip_lru");
    await expect(
      page.getByRole("heading", { name: "Tiny LRU cache" }),
    ).toBeVisible();
  });
});
