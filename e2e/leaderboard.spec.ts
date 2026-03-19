import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Leaderboard Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/leaderboard`);
  });

  test("should display page title", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /shame_leaderboard/i })).toBeVisible();
    await expect(page.getByText("// the most roasted code on the internet")).toBeVisible();
  });

  test("should display dynamic stats from database", async ({ page }) => {
    const statsText = page.getByText(/\d+ submissions/);
    await expect(statsText).toBeVisible();
    
    const stats = await statsText.textContent();
    const submissionCount = parseInt(stats?.match(/\d+/)?.[0] || "0");
    expect(submissionCount).toBeGreaterThan(0);

    const avgScoreText = page.getByText(/avg score:/);
    await expect(avgScoreText).toBeVisible();
    const avgScoreContent = await avgScoreText.textContent();
    expect(avgScoreContent).toMatch(/avg score: \d+\.\d+\/10/);
  });

  test("should show 20 items on leaderboard page", async ({ page }) => {
    const entries = page.locator('[class*="rounded-md border border-[#2A2A2A] bg-[#0A0A0A]"]');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(20);
  });

  test("should order items by score ascending", async ({ page }) => {
    const scores = page.locator('[class*="text-[#EF4444]"]');
    const scoreCount = await scores.count();
    
    const scoreValues: number[] = [];
    for (let i = 0; i < Math.min(scoreCount, 20); i++) {
      const scoreText = await scores.nth(i).textContent();
      const score = parseFloat(scoreText || "0");
      scoreValues.push(score);
    }
    
    for (let i = 1; i < scoreValues.length; i++) {
      expect(scoreValues[i]).toBeGreaterThanOrEqual(scoreValues[i - 1]);
    }
  });

  test("should display score in red color", async ({ page }) => {
    const firstScore = page.locator('[class*="text-[#EF4444]"]').first();
    await expect(firstScore).toBeVisible();
    const className = await firstScore.getAttribute("class");
    expect(className).toContain("text-[#EF4444]");
  });

  test("should have expandable code blocks for entries with many lines", async ({ page }) => {
    const showMoreButtons = page.getByRole("button", { name: /show more/ });
    const buttonCount = await showMoreButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    const firstShowMore = showMoreButtons.first();
    await firstShowMore.click();
    await expect(page.getByRole("button", { name: /show less/ })).toBeVisible();
  });

  test("should display language and mood emoji for each entry", async ({ page }) => {
    const entries = page.locator('[class*="rounded-md border border-[#2A2A2A] bg-[#0A0A0A]"]');
    const firstEntry = entries.first();
    
    const language = firstEntry.locator("span").filter({ hasText: /^(swift|javascript|typescript|python|java|kotlin|ruby|php|c|css|sql|go|html|c\+\+|c#|rust)$/i }).first();
    await expect(language).toBeVisible();
    
    const emoji = firstEntry.locator("span").filter({ hasText: /(💀|🔥)/ }).first();
    await expect(emoji).toBeVisible();
  });

  test("should display correct ranking numbers", async ({ page }) => {
    const rankNumbers = page.getByText(/^#\d+$/).all();
    const ranks = await rankNumbers;
    expect(ranks.length).toBeGreaterThanOrEqual(20);
  });
});

test.describe("Leaderboard vs Homepage Consistency", () => {
  test("should show matching top 3 scores on both pages", async ({ page, context }) => {
    await page.goto(`${BASE_URL}/leaderboard`);
    await page.waitForLoadState("networkidle");

    const leaderboardTop3: string[] = [];
    
    for (let i = 0; i < 3; i++) {
      const entry = page.locator('[class*="rounded-md border border-[#2A2A2A] bg-[#0A0A0A]"]').nth(i);
      const score = await entry.locator('[class*="text-[#EF4444]"]').textContent();
      leaderboardTop3.push(score?.trim() || "");
    }

    const homepage = await context.newPage();
    await homepage.goto(`${BASE_URL}/`);
    await homepage.waitForLoadState("networkidle");

    const homepageTop3: string[] = [];
    
    const homepageEntries = await homepage.locator('[class*="rounded-md border border-[#2A2A2A] bg-[#0A0A0A]"]').all();
    for (let i = 0; i < 3 && i < homepageEntries.length; i++) {
      const entry = homepageEntries[i];
      const scoreElement = entry.locator("span").filter({ hasText: /^\d+\.\d+$/ }).first();
      const score = await scoreElement.textContent();
      homepageTop3.push(score?.trim() || "");
    }

    for (let i = 0; i < 3; i++) {
      expect(leaderboardTop3[i]).toBe(homepageTop3[i]);
    }

    await homepage.close();
  });

  test("should link to roast details from homepage", async ({ page, context }) => {
    const homepage = await context.newPage();
    await homepage.goto(`${BASE_URL}/`);
    await homepage.waitForLoadState("networkidle");

    const homepageFirstLink = homepage.locator('a[href^="/roast/"]').first();
    await expect(homepageFirstLink).toBeVisible();
    const homepageFirstUrl = await homepageFirstLink.getAttribute("href");
    expect(homepageFirstUrl).toMatch(/\/roast\/\d+/);

    await homepage.close();
  });
});
