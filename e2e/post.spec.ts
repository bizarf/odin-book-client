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

test.describe("post tests", () => {
    test.beforeEach(async ({ page }) => {
        // login our test user
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("john@smith.com");
        await page.getByLabel("Password").fill("johnsmith99");
        await page.getByLabel("Password").press("Enter");
    });

    test("user creates a post, views the post on it's own page, edits the post, and then deletes the post", async ({
        page,
    }) => {
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

        // click on the post's comment button
        await test.step("user clicks on the new post's comment button", async () => {
            await page
                .getByRole("button", { name: "Comments: 0" })
                .first()
                .click();
            await expect(
                page.getByText("This is a test post created in Playwright.")
            ).toBeVisible();
        });

        // edit the post
        await test.step("user edit's the post", async () => {
            await page.getByLabel("post dropdown menu").click();
            await page.getByLabel("edit post").click();
            await page
                .getByRole("textbox", { name: "Share your thoughts" })
                .fill(
                    "This is a test post created in Playwright, but edited. "
                );
            await page.getByRole("button", { name: "Submit" }).nth(1).click();
            // expect redirect to main
            await expect(page).toHaveURL(
                "http://localhost:5173/odin-book-client/#/main"
            );
            await expect(
                page.getByText(
                    "This is a test post created in Playwright, but edited."
                )
            ).toBeVisible();
        });

        // enter the post again and delete the post from there
        await test.step("user enters the post and then delete's the post from there", async () => {
            await page
                .getByRole("button", { name: "Comments: 0" })
                .first()
                .click();
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
