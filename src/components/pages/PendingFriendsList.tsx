import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";

const PendingFriendsList = () => {
    const [pendingFriends, setPendingFriends] = useState<[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    const loadingRef = useRef<boolean>(true);

    const cookies = new Cookies();

    const fetchPendingFriends = () => {
        // setLoading((prevState) => !prevState);
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
                // setLoading((prevState) => !prevState);
                loadingRef.current = false;
                if (data.success === true) {
                    setPendingFriends(data.existingRequest);
                }
            });
    };

    useEffect(() => {
        fetchPendingFriends();
    }, []);

    return (
        <div>
            <div>
                <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                    Pending friend request
                </h2>
                {pendingFriends.length === 0 && (
                    <div>There are no pending friend requests</div>
                )}
            </div>
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
        </div>
    );
};

export default PendingFriendsList;
