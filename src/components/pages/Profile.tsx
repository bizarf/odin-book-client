import { useEffect, useState, useRef, useMemo } from "react";
import UserType from "../../types/userType";
import PostType from "../../types/postType";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Cookies from "universal-cookie";
import LikeBtn from "../buttons/LikeBtn";
import CommentsBtn from "../buttons/CommentsBtn";
import dayjs from "dayjs";
import PostControls from "../controls/PostControls";
import ProfileEditor from "../modals/ProfileEditor";
import useUserStore from "../../stores/useUserStore";
import filter from "leo-profanity";

const Profile = () => {
    // user state
    const { user } = useUserStore();

    const [userProfile, setUserProfile] = useState<UserType>();
    const [posts, setPosts] = useState<[PostType] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [friendRequestFail, setFriendRequestFail] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const addFriendBtnRef = useRef<HTMLButtonElement>(null);

    const { userId } = useParams();
    const cookies = useMemo(() => new Cookies(), []);

    const sendFriendRequest = () => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            `${import.meta.env.VITE_API_HOST}/api/send-friend-request/${userId}`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    if (addFriendBtnRef.current) {
                        addFriendBtnRef.current.textContent = "Sent";
                        addFriendBtnRef.current.disabled = true;
                    }
                } else {
                    // error messages from express validator go here
                    setFriendRequestFail((state) => !state);
                    if (addFriendBtnRef.current) {
                        addFriendBtnRef.current.disabled = true;
                    }
                    setTimeout(() => {
                        setFriendRequestFail((state) => !state);
                    }, 1000);
                }
            });
    };

    useEffect(() => {
        const getUserProfile = () => {
            const jwt = cookies.get("jwt_auth");

            fetch(`${import.meta.env.VITE_API_HOST}/api/profile/${userId}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setUserProfile(data.user);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        const getUserPosts = () => {
            const jwt = cookies.get("jwt_auth");
            fetch(`${import.meta.env.VITE_API_HOST}/api/posts/${userId}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success === true) {
                        setPosts([...data.userPosts] as [PostType]);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        getUserProfile();
        getUserPosts();
    }, [cookies, userId]);

    return (
        <div className="sm:mx-20 mx-4">
            <div className="flex items-center sm:justify-between sm:px-10 sm:py-4 p-2 flex-wrap">
                <div className="flex items-center">
                    <div>
                        {!userProfile?.photo ? (
                            <img
                                className="inline-block h-20 w-20 sm:h-32 sm:w-32 rounded-full ring-2 ring-white dark:ring-gray-800"
                                src="./placeholder_profile.webp"
                                alt="User avatar"
                            />
                        ) : (
                            <img
                                className="inline-block h-20 w-20 sm:h-32 sm:w-32 rounded-full ring-2 ring-white dark:ring-gray-800"
                                src={userProfile.photo}
                                alt="User avatar"
                            />
                        )}
                    </div>
                    <div className="self-end px-6 my-6">
                        <h1 className="text-xl sm:text-3xl dark:text-white font-bold">
                            {userProfile?.firstname} {userProfile?.lastname}
                        </h1>
                        <p className="dark:text-white">
                            Friends: {userProfile?.friends.length}
                        </p>
                    </div>
                </div>
                {user &&
                    !userProfile?.friends.includes(user._id) &&
                    userProfile?._id !== user._id && (
                        <button
                            className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 disabled:bg-slate-500 self-end my-6"
                            ref={addFriendBtnRef}
                            onClick={sendFriendRequest}
                        >
                            Add Friend
                        </button>
                    )}
                {user?.username === "demo@demo.com" &&
                userProfile?.username === "demo@demo.com" ? (
                    <button
                        className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 self-end sm:my-6 my-2 disabled:bg-slate-500"
                        disabled
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        {userProfile?._id === user?._id &&
                            user?.username !== "demo@demo.com" && (
                                <button
                                    className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 self-end sm:my-6 my-2"
                                    onClick={() =>
                                        setEditProfile((state) => !state)
                                    }
                                >
                                    Edit Profile
                                </button>
                            )}
                    </>
                )}
            </div>
            <div className="sm:grid sm:grid-cols-[0.6fr_1fr] sm:gap-6">
                <div className="">
                    <div className="sm:my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] px-6 py-4">
                        <h2 className="dark:text-white text-xl font-bold">
                            About Me:
                        </h2>
                        <p className="dark:text-white">
                            Member since:{" "}
                            {dayjs(userProfile?.joinDate).format(
                                " DD MMM YYYY"
                            )}
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                        <h2 className="my-2 dark:text-white text-xl font-bold text-center">
                            Posts
                        </h2>
                    </div>
                    {posts.map((post) => {
                        return (
                            <div
                                key={post._id}
                                className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                            >
                                <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                                    <div className="flex items-center py-2">
                                        {!userProfile?.photo ? (
                                            <img
                                                className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                                src="./placeholder_profile.webp"
                                                alt="User avatar"
                                            />
                                        ) : (
                                            <img
                                                className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                                src={userProfile.photo}
                                                alt="User avatar"
                                            />
                                        )}
                                        <div>
                                            <h3 className=" dark:text-white">
                                                {filter.clean(
                                                    post.user.firstname
                                                )}{" "}
                                                {filter.clean(
                                                    post.user.lastname
                                                )}
                                            </h3>
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
                                    <LikeBtn
                                        likes={post.likes}
                                        postId={post._id}
                                    />
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
                                You haven't made any posts yet.{" "}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {friendRequestFail && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-3xl dark:text-white">
                            Friend request has already been sent
                        </h2>
                    </div>
                </div>
            )}
            {editProfile && (
                <ProfileEditor
                    setEditProfile={setEditProfile}
                    userFirstname={user?.firstname}
                    userLastname={user?.lastname}
                    userUsername={user?.username}
                    userPhoto={user?.photo}
                    userId={user?._id}
                />
            )}
        </div>
    );
};

export default Profile;
