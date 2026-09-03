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

test("chatbot opens within the mobile viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle chat" }).click();
  const dialog = page.getByPlaceholder("Ask about my projects...");
  await expect(dialog).toBeVisible();
  const box = await page.getByTestId("chatbot-shell").boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThanOrEqual((page.viewportSize()?.height ?? 844) - 80);
});
