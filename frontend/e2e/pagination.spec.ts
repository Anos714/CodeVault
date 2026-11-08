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

    // derive the totals from the counter instead of hardcoding them, so
    // leftover rows from an earlier run can't make the assertion stale
    const counter = page.getByText(/^\d+ of \d+ shown$/);
    await expect(counter).toBeVisible();
    const [, shown, total] = (await counter.textContent())!
      .match(/(\d+) of (\d+) shown/)!
      .map(Number);
    expect(shown).toBeLessThan(total);

    await loadMore.click();
    await expect(page.getByText(`${total} of ${total} shown`)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(title)).toBeVisible();
    await expect(loadMore).toHaveCount(0);

    await page.goto(url);
    await deleteCurrentSnippet(page);
  });
});
