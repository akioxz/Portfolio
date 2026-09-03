import { expect, test } from "@playwright/test";

test("public portfolio loads on desktop and mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Axel Villanueva|Portfolio/i);
  await expect(page.locator("body")).toContainText(/contact|projects/i);
});

test("admin inbox redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/admin/inbox");
  await expect(page).toHaveURL(/\/admin\/login/);
});
