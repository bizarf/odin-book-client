import React, { useEffect, useState } from "react";
import PostType from "../../types/postType";
import CommentType from "../../types/commentType";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import PostControls from "../controls/PostControls";
import LikeBtn from "../buttons/LikeBtn";
import dayjs from "dayjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import ErrorsType from "../../types/errorsType";
import Comments from "../Comments";
import useUserStore from "../../stores/useUserStore";
import filter from "leo-profanity";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Post = () => {
    // user state
    const { user } = useUserStore();

    const [post, setPost] = useState<PostType>();
    const [comments, setComments] = useState<CommentType[] | []>([]);
    const [comment, setComment] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<[ErrorsType] | []>([]);

    const cookies = new Cookies();
    const navigate = useNavigate();
    const { id } = useParams();
    const jwt = cookies.get("jwt_auth");

    const postComment = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading(true);

        fetch(`${import.meta.env.VITE_API_HOST}/api/post/${id}/comment`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify({ comment }),
        })
            .then((res) => res.json())
            .then((data) => {
                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    navigate(0);
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        // fetches post from database
        const getPost = () => {
            fetch(`${import.meta.env.VITE_API_HOST}/api/post/${id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setPost(data);
                    }
                });
        };

        // fetches comments
        const getComments = () => {
            fetch(`${import.meta.env.VITE_API_HOST}/api/post/${id}/comments`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setComments(data.allComments);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        getPost();
        getComments();
    }, [id, jwt]);

    return (
        <div className="mx-4 sm:grid sm:grid-cols-3 center">
            <div></div>
            <div>
                {post && (
                    <div className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                        <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                            <div className="flex items-center py-2">
                                <Link to={`/main/profile/${post.user._id}`}>
                                    {!post.user.photo ? (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src="./placeholder_profile.webp"
                                            alt="User avatar"
                                        />
                                    ) : (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src={post.user.photo}
                                            alt="User avatar"
                                        />
                                    )}
                                </Link>
                                <div>
                                    <Link to={`/main/profile/${post.user._id}`}>
                                        <h1 className=" dark:text-white">
                                            {filter.clean(post.user.firstname)}{" "}
                                            {filter.clean(post.user.lastname)}
                                        </h1>
                                    </Link>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Posted on:
                                        {dayjs(post.timestamp).format(
                                            " DD MMM YYYY, hh:mma"
                                        )}
                                        {post.edited && (
                                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                                {" "}
                                                (edited)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {user?._id === post.user._id && (
                                <div>
                                    <PostControls
                                        postId={post._id}
                                        currentPost={post.postContent}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="dark:text-white px-4 py-2 break-all whitespace-pre-wrap">
                            {filter.clean(post.postContent)}
                        </p>

                        <div className="dark:text-white border-t-2 dark:border-slate-700 flex justify-center">
                            <LikeBtn likes={post.likes} postId={post._id} />
                            <button className="w-full border-l-2 dark:border-slate-700">
                                Comments
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    <form>
                        <label
                            htmlFor="comment"
                            className="sr-only dark:text-white"
                        >
                            Comment
                        </label>
                        <Textarea
                            name="comment"
                            id="comment"
                            rows={4}
                            className="dark:bg-slate-900"
                            placeholder="Share your thoughts"
                            maxLength={280}
                            onChange={(e) => setComment(e.target.value)}
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
                        <div className="flex justify-end">
                            <Button
                                className="mt-2 bg-blue-600 hover:bg-blue-700 dark:text-white px-8"
                                onClick={(e) => postComment(e)}
                            >
                                Reply
                            </Button>
                        </div>
                    </form>
                </div>
                <Comments comments={comments} user={user} post={post} />
            </div>
            <div></div>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default Post;
