import React, { useEffect, useState } from "react";
import UserType from "../../types/userType";
import { useNavigate } from "react-router-dom";
import ErrorsType from "../../types/errorsType";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    user: UserType | undefined;
};

const SignUp = ({ user }: Props) => {
    const [firstname, setFirstname] = useState<string>();
    const [lastname, setLastname] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading((state) => !state);

        // turn the form field states into an object
        const data = {
            firstname,
            lastname,
            username,
            password,
            confirmPassword,
        };

        fetch("https://odin-book-api-5r5e.onrender.com/api/sign-up", {
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
                if (data.message === "Sign up was successful!") {
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                } else {
                    setError(data.errors);
                }
            });
    };

    useEffect(() => {
        if (user) {
            navigate("/main");
        }
    });

    return (
        <div className="mx-4 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-slate-600">
            <h1 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Sign Up
            </h1>
            <form
                onSubmit={(e) => handleSignUp(e)}
                className="mb-4 rounded-xl border border-slate-500 p-4 dark:bg-gray-800 bg-white"
            >
                <label
                    htmlFor="firstname"
                    className="mb-1 block font-semibold text-sm dark:text-white"
                >
                    First Name
                </label>
                <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    onChange={(e) => setFirstname(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                />
                {error.map((error, index) => {
                    if (error.path === "firstname") {
                        return (
                            <div key={index} className="text-sm text-red-600">
                                {error.msg}
                            </div>
                        );
                    }
                })}
                <label
                    htmlFor="lastname"
                    className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
                >
                    Last Name
                </label>
                <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    onChange={(e) => setLastname(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                />
                {error.map((error, index) => {
                    if (error.path === "lastname") {
                        return (
                            <div key={index} className="text-sm text-red-600">
                                {error.msg}
                            </div>
                        );
                    }
                })}
                <label
                    htmlFor="username"
                    className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
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
                            <div key={index} className="text-sm text-red-600">
                                {error.msg}
                            </div>
                        );
                    }
                })}
                <label
                    htmlFor="password"
                    className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
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
                    if (error.path === "password") {
                        return (
                            <div key={index} className="text-sm text-red-600">
                                {error.msg}
                            </div>
                        );
                    }
                })}
                <label
                    htmlFor="confirmPassword"
                    className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                />
                {Array.isArray(error) ? (
                    error.map((error, index) => {
                        if (error.path === "confirmPassword") {
                            return (
                                <div
                                    key={index}
                                    className="text-sm text-red-600"
                                >
                                    {error.msg}
                                </div>
                            );
                        }
                    })
                ) : (
                    <div className="text-sm text-red-600">{error}</div>
                )}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-offset-gray-800"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {loading && <LoadingSpinner />}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Sign up was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
