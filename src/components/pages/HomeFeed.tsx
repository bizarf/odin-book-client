import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import PostType from "../../types/postType";
import PostEditor from "../modals/PostEditor";
import dayjs from "dayjs";
import DeleteModal from "../modals/DeleteModal";
import PostControls from "../ui/PostControls";
import LikeBtn from "../ui/LikeBtn";
import CommentsBtn from "../ui/CommentsBtn";
import UserType from "../../types/userType";
import { Link } from "react-router-dom";

type Props = {
    editor: boolean;
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserType | undefined;
    deleteModal: boolean;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
    setPostId: React.Dispatch<React.SetStateAction<string>>;
};

const HomeFeed = ({
    editor,
    setEditor,
    user,
    deleteModal,
    setDeleteModal,
    postId,
    setPostId,
}: Props) => {
    const [posts, setPosts] = useState<[PostType] | []>([]);
    const loadingRef = useRef<boolean>(true);

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
                loadingRef.current = false;
                if (data.success === true) {
                    const myPostFeedBtn =
                        document.querySelector("#myPostFeedBtn");
                    const globalFeedBtn =
                        document.querySelector("#globalFeedBtn");

                    myPostFeedBtn?.classList.replace(
                        "dark:text-white",
                        "dark:text-blue-600"
                    );
                    myPostFeedBtn?.classList.add("font-semibold");
                    myPostFeedBtn?.classList.replace(
                        "border-transparent",
                        "border-blue-600"
                    );
                    globalFeedBtn?.classList.replace(
                        "dark:text-blue-600",
                        "dark:text-white"
                    );
                    globalFeedBtn?.classList.remove("font-semibold");
                    globalFeedBtn?.classList.replace(
                        "border-blue-600",
                        "border-transparent"
                    );
                    setPosts([...data.timeline] as [PostType]);
                }
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
                    const myPostFeedBtn =
                        document.querySelector("#myPostFeedBtn");
                    const globalFeedBtn =
                        document.querySelector("#globalFeedBtn");

                    myPostFeedBtn?.classList.replace(
                        "dark:text-blue-600",
                        "dark:text-white"
                    );
                    myPostFeedBtn?.classList.remove("font-semibold");
                    myPostFeedBtn?.classList.replace(
                        "border-blue-600",
                        "border-transparent"
                    );
                    globalFeedBtn?.classList.replace(
                        "dark:text-white",
                        "dark:text-blue-600"
                    );
                    globalFeedBtn?.classList.add("font-semibold");
                    globalFeedBtn?.classList.replace(
                        "border-transparent",
                        "border-blue-600"
                    );
                    console.log(posts);
                    setPosts([...data.globalTimeline] as [PostType]);
                }
            });
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="grid grid-cols-3">
            <div></div>
            <div>
                <div className="border-b border-gray-200 dark:border-gray-700 mt-2">
                    <nav className="-mb-0.5 flex justify-end space-x-6 pr-4 dark:bg-gray-800 rounded-md">
                        <button
                            type="button"
                            className="py-2 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 dark:text-white"
                            id="myPostFeedBtn"
                            onClick={getPosts}
                        >
                            My feed
                        </button>
                        <button
                            type="button"
                            className="py-2 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 dark:text-white"
                            id="globalFeedBtn"
                            onClick={getGlobalFeed}
                        >
                            Global
                        </button>
                    </nav>
                </div>
                <button
                    className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                    onClick={() => setEditor((state) => !state)}
                >
                    Create post
                </button>
                {posts.map((post, index) => {
                    return (
                        <div
                            key={index}
                            className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                        >
                            <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                                <div className="flex items-center py-2">
                                    <Link to={`/main/profile/${post.user._id}`}>
                                        {!user?.photo && (
                                            <img
                                                className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                                src="./placeholder_profile.webp"
                                                alt="User avatar"
                                            />
                                        )}
                                    </Link>
                                    <div>
                                        <h3 className=" dark:text-white">
                                            {post.user.firstname}{" "}
                                            {post.user.lastname}
                                        </h3>

                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            Posted on:
                                            {dayjs(post.timestamp).format(
                                                " ddd DD, YYYY, hh:mma"
                                            )}
                                        </p>
                                    </div>
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

                            <div className="dark:text-white border-t-2 dark:border-slate-700 flex justify-center">
                                <LikeBtn likes={post.likes} postId={post._id} />
                                <CommentsBtn postId={post._id} />
                            </div>
                            {deleteModal && (
                                <DeleteModal
                                    setDeleteModal={setDeleteModal}
                                    postId={postId}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <div></div>
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {editor && <PostEditor setEditor={setEditor} />}
        </div>
    );
};

export default HomeFeed;
