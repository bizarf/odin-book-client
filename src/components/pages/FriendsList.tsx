import { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import FriendProfileType from "../../types/friendProfileType";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const FriendsList = () => {
    const [friends, setFriends] = useState<[FriendProfileType] | []>([]);
    const loadingRef = useRef<boolean>(true);

    const cookies = new Cookies();

    const fetchFriendsList = () => {
        const jwt = cookies.get("jwt_auth");
        fetch("https://odin-book-api-5r5e.onrender.com/api/get-friends", {
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
                    setFriends([...data.friendsList.friends] as [
                        FriendProfileType,
                    ]);
                }
            });
    };

    const removeFriend = (userId: string) => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/unfriend/${userId}`,
            {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    fetchFriendsList();
                }
            });
    };

    useEffect(() => {
        fetchFriendsList();
    }, []);

    return (
        <div>
            <h1 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Friends list
            </h1>
            {friends.length === 0 && (
                <div className="rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] w-fit mx-auto sm:px-14 px-10">
                    <h3 className="dark:text-white text-lg">
                        You don't have any friends
                    </h3>
                </div>
            )}
            {friends.map((friend, index) => {
                return (
                    <div
                        key={index}
                        className="flex justify-between items-center mx-4 sm:mx-60 rounded-xl border bg-white p-2 sm:p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] my-2"
                    >
                        <div className="flex items-center py-2">
                            <Link to={`/main/profile/${friend._id}`}>
                                {!friend.photo ? (
                                    <img
                                        className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                        src="./placeholder_profile.webp"
                                        alt="User avatar"
                                    />
                                ) : (
                                    <img
                                        className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                        src={friend.photo}
                                        alt="User avatar"
                                    />
                                )}
                            </Link>
                            <div>
                                <h2 className=" dark:text-white">
                                    {friend.firstname} {friend.lastname}
                                </h2>

                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Member since:
                                    {dayjs(friend.joinDate).format(
                                        " DD MMM YYYY"
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            className="rounded-md border border-transparent bg-blue-600 px-4 sm:px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800 sm:mr-4"
                            onClick={() => removeFriend(friend._id)}
                        >
                            Unfriend
                        </button>
                    </div>
                );
            })}
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default FriendsList;
