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
    // create another user
    await page.goto("http://localhost:5173/odin-book-client/#/sign-up");
    await page.getByLabel("First Name").fill("Lisa");
    await page.getByLabel("Last Name").fill("Hart");
    await page.getByLabel("Username").fill("lisa@hart.com");
    await page.getByLabel("Password", { exact: true }).fill("lisahart34666");
    await page.getByLabel("Confirm Password").fill("lisahart34666");
    await page.getByRole("button", { name: "Submit" }).click();
});

test.describe("friend requests test", () => {
    test("first user makes a post and then logs out", async ({ page }) => {
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("john@smith.com");
        await page.getByLabel("Password").fill("johnsmith99");
        await page.getByLabel("Password").press("Enter");

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

        await test.step("user logs out", async () => {
            await page.getByText("Logout").click();
        });
    });

    test("second user sees the post on the global feed", async ({ page }) => {
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("lisa@hart.com");
        await page.getByLabel("Password").fill("lisahart34666");
        await page.getByLabel("Password").press("Enter");

        await test.step("they see the first user's post in the global feed", async () => {
            await page.getByText("Global").click();
            await expect(
                page
                    .getByText("This is a test post created in Playwright.")
                    .first()
            ).toBeVisible();
        });

        await test.step("they click on the name of the person that made the post", async () => {
            await page.getByText("John Smith").click();
            await expect(
                page.getByRole("button", { name: "Add Friend" })
            ).toBeVisible();
        });

        await test.step("they click on the add friend button", async () => {
            await page.getByRole("button", { name: "Add Friend" }).click();
            await expect(
                page.getByRole("button", { name: "Sent" })
            ).toBeVisible();
        });

        await test.step("they click on the pending friends tab to see the friend request they sent", async () => {
            await page
                .getByRole("link", { name: "Pending Friends", exact: true })
                .click();
            await expect(
                page.getByText("Pending friend requests")
            ).toBeVisible();
            await expect(page.getByText("John Smith")).toBeVisible();
            await page
                .getByRole("link", { name: "Logout", exact: true })
                .click();
        });
    });

    test("first user logs in and accepts the friend request", async ({
        page,
    }) => {
        await page.goto("http://localhost:5173/odin-book-client/#/");
        await page.getByLabel("Username").fill("john@smith.com");
        await page.getByLabel("Password").fill("johnsmith99");
        await page.getByLabel("Password").press("Enter");

        await test.step("user checks the friends area to see no friends", async () => {
            await page
                .getByRole("link", { name: "Friends", exact: true })
                .click();
            await expect(page).toHaveURL(
                "http://localhost:5173/odin-book-client/#/main/friends-list"
            );
            await expect(
                page.getByRole("heading", {
                    name: "Friends list",
                    exact: true,
                })
            ).toBeVisible();
            await expect(page.getByText("Lisa Hart")).not.toBeVisible();
        });

        await test.step("user checks the pending friends area", async () => {
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
            await expect(page.getByText("Lisa Hart")).toBeVisible();
        });

        await test.step("user accepts the friend request", async () => {
            await page
                .getByRole("button", { name: "Accept", exact: true })
                .click();
            await expect(
                page.getByText("There are no pending friend requests")
            ).toBeVisible();
        });

        await test.step("user checks the pending friends area after accepting the request", async () => {
            await page
                .getByRole("link", { name: "Friends", exact: true })
                .click();
            await expect(page).toHaveURL(
                "http://localhost:5173/odin-book-client/#/main/friends-list"
            );
            await expect(
                page.getByRole("heading", {
                    name: "Friends list",
                    exact: true,
                })
            ).toBeVisible();
            await expect(page.getByText("Lisa Hart")).toBeVisible();
        });
    });
});
