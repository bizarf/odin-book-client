import React from "react";

type Props = {
    theme: string | undefined;
};

const Footer = ({ theme }: Props) => {
    return (
        <footer className="inline-flex flex-shrink-0 justify-center border-t-2 py-1 text-sm dark:border-t-0 dark:bg-gray-800 dark:text-white">
            <a
                href="https://github.com/bizarf"
                className="inline-flex items-center"
            >
                Created by Bizarf{" "}
                {theme === "light" ? (
                    <img src="./github-mark.svg" className="mx-2 w-6" />
                ) : (
                    <img src="./github-mark-white.svg" className="mx-2 w-6" />
                )}
                2023
            </a>
        </footer>
    );
};

export default Footer;
