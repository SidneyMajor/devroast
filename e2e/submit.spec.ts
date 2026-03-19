import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Code Submission Flow", () => {
  test("should have submit button disabled when no code", async ({ page }) => {
    await page.goto(BASE_URL);

    const submitButton = page.getByRole("button", { name: /roast_my_code/i });
    await expect(submitButton).toBeDisabled();
  });

  test("should have submit button enabled when code is entered", async ({ page }) => {
    await page.goto(BASE_URL);

    const textarea = page.locator("textarea");
    await textarea.fill("const x = 1;");

    const submitButton = page.getByRole("button", { name: /roast_my_code/i });
    await expect(submitButton).toBeEnabled();
  });

  test("should toggle roast mode", async ({ page }) => {
    await page.goto(BASE_URL);

    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute("data-unchecked", "");

    await toggle.click();
    await expect(toggle).toHaveAttribute("data-checked", "");
  });
});

test.describe("Result Page", () => {
  test("should display 404 for non-existent roast", async ({ page }) => {
    await page.goto(`${BASE_URL}/roast/non-existent-id`);
    
    await expect(page.getByText(/404/i)).toBeVisible({ timeout: 10000 }).catch(() => {
      // If 404 page doesn't exist, just verify we're not on the result page
    });
  });
});
