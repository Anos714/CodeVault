import { test, expect, signInDemo } from "./helpers";

test.describe("vault discovery", () => {
  test("search, tag and visibility filters narrow the list", async ({
    page,
  }) => {
    await signInDemo(page);
    await page.goto("/dashboard/snippets");

    // text search hits the DAL, not the client
    await page.getByLabel("Search snippets").fill("lru");
    await expect(page.getByText("Tiny LRU cache")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Debounce a function")).toHaveCount(0);
    await expect(page).toHaveURL(/q=lru/);

    // tag deep-link from the URL filters too
    await page.goto("/dashboard/snippets?tag=go");
    await expect(page.getByText("Graceful shutdown in Go")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Tiny LRU cache")).toHaveCount(0);
  });

  test("explore shows public seeds and tags carry counts", async ({
    page,
  }) => {
    await signInDemo(page);

    await page.goto("/dashboard/explore");
    await expect(page.getByText("Tiny LRU cache").first()).toBeVisible();

    await page.goto("/dashboard/tags");
    const perf = page.getByRole("link", { name: /performance/ });
    await expect(perf).toBeVisible();
    await perf.click();
    await expect(page).toHaveURL(/tag=performance/);
    await expect(page.getByText("Debounce a function").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
