import { test, expect } from "@playwright/test";
import "dotenv/config";

test.describe("comment tests", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        // login our test user
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

    test("user creates a post, views the post on it's own page, makes a comment, edits the comment, then deletes the comment.", async ({
        page,
    }) => {
        test.slow();

        // make a post
        await test.step("user makes a post", async () => {
            await page.getByRole("button", { name: "Create post" }).click();
            await page.getByPlaceholder("Share your thoughts").click();
            await page
                .getByPlaceholder("Share your thoughts")
                .fill("This is a test post created in Playwright.");
            await page.getByRole("button", { name: "Submit" }).click();
            await expect(
                page
                    .getByText("This is a test post created in Playwright.")
                    .first()
            ).toBeVisible();
        });

        await test.step("user views the post on it's own page", async () => {
            await page
                .getByRole("button", { name: "Comments: 0" })
                .first()
                .click();
            await expect(
                page
                    .getByText("This is a test post created in Playwright.")
                    .first()
            ).toBeVisible();
        });

        await test.step("user types a comment in the comment box and sends it to the server", async () => {
            await page.getByPlaceholder("Share your thoughts").click();
            await page
                .getByPlaceholder("Share your thoughts")
                .fill("This is a test comment. ");
            await page.getByRole("button", { name: "Reply" }).click();
            await expect(
                page.getByText("This is a test comment.")
            ).toBeVisible();
        });

        await test.step("user edit's their comment", async () => {
            await page
                .locator("#hs-dropdown-custom-icon-trigger")
                .nth(1)
                .click();
            await page.getByRole("button", { name: "edit post" }).click();
            await page
                .locator("textarea")
                .filter({ hasText: "This is a test comment." })
                .click();
            await page
                .locator("textarea")
                .filter({ hasText: "This is a test comment." })
                .fill("This is a test comment. Edited");
            await page.getByRole("button", { name: "Submit" }).click();
            await expect(
                page.getByText("This is a test comment. Edited")
            ).toBeVisible();
        });

        // user deletes comment
        await test.step("user deletes their comment", async () => {
            await page
                .locator("#hs-dropdown-custom-icon-trigger")
                .nth(1)
                .click();
            await page.getByRole("button", { name: "delete post" }).click();
            await page.getByRole("button", { name: "Yes" }).click();
            await expect(
                page.getByText("This is a test comment. Edited")
            ).not.toBeVisible();
        });

        // delete the post afterwards
        await test.step("user deletes their post", async () => {
            await page.locator("#hs-dropdown-custom-icon-trigger").click();
            await page.getByLabel("delete post").click();
            await page.getByRole("button", { name: "Yes" }).click();
            await expect(
                page.getByText(
                    "This is a test post created in Playwright, but edited."
                )
            ).not.toBeVisible();
        });
    });
});
