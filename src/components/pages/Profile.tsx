import { useEffect, useState, useRef } from "react";
import UserType from "../../types/userType";
import PostType from "../../types/postType";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Cookies from "universal-cookie";
import LikeBtn from "../ui/LikeBtn";
import CommentsBtn from "../ui/CommentsBtn";
import dayjs from "dayjs";
import PostControls from "../ui/PostControls";
import ProfileEditor from "../modals/ProfileEditor";

type Props = {
    user: UserType | undefined;
};

const Profile = ({ user }: Props) => {
    const [userProfile, setUserProfile] = useState<UserType>();
    const [posts, setPosts] = useState<[PostType] | []>([]);
    const loadingRef = useRef<boolean>(true);
    const [friendRequestFail, setFriendRequestFail] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<boolean>(false);

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

    const sendFriendRequest = () => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/send-friend-request/${userId}`,
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
                loadingRef.current = false;

                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    const addFriendBtn = document.querySelector(
                        "#addFriendBtn"
                    ) as HTMLButtonElement;
                    if (addFriendBtn) {
                        addFriendBtn.textContent = "Sent";
                        addFriendBtn.disabled = true;
                    }
                } else {
                    // error messages from express validator go here
                    setFriendRequestFail((state) => !state);
                    const addFriendBtn = document.querySelector(
                        "#addFriendBtn"
                    ) as HTMLButtonElement;
                    if (addFriendBtn) {
                        addFriendBtn.disabled = true;
                    }
                    setTimeout(() => {
                        setFriendRequestFail((state) => !state);
                    }, 4000);
                }
            });
    };

    useEffect(() => {
        getUserProfile();
        getUserPosts();
    }, []);

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
                            className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 disabled:bg-blue-600 self-end my-6"
                            id="addFriendBtn"
                            onClick={sendFriendRequest}
                        >
                            Add Friend
                        </button>
                    )}
                {userProfile?._id === user?._id && (
                    <button
                        className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 self-end sm:my-6 my-2"
                        onClick={() => setEditProfile((state) => !state)}
                    >
                        Edit Profile
                    </button>
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
                                " DD MMM YYYY, hh:mma"
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
                    {posts.map((post, index) => {
                        return (
                            <div
                                key={index}
                                className="my-3 flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                            >
                                <div className="flex items-center justify-between mx-4 pt-1 border-b-2 dark:border-gray-600">
                                    <div className="flex items-center py-2">
                                        {!user?.photo ? (
                                            <img
                                                className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                                src="./placeholder_profile.webp"
                                                alt="User avatar"
                                            />
                                        ) : (
                                            <img
                                                className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                                src={user.photo}
                                                alt="User avatar"
                                            />
                                        )}
                                        <div>
                                            <h3 className=" dark:text-white">
                                                {post.user.firstname}{" "}
                                                {post.user.lastname}
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
                                <p className="dark:text-white px-4 py-2">
                                    {post.postContent}
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
            {loadingRef.current && (
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
