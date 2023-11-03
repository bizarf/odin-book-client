import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import LightModeBtn from "./LightModeBtn";
import DarkModeBtn from "./DarkModeBtn";
import useThemeStore from "../../stores/useThemeStore";
import useUserStore from "../../stores/useUserStore";
import useEditorStore from "../../stores/useEditorStore";

type Props = {
    getUserInfo: () => void;
};

const Header = ({ getUserInfo }: Props) => {
    // theme state and theme setter function
    const { theme, setTheme } = useThemeStore();

    // user state and user setter function
    const { user, setUser } = useUserStore();

    // editor state
    const { setEditor } = useEditorStore();

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

    const cookies = new Cookies();

    const logout = () => {
        // delete the JWT token from the cookie
        setUser(undefined);
        cookies.remove("jwt_auth");
    };

    useEffect(() => {
        const checkCookie = async () => {
            const jwt = await cookies.get("jwt_auth");
            if (jwt) {
                // fetch user info from database
                getUserInfo();
            }
        };
        checkCookie();
    }, []);

    return (
        <header className="sticky top-0 z-50 flex w-full border-b-[1px] dark:border-b-transparent bg-white py-2 sm:py-4 text-sm  dark:bg-gray-800">
            <nav className="sm:flex sm:justify-between sm:w-full sn:flex-row items-center sm:gap-5 sm:px-5">
                <Link
                    className="pl-2 text-2xl sm:text-3xl font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200 select-none"
                    to="/main"
                >
                    Odin Book
                </Link>
                <div className="sm:flex text-xs sm:text-sm sm:flex-wrap sm:items-center mt-2 sm:mt-0">
                    <Link
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        to="/main"
                    >
                        Main
                    </Link>
                    <button
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        onClick={setEditor}
                    >
                        Post
                    </button>
                    <Link
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        to="friends-list"
                    >
                        Friends
                    </Link>
                    <Link
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        to="pending-friends"
                    >
                        Pending Friends
                    </Link>
                    <Link
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        to={`profile/${user?._id}`}
                    >
                        Profile
                    </Link>
                    <Link
                        className="px-2 text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                        to="/"
                        onClick={logout}
                    >
                        Logout
                    </Link>
                    {/* dark mode button toggle */}
                    <div className="absolute top-[0.5rem] right-2 sm:static sm:px-2 mt-1">
                        {theme === "light" && <LightModeBtn />}
                        {theme === "dark" && <DarkModeBtn />}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
