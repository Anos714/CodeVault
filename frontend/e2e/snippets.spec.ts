import {
  test,
  expect,
  signInDemo,
  createSnippet,
  deleteCurrentSnippet,
  uniqueTitle,
} from "./helpers";

test.describe("snippet lifecycle", () => {
  test("create → detail → edit → star → delete", async ({ page }) => {
    await signInDemo(page);
    const title = uniqueTitle("lifecycle");
    await createSnippet(page, { title });

    // edit the title (base-ui renders the link with role="button")
    const edited = `${title} v2`;
    await page.getByRole("button", { name: /Edit snippet/ }).click();
    await expect(page).toHaveURL(/\/edit/);
    await page.locator("#snippet-title").fill(edited);
    await page.getByRole("button", { name: /Save changes/ }).click();
    await page.waitForURL(/\/dashboard\/snippets\/snip_[^/]+$/, {
      timeout: 20_000,
    });
    await expect(page.getByRole("heading", { name: edited })).toBeVisible();

    // star it — the toolbar button flips with the action result
    const star = page.locator("button[aria-pressed]");
    await expect(star).toHaveAttribute("aria-pressed", "false");
    await star.click();
    await expect(star).toHaveAttribute("aria-pressed", "true", {
      timeout: 15_000,
    });

    // delete from the toolbar, back on the list without the title
    await deleteCurrentSnippet(page);
    await expect(page.getByText(edited)).toHaveCount(0);
  });

  test("owners see no fork button on their own snippet", async ({ page }) => {
    await signInDemo(page);
    const title = uniqueTitle("own-fork");
    const { url } = await createSnippet(page, {
      title,
      visibility: "public",
    });
    const id = url.split("/").pop()!;

    await expect(page.getByRole("button", { name: "Fork" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Share", exact: true })).toBeVisible();

    // the public id doubles as a share URL
    await page.goto(`/s/${id}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    await page.goto(`/dashboard/snippets/${id}`);
    await deleteCurrentSnippet(page);
  });
});
