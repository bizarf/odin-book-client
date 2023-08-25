import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import ErrorsType from "../../types/errorsType";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string | undefined;
    currentPost: string | undefined;
};

const PostEditor = ({
    setEditor,
    editMode,
    setEditMode,
    postId,
    currentPost,
}: Props) => {
    const [postContent, setPostContent] = useState<string>();
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const cookies = new Cookies();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCloseEditor = (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.preventDefault();
        setEditor((state) => !state);
        if (editMode) {
            setEditMode((state) => !state);
        }
    };

    // POST create post function
    const sendPost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading((prevState) => !prevState);
        const jwt = cookies.get("jwt_auth");

        fetch("https://odin-book-api-5r5e.onrender.com/api/create-post", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify({ postContent }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);

                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    setEditor((state) => !state);
                    if (location.pathname != "/main") {
                        navigate("/main");
                    } else {
                        navigate(0);
                    }
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    // edit post POST function
    const sendEditPost = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading((prevState) => !prevState);
        const jwt = cookies.get("jwt_auth");

        fetch(`https://odin-book-api-5r5e.onrender.com/api/post/${postId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify({ postContent }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);

                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    setEditor((state) => !state);
                    if (location.pathname != "/main") {
                        navigate("/main");
                    } else {
                        navigate(0);
                    }
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    useEffect(() => {
        if (editMode) {
            setPostContent(currentPost);
        }
    }, []);

    return (
        <div
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.7]"
            onClick={(e) => handleCloseEditor(e)}
        >
            <div
                className="rounded-xl border border-slate-500 bg-white dark:bg-slate-800 p-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <form className="">
                    <div className="flex justify-between pb-2 items-center">
                        {editMode ? (
                            <h2 className="text-xl dark:text-white">
                                Edit post
                            </h2>
                        ) : (
                            <h2 className="text-xl dark:text-white">
                                Create post
                            </h2>
                        )}
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
                        <label htmlFor="postContent" className="sr-only">
                            Post content
                        </label>
                        <textarea
                            name="postContent"
                            id="postContent"
                            rows={6}
                            maxLength={280}
                            className="w-full rounded dark:bg-slate-900 dark:text-white"
                            placeholder="Share your thoughts"
                            onChange={(e) => setPostContent(e.target.value)}
                            value={postContent}
                        ></textarea>
                        {error.map((error, index) => {
                            if (error.path === "postContent") {
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
                        {editMode ? (
                            <button
                                type="submit"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                onClick={(e) => sendEditPost(e)}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                onClick={(e) => sendPost(e)}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
                {loading && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default PostEditor;
