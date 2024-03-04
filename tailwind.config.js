import prelinePlugin from "preline/plugin";
import formPlugin from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "node_modules/preline/dist/*.js",
    ],
    theme: {
        extend: {},
    },
    // plugins: [require("preline/plugin"), require("@tailwindcss/forms")],
    plugins: [prelinePlugin, formPlugin],
    darkMode: "class",
};
