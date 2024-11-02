import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import FriendProfileType from "../../types/friendProfileType";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import fetchFriendsList from "@/helper/friends/fetchFriendsList";
import removeFriend from "@/helper/friends/removeFriend";
import { Button } from "@/components/ui/button";

const FriendsList = () => {
    const [friends, setFriends] = useState<[FriendProfileType] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const cookies = new Cookies();
    const jwt = cookies.get("jwt_auth");

    // function to fetch the friends list from the backend
    const loadFriendsList = async () => {
        const data = await fetchFriendsList(jwt);
        if (data.success) {
            setFriends([...data.friendsList.friends] as [FriendProfileType]);
            setLoading(false);
        }
    };

    // function to remove a friend from the friends list
    const handleRemoveFriend = async (userId: string) => {
        const data = await removeFriend(userId, jwt);
        if (data.success === true) {
            loadFriendsList();
        }
    };

    useEffect(() => {
        loadFriendsList();
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
            {friends.map((friend) => {
                return (
                    <div
                        key={friend._id}
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
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleRemoveFriend(friend._id)}
                        >
                            Unfriend
                        </Button>
                    </div>
                );
            })}
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default FriendsList;
