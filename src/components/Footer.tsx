// import React from "react";
import useThemeStore from "../stores/useThemeStore";

const Footer = () => {
    const { theme } = useThemeStore();

    return (
        <footer className="inline-flex flex-shrink-0 justify-center border-t-[1px] py-1 text-sm  dark:bg-gray-800 dark:text-white dark:border-t-transparent bg-white">
            <a
                href="https://github.com/bizarf"
                className="inline-flex items-center"
            >
                Created by Bizarf{" "}
                {theme === "light" ? (
                    <img src="./github-mark.svg" className="mx-2 w-6" alt="" />
                ) : (
                    <img
                        src="./github-mark-white.svg"
                        className="mx-2 w-6"
                        alt="My Github profile"
                    />
                )}
                2023
            </a>
        </footer>
    );
};

export default Footer;
