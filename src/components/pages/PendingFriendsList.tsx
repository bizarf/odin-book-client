import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import FriendRequestType from "../../types/friendRequestType";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import useUserStore from "../../stores/useUserStore";
import fetchPendingFriends from "@/helper/friends/fetchPendingFriends";
import sendAcceptFriendRequest from "@/helper/friends/sendAcceptFriendRequest";
import sendRejectFriendRequest from "@/helper/friends/sendRejectFriendRequest";
import { Button } from "@/components/ui/button";

const PendingFriendsList = () => {
    // user state
    const { user } = useUserStore();

    const [pendingFriends, setPendingFriends] = useState<
        [FriendRequestType] | []
    >([]);
    const [loading, setLoading] = useState<boolean>(true);

    const cookies = new Cookies();
    const jwt = cookies.get("jwt_auth");

    const loadPendingFriends = async () => {
        const data = await fetchPendingFriends(jwt);
        if (data.success) {
            setPendingFriends([...data.existingRequest] as [FriendRequestType]);
            setLoading(false);
        }
    };

    const handleAcceptFriendRequest = async (userId: string) => {
        const data = await sendAcceptFriendRequest(jwt, userId);
        if (data.success === true) {
            loadPendingFriends();
        }
    };

    const handleRejectFriendRequest = async (userId: string) => {
        const data = await sendRejectFriendRequest(jwt, userId);
        if (data.success === true) {
            loadPendingFriends();
        }
    };

    useEffect(() => {
        loadPendingFriends();
    }, []);

    return (
        <div>
            <h1 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Pending friend requests
            </h1>
            {pendingFriends.length === 0 && (
                <div className="mx-auto w-fit px-4 sm:px-14 rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                    <h2 className="dark:text-white text-lg text-center">
                        There are no pending friend requests
                    </h2>
                </div>
            )}
            {pendingFriends.map((request) => {
                if (request.receiver._id === user?._id) {
                    return (
                        <div
                            key={request._id}
                            className="flex justify-between items-center mx-4 sm:mx-60 rounded-xl border bg-white p-2 sm:p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] my-2"
                        >
                            <div className="flex items-center py-2">
                                <Link
                                    to={`/main/profile/${request.sender._id}`}
                                >
                                    {!request.sender.photo ? (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src="./placeholder_profile.webp"
                                            alt="User avatar"
                                        />
                                    ) : (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src={request.sender.photo}
                                            alt="User avatar"
                                        />
                                    )}
                                </Link>
                                <div className="px-2">
                                    <h2 className=" dark:text-white">
                                        {request.sender.firstname}{" "}
                                        {request.sender.lastname}
                                    </h2>

                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Request created on:
                                        {dayjs(request.createdAt).format(
                                            " DD MMM YYYY, hh:mma"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end flex-col sm:block">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white sm:mr-2 px-6 mb-2 sm:mb-0"
                                    onClick={() =>
                                        handleAcceptFriendRequest(
                                            request.sender._id
                                        )
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                    onClick={() =>
                                        handleRejectFriendRequest(
                                            request.sender._id
                                        )
                                    }
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={request._id}
                            className="flex justify-between items-center mx-60 rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7] my-2"
                        >
                            <div className="flex items-center py-2 ">
                                <Link
                                    to={`/main/profile/${request.receiver._id}`}
                                >
                                    {!request.receiver.photo ? (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src="./placeholder_profile.webp"
                                            alt="User avatar"
                                        />
                                    ) : (
                                        <img
                                            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white dark:ring-gray-800 mr-4"
                                            src={request.receiver.photo}
                                            alt="User avatar"
                                        />
                                    )}
                                </Link>
                                <div>
                                    <Link
                                        to={`/main/profile/${request.receiver._id}`}
                                    >
                                        <h3 className=" dark:text-white">
                                            {request.receiver.firstname}{" "}
                                            {request.receiver.lastname}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Request created on:
                                        {dayjs(request.createdAt).format(
                                            " DD MMM YYYY, hh:mma"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled
                                >
                                    Pending
                                </Button>
                            </div>
                        </div>
                    );
                }
            })}
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default PendingFriendsList;
