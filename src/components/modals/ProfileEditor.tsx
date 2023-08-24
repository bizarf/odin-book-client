import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import ErrorsType from "../../types/errorsType";
import { useNavigate } from "react-router-dom";

type Props = {
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
    userFirstname: string | undefined;
    userLastname: string | undefined;
    userUsername: string | undefined;
    userPhoto: string | undefined;
    userId: string | undefined;
};

const ProfileEditor = ({
    setEditProfile,
    userFirstname,
    userLastname,
    userUsername,
    userPhoto,
    userId,
}: Props) => {
    const [firstname, setFirstname] = useState<string | undefined>(
        userFirstname
    );
    const [lastname, setLastname] = useState<string | undefined>(userLastname);
    const [username, setUsername] = useState<string | undefined>(userUsername);
    const [photo, setPhoto] = useState<string | undefined>(userPhoto);
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleCloseEditor = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setEditProfile((state) => !state);
    };

    const updateProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading((prevState) => !prevState);
        const jwt = cookies.get("jwt_auth");

        fetch(`https://odin-book-api-5r5e.onrender.com/api/profile/${userId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify({ firstname, lastname, username, photo }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    setEditProfile((state) => !state);
                    navigate(0);
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    useEffect(() => {});

    return (
        <div
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.7]"
            onClick={() => setEditProfile((state) => !state)}
        >
            <div
                className="rounded-xl border border-slate-500 bg-white dark:bg-slate-800 p-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={(e) => updateProfile(e)} className="">
                    <div className="flex justify-between pb-2 items-center">
                        <h2 className="text-xl dark:text-white">Create post</h2>
                        <button
                            onClick={(e) => handleCloseEditor(e)}
                            className="rounded-2xl hover:dark:bg-slate-700 p-1 hover:bg-slate-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 dark:text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div>
                        {/* first name label and input */}
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
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                            onChange={(e) => setFirstname(e.target.value)}
                            value={firstname}
                        />
                        {error.map((error, index) => {
                            if (error.path === "firstname") {
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
                        {/* last name label and input */}
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
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        {error.map((error, index) => {
                            if (error.path === "lastname") {
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
                        {/* username/email label and input */}
                        <label
                            htmlFor="username"
                            className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
                        >
                            Username (e-mail)
                        </label>
                        <input
                            type="email"
                            name="username"
                            id="username"
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        {/* photo url label and input */}
                        <label
                            htmlFor="photo"
                            className="mb-1 mt-4 block font-semibold dark:text-white text-sm"
                        >
                            Photo URL
                        </label>
                        <input
                            type="text"
                            name="photo"
                            id="photo"
                            className="block w-full rounded-md border-gray-400 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                        />
                        {error.map((error, index) => {
                            if (error.path === "photo") {
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
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {loading && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default ProfileEditor;
