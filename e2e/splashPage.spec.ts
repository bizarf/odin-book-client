import { test, expect } from "@playwright/test";
import "dotenv/config";

test("user successfully logs in", async ({ page }) => {
    await page.goto("http://localhost:5173/odin-book-client/#/");
    await page.getByLabel("Username").click();
    await page.getByLabel("Username").fill(process.env.TESTUSER!);
    await page.getByLabel("Username").press("Tab");
    await page.getByLabel("Password").fill(process.env.TESTPASSWORD!);
    await page.getByLabel("Password").press("Enter");
    await page.goto("http://localhost:5173/odin-book-client/#/main");
    await expect(page.getByRole("button", { name: "My feed" })).toBeVisible();
});
