import { test, expect } from "@playwright/test";
import "dotenv/config";

test.describe("splash page tests", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.setTimeout(testInfo.timeout + 30000);
        await page.goto("http://localhost:5173/odin-book-client/#/");
    });

    test("user fails to log in", async ({ page }) => {
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(page.getByText("You must enter a username")).toBeVisible();
        await expect(page.getByText("You must enter a password")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/"
        );
    });

    test("user successfully logs in", async ({ page }) => {
        await page.getByLabel("Username").click();
        await page.getByLabel("Username").fill(process.env.TESTUSER!);
        await page.getByLabel("Username").press("Tab");
        await page.getByLabel("Password").fill(process.env.TESTPASSWORD!);
        await page.getByLabel("Password").press("Enter");
        await page.goto("http://localhost:5173/odin-book-client/#/main");
        await expect(
            page.getByRole("button", { name: "My feed" })
        ).toBeVisible();
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
        await page.getByLabel("First Name").click();
        await page.getByLabel("First Name").fill("Test");
        await page.getByLabel("Last Name").click();
        await page.getByLabel("Last Name").fill("Test");
        await page.getByLabel("Username").click();
        await page.getByLabel("Username").fill("test@test.com");
        await page.getByLabel("Password", { exact: true }).click();
        await page.getByLabel("Password", { exact: true }).fill("testtest");
        await page.getByLabel("Confirm Password").click();
        await page.getByLabel("Confirm Password").fill("testtest");
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(
            page.getByRole("heading", { name: "Sign up was successful!" })
        ).toBeVisible();
    });

    test("user fails to sign up for an account", async ({ page }) => {
        // await page.route(
        //     "https://odin-book-api-5r5e.onrender.com/api/sign-up",
        //     async (route) => {
        //         const json = {
        //             errors: [
        //                 {
        //                     location: "firstname",
        //                     msg: "You must enter a first name",
        //                     path: "",
        //                     type: "",
        //                     value: "",
        //                 },
        //                 {
        //                     location: "lastname",
        //                     msg: "You must enter a last name",
        //                     path: "",
        //                     type: "",
        //                     value: "",
        //                 },
        //                 {
        //                     location: "username",
        //                     msg: "You must enter a sign username",
        //                     path: "",
        //                     type: "",
        //                     value: "",
        //                 },
        //                 {
        //                     location: "password",
        //                     msg: "You must enter a sign username",
        //                     path: "",
        //                     type: "",
        //                     value: "",
        //                 },
        //                 {
        //                     location: "confirmPassword",
        //                     msg: "You must enter a sign username",
        //                     path: "",
        //                     type: "",
        //                     value: "",
        //                 },
        //             ],
        //         };
        //         await route.fulfill({ json });
        //     }
        // );

        await page.getByRole("link", { name: "Create new account" }).click();
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByText("You must enter a first name")
        ).toBeVisible();
        await expect(
            page.getByText("You must enter a last name")
        ).toBeVisible();
        await expect(page.getByText("You must enter a username")).toBeVisible();
        await expect(page.getByText("You must enter a password")).toBeVisible();
        await expect(
            page.getByText("You must confirm the password")
        ).toBeVisible();

        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/sign-up"
        );
    });

    test("user fails to sign up as the username has been taken", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "Create new account" }).click();
        await page.getByLabel("First Name").click();
        await page.getByLabel("First Name").fill("Test");
        await page.getByLabel("Last Name").click();
        await page.getByLabel("Last Name").fill("Test");
        await page.getByLabel("Username").click();
        await page.getByLabel("Username").fill(process.env.TESTUSER!);
        await page.getByLabel("Password", { exact: true }).click();
        await page.getByLabel("Password", { exact: true }).fill("testtest");
        await page.getByLabel("Confirm Password").click();
        await page.getByLabel("Confirm Password").fill("testtest");
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
        await page.getByLabel("First Name").click();
        await page.getByLabel("First Name").fill("Test");
        await page.getByLabel("Last Name").click();
        await page.getByLabel("Last Name").fill("Test");
        await page.getByLabel("Username").click();
        await page.getByLabel("Username").fill("test@test.com");
        await page.getByLabel("Password", { exact: true }).click();
        await page.getByLabel("Password", { exact: true }).fill("testtest");
        await page.getByLabel("Confirm Password").click();
        await page.getByLabel("Confirm Password").fill("123466783243");
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(page.getByText("The passwords don't match")).toBeVisible();
        await expect(page).toHaveURL(
            "http://localhost:5173/odin-book-client/#/sign-up"
        );
    });
});
