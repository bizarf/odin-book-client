import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import ErrorsType from "../../types/errorsType";
import JwtDecodeType from "../../types/jwtDecode";
import LoadingSpinner from "../LoadingSpinner";
import splashPhoto from "../../assets/pexels-ivan-samkov-4240497.jpg";

type Props = {
    getUserInfo: () => void;
};

const Login = ({ getUserInfo }: Props) => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    // universal cookie initialisation
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async () => {
            // set this const variable if the cookies contains a variable called jwt_auth
            const jwt = await cookies.get("jwt_auth");
            if (jwt) {
                getUserInfo();
                navigate("/main");
            }
        };
        checkCookie();
    }, []);

    const sendLogin = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading((state) => !state);
        // make an object with the username and password input states
        const data = { username, password };

        // start fetch api, with a post method and set the header content type to json
        fetch("https://odin-book-api-5r5e.onrender.com/api/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token for the exp time and then create a cookie to store the jwt
                if (data.token) {
                    // decode the jwt
                    const decode: JwtDecodeType = jwtDecode(data.token);
                    cookies.set("jwt_auth", data.token, {
                        // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(decode.exp * 1000),
                    });
                    // this fetches the user's info from the database
                    getUserInfo();
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/main");
                        // refresh. not sure why, but the app isn't re-rendering after the above navigate ever since I rewrote the router
                        navigate(0);
                    }, 500);
                } else if (Array.isArray(data.errors)) {
                    // error messages from express validator go here
                    setError(data.errors);
                } else {
                    // if the error message is an object from passport, then we need to put it in an array
                    setError([data]);
                }
            });
    };

    const handleDemoLogin = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading((state) => !state);

        // start fetch api, with a post method and set the header content type to json
        fetch("https://odin-book-api-5r5e.onrender.com/api/login-demo", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token for the exp time and then create a cookie to store the jwt
                if (data.token) {
                    // decode the jwt
                    const decode: JwtDecodeType = jwtDecode(data.token);
                    cookies.set("jwt_auth", data.token, {
                        // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(decode.exp * 1000),
                    });
                    // this fetches the user's info from the database
                    getUserInfo();
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/main");
                        navigate(0);
                    }, 500);
                } else if (Array.isArray(data.errors)) {
                    // error messages from express validator go here
                    setError(data.errors);
                } else {
                    // if the error message is an object from passport, then we need to put it in an array
                    setError([data]);
                }
            });
    };

    return (
        <div className="grid sm:grid-cols-2 grid-cols-[0.6fr_1fr] bg-inherit">
            <div className="">
                <img
                    src={splashPhoto}
                    alt=""
                    className="w-full h-[calc(100vh-5.1rem)] sm:h-[calc(100vh-5.40rem)] object-cover"
                />
            </div>
            <div className="flex items-center justify-center flex-col mx-4">
                <div>
                    <h1 className="text-xl dark:text-white text-center font-bold -mt-8 mb-4">
                        Welcome to Odin Book
                    </h1>
                    <form className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800 bg-white">
                        {/* username section of the form */}
                        <label
                            htmlFor="username"
                            className="block font-semibold dark:text-white text-sm"
                        >
                            Username
                        </label>
                        <input
                            type="email"
                            name="username"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                        />
                        {error.map((error, index) => {
                            if (error.path === "username") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                            }
                        })}
                        {/* password section of the form */}
                        <label
                            htmlFor="password"
                            className="mt-3 block font-semibold text-sm dark:text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                        />
                        {error.map((error, index) => {
                            // error messages from express validator
                            if (error.path === "password") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                                // error message from passport js
                            } else if (error.msg === "Incorrect password") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                            }
                        })}
                        <div className="flex items-center flex-col">
                            <button
                                type="submit"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-4 sm:px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                onClick={(e) => sendLogin(e)}
                            >
                                Submit
                            </button>
                            <Link
                                to="sign-up"
                                className="mt-3 rounded-md border border-transparent bg-green-700 px-2 sm:px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                            >
                                Create new account
                            </Link>
                            {/* <Link
                                to="https://odin-book-api-5r5e.onrender.com/api/facebook-login"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                            >
                                <div className="flex items-center">
                                    <img
                                        src="./Facebook_f_logo_(2021).svg"
                                        alt="Facebook logo"
                                        className="w-7"
                                    />
                                    <span className="ml-2">
                                        Continue with Facebook
                                    </span>
                                </div>
                            </Link> */}
                            <Link
                                to="https://odin-book-api-5r5e.onrender.com/api/github-login/"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                            >
                                <div className="flex items-center">
                                    <img
                                        src="./github-mark-white.svg"
                                        className="w-6"
                                        alt="GitHub logo"
                                    />
                                    <span className="ml-2">
                                        Continue with GitHub
                                    </span>
                                </div>
                            </Link>
                            <button
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-4 sm:px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                onClick={(e) => handleDemoLogin(e)}
                            >
                                Try the demo account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Login was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
