import { test, expect } from "@playwright/test";

test("has title", async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/tapnosh/);
});
