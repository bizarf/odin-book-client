import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import ErrorsType from "../../types/errorsType";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

type Props = {
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    commentId: string;
    commentContent: string;
    postId: string | undefined;
};

const CommentEditor = ({
    commentId,
    commentContent,
    setEdit,
    postId,
}: Props) => {
    const [comment, setComment] = useState<string>();
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleCloseEditor = (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.preventDefault();
        setEdit((state) => !state);
    };

    const sendCommentEdit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading((prevState) => !prevState);
        const jwt = cookies.get("jwt_auth");

        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/post/${postId}/comments/${commentId}`,
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                // need to stringify the username and password to be able to send them as JSON objects
                body: JSON.stringify({ comment }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    setEdit((state) => !state);
                    navigate(0);
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    useEffect(() => {
        setComment(commentContent);
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
                        <h2 className="text-xl dark:text-white">
                            Edit comment
                        </h2>

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
                            Comment content
                        </label>
                        <textarea
                            name="comment"
                            id="comment"
                            rows={6}
                            className="w-full rounded dark:bg-slate-900 dark:text-white"
                            placeholder="Share your thoughts"
                            maxLength={280}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        ></textarea>
                        {error.map((error, index) => {
                            if (error.path === "comment") {
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
                            onClick={(e) => sendCommentEdit(e)}
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

export default CommentEditor;
