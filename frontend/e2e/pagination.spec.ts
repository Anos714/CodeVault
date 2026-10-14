import {
  test,
  expect,
  signInDemo,
  createSnippet,
  deleteCurrentSnippet,
  uniqueTitle,
} from "./helpers";

test.describe("vault pagination", () => {
  test("load more appends the next keyset page", async ({ page }) => {
    await signInDemo(page);
    // 12 seeded rows fill the first page exactly — one more unlocks paging
    const title = uniqueTitle("paged");
    const { url } = await createSnippet(page, { title });
    await page.goto("/dashboard/snippets");

    const loadMore = page.getByRole("button", { name: /Load more/ });
    await expect(loadMore).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("12 of 13 shown")).toBeVisible();

    await loadMore.click();
    await expect(page.getByText("13 of 13 shown")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(title)).toBeVisible();
    await expect(loadMore).toHaveCount(0);

    await page.goto(url);
    await deleteCurrentSnippet(page);
  });
});
