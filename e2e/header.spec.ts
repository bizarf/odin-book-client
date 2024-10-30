import { test, expect } from "@playwright/test";
import "dotenv/config";

test.beforeEach(async ({ context }) => {
    // Create a new test user account
    const page = await context.newPage();
    await page.goto("http://localhost:5173/odin-book-client/#/sign-up");
    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Smith");
    await page.getByLabel("Username").fill("john@smith.com");
    await page.getByLabel("Password", { exact: true }).fill("johnsmith99");
    await page.getByLabel("Confirm Password").fill("johnsmith99");
    await page.getByRole("button", { name: "Submit" }).click();
});

test.describe("header navigation tests", () => {
    test.beforeEach(async ({ page }) => {
        // login();
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("john@smith.com");
        await page.getByLabel("Password").fill("johnsmith99");
        await page.getByLabel("Password").press("Enter");
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
        await page
            .getByRole("link", { name: "Pending Friends", exact: true })
            .click();
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
        await expect(
            page.getByRole("heading", { name: "About Me:" })
        ).toBeVisible();
        await expect(
            page.getByRole("heading", { name: "John Smith" })
        ).toBeVisible();
    });

    test("user goes back to the main page after visiting the friends page", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Friends", exact: true }).click();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/main/friends-list"
        );
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
