import React, { useEffect, useState, useRef } from "react";
import UserType from "../../types/userType";
import PostType from "../../types/postType";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Cookies from "universal-cookie";
import LikeBtn from "../ui/LikeBtn";
import CommentsBtn from "../ui/CommentsBtn";
import DeleteModal from "../modals/DeleteModal";
import dayjs from "dayjs";
import PostControls from "../ui/PostControls";

type Props = {
    user: UserType | undefined;
    deleteModal: boolean;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
    setPostId: React.Dispatch<React.SetStateAction<string>>;
};

const Profile = ({
    user,
    deleteModal,
    setDeleteModal,
    postId,
    setPostId,
}: Props) => {
    const [userProfile, setUserProfile] = useState<UserType>();
    const [posts, setPosts] = useState<[PostType] | []>([]);
    const loadingRef = useRef<boolean>(true);

    const { userId } = useParams();
    const cookies = new Cookies();

    const getUserProfile = () => {
        const jwt = cookies.get("jwt_auth");
        fetch(`https://odin-book-api-5r5e.onrender.com/api/profile/${userId}`, {
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
                    setUserProfile(data.user);
                }
            });
    };

    const getUserPosts = () => {
        const jwt = cookies.get("jwt_auth");
        fetch(`https://odin-book-api-5r5e.onrender.com/api/posts/${userId}`, {
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
                    setPosts([...data.userPosts] as [PostType]);
                }
            });
    };

    useEffect(() => {
        getUserProfile();
        getUserPosts();
    }, []);

    return (
        <div className="">
            <div className="bg-red-700 flex items-center justify-between">
                <div className="flex items-center">
                    <div>
                        {!userProfile?.photo && (
                            <img
                                className="inline-block h-[3.875rem] w-[3.875rem] rounded-full ring-2 ring-white dark:ring-gray-800"
                                src="./placeholder_profile.webp"
                                alt="User avatar"
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl">
                            {userProfile?.firstname} {userProfile?.lastname}
                        </h3>
                    </div>
                </div>
                {user &&
                !userProfile?.friends.includes(user._id) &&
                userProfile?._id !== user._id ? (
                    <button className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800">
                        Add Friend
                    </button>
                ) : (
                    <button className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800">
                        Edit Profile
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2">
                <div className="bg-blue-500 ">Test</div>
                <div className="bg-orange-400 ">
                    {posts.map((post, index) => {
                        return (
                            <div
                                key={index}
                                className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                            >
                                <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                                    <div className="flex items-center py-2">
                                        <Link
                                            to={`/main/profile/${post.user._id}`}
                                        >
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
                                    <LikeBtn
                                        likes={post.likes}
                                        postId={post._id}
                                    />
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
            </div>
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default Profile;
