import { test, expect } from "@playwright/test";

test.describe("splash page tests", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.setTimeout(testInfo.timeout + 30000);
        await page.goto("http://localhost:5173/odin-book-client/#/");
    });

    test("user fails to log in due to not entering any details", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByText("Username must be a valid email address")
        ).toBeVisible();
        await expect(
            page.getByText("Password must be at least 8 characters long")
        ).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/"
        );
    });

    test("user signs up for an account", async ({ page }) => {
        await page.getByRole("link", { name: "Create new account" }).click();
        // mock the sign up
        await page.route(
            "https://odin-book-api-5r5e.onrender.com/api/sign-up",
            async (route) => {
                const json = { message: "Sign up was successful!" };
                await route.fulfill({ json });
            }
        );
        await page.getByLabel("First Name").fill("Kim");
        await page.getByLabel("Last Name").fill("Smith");
        await page.getByLabel("Username").fill("kim@smith.com");
        await page.getByLabel("Password", { exact: true }).fill("kimsmith99");
        await page.getByLabel("Confirm Password").fill("kimsmith99");
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(
            page.getByRole("heading", { name: "Sign up was successful!" })
        ).toBeVisible();
    });

    test("user fails to log in due to inputting the wrong username", async ({
        page,
    }) => {
        await page.getByLabel("Username").fill("km@smith.com");
        await page.getByLabel("Password").fill("kimsmith99");
        await page.getByLabel("Password").press("Enter");
        await expect(page.getByText("User does not exist")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/"
        );
    });

    test("user fails to log in due to inputting the wrong password", async ({
        page,
    }) => {
        await page.getByLabel("Username").fill("kim@smith.com");
        await page.getByLabel("Password").fill("ksmith23455");
        await page.getByLabel("Password").press("Enter");
        await expect(page.getByText("Incorrect password")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/"
        );
    });

    test("user successfully logs in", async ({ page }) => {
        await page.getByLabel("Username").fill("kim@smith.com");
        await page.getByLabel("Password").fill("kimsmith99");
        await page.getByLabel("Password").press("Enter");
        await expect(
            page.getByText(
                "Your feed is empty. Make a post or add some friends."
            )
        ).toBeVisible();
        await expect(page.getByText("Kim Smith")).toBeVisible();
    });

    test("user fails to sign up for an account", async ({ page }) => {
        await page.getByRole("link", { name: "Create new account" }).click();
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByText("First name must be at least 2 characters long")
        ).toBeVisible();
        await expect(
            page.getByText("Last name must be at least 2 characters long")
        ).toBeVisible();
        await expect(
            page.getByText("Username must be a valid email address")
        ).toBeVisible();
        await expect(
            page
                .getByText("Password must be at least 8 characters long")
                .first()
        ).toBeVisible();
        await expect(
            page.getByText("Password must be at least 8 characters long").last()
        ).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/sign-up"
        );
    });

    test("user fails to sign up as the username has been taken", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Create new account" }).click();
        await page.getByLabel("First Name").fill("Kim");
        await page.getByLabel("Last Name").fill("Smith");
        await page.getByLabel("Username").fill("kim@smith.com");
        await page.getByLabel("Password", { exact: true }).fill("kimsmith99");
        await page.getByLabel("Confirm Password").fill("kimsmith99");
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(page.getByText("User already exists")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/sign-up"
        );
    });

    test("user fails to sign up as the passwords don't match", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Create new account" }).click();
        await page.getByLabel("First Name").fill("Test");
        await page.getByLabel("Last Name").fill("Test");
        await page.getByLabel("Username").fill("test@test.com");
        await page.getByLabel("Password", { exact: true }).fill("testtest");
        await page.getByLabel("Confirm Password").fill("123466783243");
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(page.getByText("Passwords do not match")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/sign-up"
        );
    });
});
