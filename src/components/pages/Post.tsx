import React, { useEffect, useState, useRef } from "react";
import PostType from "../../types/postType";
import CommentType from "../../types/commentType";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import DeleteModal from "../modals/DeleteModal";
import PostControls from "../ui/PostControls";
import LikeBtn from "../ui/LikeBtn";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import ErrorsType from "../../types/errorsType";
import UserType from "../../types/userType";

type Props = {
    user: UserType | undefined;
};

const Post = ({ user }: Props) => {
    const [post, setPost] = useState<PostType>();
    const [comments, setComments] = useState<CommentType[] | []>([]);
    const [comment, setComment] = useState<string>();
    const loadingRef = useRef<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [postId, setPostId] = useState<string>("");
    const [error, setError] = useState<[ErrorsType] | []>([]);

    const cookies = new Cookies();
    const navigate = useNavigate();
    const { id } = useParams();
    const jwt = cookies.get("jwt_auth");

    const getPost = () => {
        fetch(`https://odin-book-api-5r5e.onrender.com/api/post/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // loadingRef.current = false;
                if (data) {
                    setPost(data);
                }
            });
    };

    const getComments = () => {
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/post/${id}/comments`,
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                loadingRef.current = false;
                if (data) {
                    setComments(data.allComments);
                }
            });
    };

    const postComment = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        loadingRef.current = true;

        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/post/${id}/comment`,
            {
                method: "post",
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
                // setLoading((state) => !state);
                loadingRef.current = false;

                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    navigate(0);
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    useEffect(() => {
        getPost();
        getComments();
    }, []);

    return (
        <div className="grid grid-cols-3 center">
            <div></div>
            <div>
                {post && (
                    <div className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                        <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                            <div className="flex items-center">
                                <h3 className=" dark:text-white">
                                    {post.user.firstname} {post.user.lastname}
                                </h3>
                            </div>
                            {user?._id === post.user._id && (
                                <div>
                                    <PostControls
                                        setDeleteModal={setDeleteModal}
                                        currentPostId={post._id}
                                        setPostId={setPostId}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="dark:text-white px-4 pb-2">
                            {post.postContent}
                        </p>
                        <p className="ml-4 text-xs text-gray-600 dark:text-gray-300">
                            Posted on:
                            {dayjs(post.timestamp).format(
                                " ddd DD, YYYY, hh:mma"
                            )}
                        </p>
                        <div className="dark:text-white border-t-2 dark:border-slate-700 flex justify-center">
                            <LikeBtn likes={post.likes} postId={post._id} />
                            <button className="w-full border-l-2 dark:border-slate-700">
                                Comments
                            </button>
                        </div>
                        {deleteModal && (
                            <DeleteModal
                                setDeleteModal={setDeleteModal}
                                postId={post._id}
                            />
                        )}
                    </div>
                )}
                <div>
                    <form>
                        <textarea
                            name="comment"
                            id="comment"
                            rows={6}
                            className="w-full rounded dark:bg-slate-900 dark:text-white"
                            placeholder="Share your thoughts"
                            maxLength={280}
                            onChange={(e) => setComment(e.target.value)}
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
                        <div className="flex justify-end">
                            <button
                                className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                onClick={(e) => postComment(e)}
                            >
                                Reply
                            </button>
                        </div>
                    </form>
                </div>
                {comments.map((comment, index) => {
                    return (
                        <div
                            key={index}
                            className="my-2 flex flex-col rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                        >
                            <div className="flex items-center justify-between border-b-2 dark:border-gray-600">
                                <p className="text-gray-800 dark:text-white">
                                    {comment.user.firstname}{" "}
                                    {comment.user.lastname}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Posted on:
                                    {dayjs(post?.timestamp).format(
                                        " ddd DD, YYYY, hh:mma"
                                    )}
                                </p>
                            </div>
                            <p className="mt-1 text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                                {comment.comment}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div></div>
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default Post;
