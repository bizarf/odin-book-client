import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import CommentType from "../types/commentType";
import UserType from "../types/userType";
import PostType from "../types/postType";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import CommentControls from "./controls/CommentControls";
import filter from "leo-profanity";

type Props = {
    comments: CommentType[];
    user: UserType | undefined;
    post: PostType | undefined;
};

const Comments = ({ comments, user, post }: Props) => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleLikeToggle = (commentId: string) => {
        const jwt = cookies.get("jwt_auth");

        fetch(
            `${import.meta.env.VITE_API_HOST}/api/post/${post?._id}/comments/${commentId}/like`,
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success === true) {
                    navigate(0);
                } else {
                    console.log(data.message);
                }
            });
    };

    return (
        <>
            {comments.map((comment, index) => {
                return (
                    <div
                        key={index}
                        className="my-2 flex flex-col rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                    >
                        <div className="flex items-center justify-between border-b-2 dark:border-gray-600">
                            <div className="flex items-center py-2">
                                <Link to={`/main/profile/${comment.user._id}`}>
                                    {!comment.user?.photo ? (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src="./placeholder_profile.webp"
                                            alt="User avatar"
                                        />
                                    ) : (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src={comment.user.photo}
                                            alt="User avatar"
                                        />
                                    )}
                                </Link>
                                <div>
                                    <Link
                                        to={`/main/profile/${comment.user._id}`}
                                    >
                                        <h2 className=" dark:text-white">
                                            {filter.clean(
                                                comment.user.firstname
                                            )}{" "}
                                            {filter.clean(
                                                comment.user.lastname
                                            )}
                                        </h2>
                                    </Link>

                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Posted on:
                                        {dayjs(comment.timestamp).format(
                                            " ddd DD, YYYY, hh:mma"
                                        )}
                                        {comment.edited && (
                                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                                {" "}
                                                (edited)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {user?._id === comment.user._id && (
                                <div>
                                    <CommentControls
                                        commentId={comment._id}
                                        commentContent={comment.comment}
                                        postId={post?._id}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                            {filter.clean(comment.comment)}
                        </p>
                        <button
                            className="w-full hover:bg-slate-200 hover:dark:bg-slate-900 dark:border-slate-700 border-2 dark:text-white border-slate-300 mt-2"
                            onClick={() => handleLikeToggle(comment._id)}
                        >
                            Likes: {comment.likes}
                        </button>
                    </div>
                );
            })}
        </>
    );
};

export default Comments;
