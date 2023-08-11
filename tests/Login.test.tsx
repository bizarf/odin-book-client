import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import React from "react";
import { afterEach, beforeEach, describe } from "vitest";

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

describe("user login", () => {
    it("the user signs in", async () => {
        // render(<App />);

        const userNameInput = screen.getByRole("textbox", { name: "Username" });
        const passwordInput = screen.getByRole("input", { name: "password" });
        const submitBtn = screen.getByRole("button", { name: "Submit" });
        // await userEvent.click(userNameInput);
        // await userEvent.type(userNameInput, "");
    });
});
