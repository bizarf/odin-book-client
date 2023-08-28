import { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import FriendRequestType from "../../types/friendRequestType";
import UserType from "../../types/userType";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

type Props = {
    user: UserType | undefined;
};

const PendingFriendsList = ({ user }: Props) => {
    const [pendingFriends, setPendingFriends] = useState<
        [FriendRequestType] | []
    >([]);
    const loadingRef = useRef<boolean>(true);

    const cookies = new Cookies();

    const fetchPendingFriends = () => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            "https://odin-book-api-5r5e.onrender.com/api/get-pending-friends",
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                loadingRef.current = false;
                // console.log(data);
                if (data.success === true) {
                    setPendingFriends([...data.existingRequest] as [
                        FriendRequestType,
                    ]);
                    // console.log(pendingFriends);
                }
            });
    };

    const acceptFriendRequest = (userId: string) => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/friend-request-accept/${userId}`,
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
                if (data.success === true) {
                    fetchPendingFriends();
                }
            });
    };

    const rejectFriendRequest = (userId: string) => {
        const jwt = cookies.get("jwt_auth");
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/friend-request-reject/${userId}`,
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
                if (data.success === true) {
                    fetchPendingFriends();
                }
            });
    };

    useEffect(() => {
        fetchPendingFriends();
    }, []);

    return (
        <div>
            <h1 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Pending friend requests
            </h1>
            {pendingFriends.length === 0 && (
                <div className="mx-4 sm:mx-96 rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                    <h2 className="dark:text-white text-lg text-center">
                        There are no pending friend requests
                    </h2>
                </div>
            )}
            {pendingFriends.map((request, index) => {
                if (request.receiver._id === user?._id) {
                    return (
                        <div
                            key={index}
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
                                <button
                                    className="rounded-md border border-transparent bg-blue-600 px-4 sm:px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800 sm:mr-4 mb-2 sm:mb-0"
                                    onClick={() =>
                                        acceptFriendRequest(request.sender._id)
                                    }
                                >
                                    Accept
                                </button>
                                <button
                                    className="rounded-md border border-transparent bg-blue-600 px-4 sm:px-10 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    onClick={() =>
                                        rejectFriendRequest(request.sender._id)
                                    }
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={index}
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
                                <button
                                    className="rounded-md border border-transparent bg-blue-600 px-10 py-2 text-sm font-semibold text-white transition-all  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2  dark:focus:ring-offset-gray-800"
                                    disabled
                                >
                                    Pending
                                </button>
                            </div>
                        </div>
                    );
                }
            })}
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default PendingFriendsList;
