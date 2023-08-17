import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    likes: number;
    postId: string;
};

const LikeBtn = ({ likes, postId }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleLikeToggle = () => {
        const jwt = cookies.get("jwt_auth");
        setLoading((state) => !state);

        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/post/${postId}/like`,
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
                    navigate(0);
                } else {
                    console.log(data.message);
                }
            });
    };

    return (
        <>
            <button
                className="w-full hover:bg-slate-200 hover:dark:bg-slate-900 dark:border-slate-700 border-r-2"
                onClick={handleLikeToggle}
            >
                Likes: {likes}
            </button>
            {loading && <LoadingSpinner />}
        </>
    );
};

export default LikeBtn;
