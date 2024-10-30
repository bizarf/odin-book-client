import React from "react";
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import SplashLayout from "../src/components/layouts/SplashLayout";
import Login from "../src/components/pages/Login";
import { Router } from "@remix-run/router";

describe("Splash Layout component", () => {
    let router: Router;

    beforeAll(() => {
        // the component makes use of an outlet, so it's important to use a router to allow the component to use the children
        router = createMemoryRouter([
            {
                path: "/",
                element: <SplashLayout />,
                children: [
                    {
                        // login page
                        index: true,
                        element: <Login />,
                    },
                ],
            },
        ]);
    });

    it("splash page renders", () => {
        render(<RouterProvider router={router} />);
        expect(
            screen.getByRole("heading", { name: "Welcome to Odin Book" })
        ).toBeDefined();
        expect(
            screen.getByRole("textbox", { name: "Username (E-mail)" })
        ).toBeDefined();
        expect(
            screen.getByRole("button", { name: "Create new account" })
        ).toBeDefined();
    });
});
