import { test, expect } from "@playwright/test";

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

test.describe("comment tests", () => {
    test.beforeEach(async ({ page }) => {
        // login our test user
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("john@smith.com");
        await page.getByLabel("Password").fill("johnsmith99");
        await page.getByLabel("Password").press("Enter");
    });

    test("user creates a post, views the post on it's own page, makes a comment, edits the comment, then deletes the comment.", async ({
        page,
    }) => {
        test.slow();

        // make a post
        await test.step("user makes a post", async () => {
            await page.getByRole("button", { name: "Create post" }).click();
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
            await page.getByLabel("comment dropdown menu").click();
            await page.getByLabel("edit comment").click();
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
            await page.getByLabel("comment dropdown menu").click();
            await page.getByLabel("delete comment").click();
            await page.getByRole("button", { name: "Yes" }).click();
            await expect(
                page.getByText("This is a test comment. Edited")
            ).not.toBeVisible();
        });

        // delete the post afterwards
        await test.step("user deletes their post", async () => {
            await page.getByLabel("post dropdown menu").click();
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
