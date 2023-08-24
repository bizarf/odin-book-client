import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import React from "react";
import { afterEach, beforeEach, describe } from "vitest";
import "dotenv/config";

beforeEach(() => {
    render(<App />);
});

afterEach(() => {
    document.body.innerHTML = "";
    cleanup();
});

describe("splash/login page", () => {
    it("renders the login/splash page", () => {
        // render(<App />);

        expect(
            screen.getByRole("button", { name: "Submit" })
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Create new account" }));
    });

    it("user logs in", async () => {
        // render(<App />);
        const user = userEvent.setup();

        const usernameInput = screen.getByRole("textbox", { name: "Username" });
        const passwordInput = screen.getByText("Password");
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        if (process.env.TESTUSER) {
            await user.type(usernameInput, process.env.TESTUSER);
        }
        if (process.env.TESTPASSWORD) {
            await user.type(passwordInput, process.env.TESTPASSWORD);
        }
        const submitBtn = screen.getByRole("button", { name: "Submit" });

        await user.click(submitBtn);
        // const success = screen.getByText("Login was successful!");
        // expect(success).toBeInTheDocument();
    });
});

describe("user navigation", () => {
    it("user navigates to sign up page", async () => {
        // render(<App />);

        const user = userEvent.setup();

        const signUpLink = screen.getByRole("link", {
            name: "Create new account",
        });

        // await as we need to wait for user to click the button
        await user.click(signUpLink);

        const signUpHeader = screen.getByRole("heading", { name: "Sign Up" });
        expect(signUpHeader).toBeInTheDocument();
    });
});
