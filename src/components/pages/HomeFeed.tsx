import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import PostType from "../../types/postType";
import dayjs from "dayjs";
import PostControls from "../ui/PostControls";
import LikeBtn from "../ui/LikeBtn";
import CommentsBtn from "../ui/CommentsBtn";
import { Link } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import useEditorStore from "../../stores/useEditorStore";
import filter from "leo-profanity";

const HomeFeed = () => {
    // user state
    const { user } = useUserStore();
    // editor setter
    const { setEditor } = useEditorStore();

    const [posts, setPosts] = useState<[PostType] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const myPostFeedBtnRef = useRef<HTMLButtonElement>(null);
    const globalFeedBtnRef = useRef<HTMLButtonElement>(null);

    const cookies = new Cookies();

    const getPosts = () => {
        const jwt = cookies.get("jwt_auth");
        fetch("https://odin-book-api-5r5e.onrender.com/api/posts", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    if (myPostFeedBtnRef.current && globalFeedBtnRef.current) {
                        myPostFeedBtnRef.current.classList.replace(
                            "dark:text-white",
                            "dark:text-blue-400"
                        );
                        myPostFeedBtnRef.current.classList.add("font-semibold");
                        myPostFeedBtnRef.current.classList.replace(
                            "border-transparent",
                            "border-blue-400"
                        );
                        globalFeedBtnRef.current.classList.replace(
                            "dark:text-blue-400",
                            "dark:text-white"
                        );
                        globalFeedBtnRef.current.classList.remove(
                            "font-semibold"
                        );
                        globalFeedBtnRef.current.classList.replace(
                            "border-blue-400",
                            "border-transparent"
                        );
                    }
                    setPosts([...data.timeline] as [PostType]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getGlobalFeed = () => {
        const jwt = cookies.get("jwt_auth");
        fetch("https://odin-book-api-5r5e.onrender.com/api/posts/global", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    if (myPostFeedBtnRef.current && globalFeedBtnRef.current) {
                        myPostFeedBtnRef.current.classList.replace(
                            "dark:text-blue-400",
                            "dark:text-white"
                        );
                        myPostFeedBtnRef.current.classList.remove(
                            "font-semibold"
                        );
                        myPostFeedBtnRef.current.classList.replace(
                            "border-blue-400",
                            "border-transparent"
                        );
                        globalFeedBtnRef.current.classList.replace(
                            "dark:text-white",
                            "dark:text-blue-400"
                        );
                        globalFeedBtnRef.current.classList.add("font-semibold");
                        globalFeedBtnRef.current.classList.replace(
                            "border-transparent",
                            "border-blue-400"
                        );
                    }
                    setPosts([...data.globalTimeline] as [PostType]);
                }
            });
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="sm:grid sm:grid-cols-[0.6fr_1fr] mx-4 sm:mx-20 sm:gap-6">
            <div className="sm:flex flex-col items-center my-3 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] h-fit py-4 hidden">
                {!user?.photo ? (
                    <img
                        className="inline-block h-28 w-28 rounded-full ring-2 ring-white dark:ring-gray-800"
                        src="./placeholder_profile.webp"
                        alt="User avatar"
                    />
                ) : (
                    <img
                        className="inline-block h-28 w-28 rounded-full ring-2 ring-white dark:ring-gray-800"
                        src={user.photo}
                        alt="User avatar"
                    />
                )}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl sm:text-3xl dark:text-white font-bold">
                        {user && filter.clean(user.firstname)}{" "}
                        {user && filter.clean(user.lastname)}
                    </h3>
                    <p className="dark:text-white">
                        Friends: {user?.friends.length}
                    </p>
                </div>
            </div>
            <div>
                <div className="border-b border-gray-200 dark:border-gray-700 mt-3">
                    <nav className="-mb-0.5 flex justify-end space-x-6 pr-4 dark:bg-gray-800 rounded-md bg-white">
                        <button
                            type="button"
                            className="py-2 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 dark:text-white"
                            ref={myPostFeedBtnRef}
                            onClick={getPosts}
                        >
                            My feed
                        </button>
                        <button
                            type="button"
                            className="py-2 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 dark:text-white"
                            ref={globalFeedBtnRef}
                            onClick={getGlobalFeed}
                        >
                            Global
                        </button>
                    </nav>
                </div>
                <div className="flex justify-center">
                    <button
                        className="mt-3 rounded-md border border-transparent bg-blue-600 px-14 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                        onClick={setEditor}
                    >
                        Create post
                    </button>
                </div>
                {posts.map((post) => {
                    return (
                        <div
                            key={post._id}
                            className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                        >
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
                                        <Link
                                            to={`/main/profile/${post.user._id}`}
                                        >
                                            <h3 className=" dark:text-white">
                                                {filter.clean(
                                                    post.user.firstname
                                                )}{" "}
                                                {filter.clean(
                                                    post.user.lastname
                                                )}
                                            </h3>
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
                                <CommentsBtn
                                    postId={post._id}
                                    commentCount={post.commentCount}
                                />
                            </div>
                        </div>
                    );
                })}
                {posts.length === 0 && (
                    <div className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                        <p className="dark:text-white p-4 text-center">
                            Your feed is empty. Make a post or add some friends.
                        </p>
                    </div>
                )}
            </div>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default HomeFeed;
