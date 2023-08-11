import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "../Footer";
import LightModeBtn from "../ui/LightModeBtn";
import DarkModeBtn from "../ui/DarkModeBtn";

type Props = {
    theme: string | undefined;
    setTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SplashLayout = ({ theme, setTheme }: Props) => {
    useEffect(() => {
        const pageTheme = localStorage.getItem("theme") || "light";
        setTheme(pageTheme);
    }, []);

    useEffect(() => {
        const handleThemeChange = () => {
            const htmlElement = document.querySelector("html");

            if (theme === "light") {
                htmlElement?.classList.remove("dark");
                localStorage.setItem("theme", "light");
            } else if (theme === "dark") {
                htmlElement?.classList.add("dark");
                localStorage.setItem("theme", "dark");
            }
        };
        handleThemeChange();
    }, [theme]);

    return (
        <div className="flex min-h-full flex-col dark:bg-slate-600">
            <div className="flex-[1_0_auto] grid grid-rows-[auto_1fr] min-h-full dark:bg-slate-600">
                <div className="py-2 inline-flex justify-between border-b-2 text-sm dark:border-b-0 dark:bg-gray-800">
                    <div>
                        <Link to="/">Logo</Link>
                    </div>
                    <div className="">
                        {theme === "light" && (
                            <LightModeBtn setTheme={setTheme} />
                        )}
                        {theme === "dark" && (
                            <DarkModeBtn setTheme={setTheme} />
                        )}
                    </div>
                </div>
                <Outlet />
            </div>
            <Footer theme={theme} />
        </div>
    );
};

export default SplashLayout;
