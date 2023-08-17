import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import PostEditor from "../modals/PostEditor";

type Props = {
    editor: boolean;
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
};

const FriendsList = ({ editor, setEditor }: Props) => {
    const [friends, setFriends] = useState<[]>([]);
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
                    setFriends(data.friendsList.friends);
                }
            });
    };

    useEffect(() => {
        fetchFriendsList();
    }, []);

    return (
        <div>
            <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Friends list
            </h2>
            {friends.length === 0 && <div>You don't have any friends</div>}
            {loadingRef.current && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {editor && <PostEditor setEditor={setEditor} />}
        </div>
    );
};

export default FriendsList;
