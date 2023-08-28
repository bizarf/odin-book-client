import { test, expect } from "@playwright/test";
import "dotenv/config";

test.describe("header navigation tests", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.setTimeout(testInfo.timeout + 30000);
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").click();
        await page.getByLabel("Username").fill(process.env.TESTUSER!);
        await page.getByLabel("Username").press("Tab");
        await page.getByLabel("Password").fill(process.env.TESTPASSWORD!);
        await page.getByLabel("Password").press("Enter");
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main"
        );
    });

    test("user clicks the friends link", async ({ page }) => {
        await page.getByRole("link", { name: "Friends", exact: true }).click();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main/friends-list"
        );
        await expect(
            page.getByRole("heading", { name: "Friends list" })
        ).toBeVisible();
    });

    test("user clicks the pending friend requests link", async ({ page }) => {
        await page.getByRole("link", { name: "Pending Friends" }).click();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main/pending-friends"
        );
        await expect(
            page.getByRole("heading", {
                name: "Pending friend requests",
                exact: true,
            })
        ).toBeVisible();
    });

    test("user clicks their profile link", async ({ page }) => {
        await page.getByRole("link", { name: "Profile" }).click();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main/profile/64d21080c7ea158a54703bb1"
        );
        await expect(
            page.getByRole("heading", { name: "About Me:" })
        ).toBeVisible();
        await expect(
            page.getByRole("heading", { name: "Max Power" })
        ).toBeVisible();
    });

    test("user goes back to the main page after visiting the friends page", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Main" }).click();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main"
        );
        await expect(
            page.getByRole("button", { name: "Global" })
        ).toBeVisible();
    });

    test("user opens the post creator after clicking the post link", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Post", exact: true }).click();
        await expect(
            page.getByRole("heading", { name: "Create post" })
        ).toBeVisible();
    });
});
