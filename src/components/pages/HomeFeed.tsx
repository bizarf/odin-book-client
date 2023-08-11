import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import PostType from "../../types/postType";
import PostEditor from "../PostEditor";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DeleteModal from "../modals/DeleteModal";
import PostControls from "../ui/PostControls";

type Props = {
    editor: boolean;
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
};

const HomeFeed = ({ editor, setEditor }: Props) => {
    const [posts, setPosts] = useState<[PostType] | []>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const loadingRef = useRef<boolean>(true);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [postId, setPostId] = useState<string>("");

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
                console.log(data.timeline);
                console.log(loadingRef);
                if (data.success === true) {
                    setPosts(data.timeline);
                }
            });
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            <button
                className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                onClick={() => setEditor((state) => !state)}
            >
                Create post
            </button>
            <div>
                {posts &&
                    posts.map((post, index) => {
                        return (
                            <div
                                key={index}
                                className="my-3 flex flex-col rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <h3 className=" dark:text-white">
                                            {post.user.firstname}{" "}
                                            {post.user.lastname}
                                        </h3>
                                        <p className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                                            Posted on:
                                            {dayjs(post.timestamp).format(
                                                " ddd DD, YYYY, hh:mma"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <PostControls
                                            setDeleteModal={setDeleteModal}
                                            currentPostId={post._id}
                                            setPostId={setPostId}
                                        />
                                    </div>
                                </div>
                                <p className="dark:text-white">
                                    {post.postContent}
                                </p>
                                <div className="dark:text-white">
                                    <button>Likes: {post.likes}</button>
                                    <button>Comments</button>
                                </div>
                                {deleteModal && (
                                    <DeleteModal
                                        setDeleteModal={setDeleteModal}
                                        postId={postId}
                                        // setLoading={setLoading}
                                        // loadingRef={loadingRef}
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {editor && <PostEditor setEditor={setEditor} />}
        </div>
    );
};

export default HomeFeed;
