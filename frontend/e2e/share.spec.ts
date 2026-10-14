import {
  test,
  expect,
  signInDemo,
  createSnippet,
  deleteCurrentSnippet,
  uniqueTitle,
} from "./helpers";

test.describe("unlisted share loop", () => {
  test("mint → open logged-out → revoke → 404", async ({
    page,
    context,
  }) => {
    await signInDemo(page);
    const title = uniqueTitle("shared");
    const { url } = await createSnippet(page, { title });

    // mint a never-expiring link from the share dialog (keyboard-driven:
    // the animated overlay never settles under smooth-scroll hit-testing)
    await page.getByRole("button", { name: "Share", exact: true }).click();
    const mint = page.getByRole("button", {
      name: "Create unlisted link",
      exact: true,
    });
    await mint.focus();
    await page.keyboard.press("Enter");
    const linkCode = page.locator("li code").first();
    await expect(linkCode).toBeVisible({ timeout: 15_000 });
    const shareUrl = (await linkCode.textContent())?.trim() ?? "";
    expect(shareUrl).toMatch(/\/s\/[0-9a-f]{32}$/);
    // the dialog has no Escape handler — close it with its X button
    await page.getByRole("button", { name: "Close share dialog" }).click();

    // a logged-out window sees the title with the unlisted badge…
    const anon = await context.newPage();
    await anon.goto(new URL(shareUrl).pathname);
    await expect(
      anon.getByRole("heading", { name: title }),
    ).toBeVisible();
    await expect(anon.getByText("unlisted link")).toBeVisible();

    // …until the owner revokes all links
    await page.getByRole("button", { name: "Share", exact: true }).click();
    const revoke = page.getByRole("button", { name: /Revoke all links/ });
    await revoke.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("revoked").first()).toBeVisible({
      timeout: 15_000,
    });
    const gone = await anon.goto(new URL(shareUrl).pathname);
    expect(gone?.status()).toBe(404);
    await anon.close();

    await page.goto(url);
    await deleteCurrentSnippet(page);
  });

  test("embed renders a public snippet without a session", async ({
    page,
    context,
  }) => {
    await signInDemo(page);
    const title = uniqueTitle("embedded");
    const { url } = await createSnippet(page, {
      title,
      visibility: "public",
    });
    const id = url.split("/").pop()!;

    const anon = await context.newPage();
    await anon.goto(`/embed/${id}`);
    await expect(anon.getByText(title)).toBeVisible();
    await anon.close();

    await page.goto(url);
    await deleteCurrentSnippet(page);
  });
});
