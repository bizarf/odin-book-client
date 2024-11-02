import React, { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import ErrorsType from "../../types/errorsType";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

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
            `${import.meta.env.VITE_API_HOST}/api/post/${postId}/comments/${commentId}`,
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
                    setLoading((prevState) => !prevState);
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
                            <Cross2Icon className="w-5 h-5" />
                        </button>
                    </div>
                    <div>
                        <label htmlFor="postContent" className="sr-only">
                            Comment content
                        </label>
                        <Textarea
                            name="comment"
                            id="comment"
                            className="dark:bg-slate-900"
                            placeholder="Share your thoughts"
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            rows={6}
                            maxLength={280}
                        />
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
                        <Button
                            className="mt-2 px-8 bg-blue-600 hover:bg-blue-700 dark:text-white"
                            onClick={(e) => sendCommentEdit(e)}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
                {loading && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default CommentEditor;
