import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
};

const DeleteModal = ({ setDeleteModal, postId }: Props) => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCloseModal = () => {
        setDeleteModal((state) => !state);
    };

    const deletePost = (postId: string) => {
        // need to send the jwt as the route is protected
        const jwt = cookies.get("jwt_auth");

        fetch(`https://odin-book-api-5r5e.onrender.com/api/post/${postId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success === true) {
                    if (location.pathname != "/main") {
                        navigate("/main");
                    } else {
                        navigate(0);
                    }
                } else {
                    console.log(data.message);
                }
            });
    };

    return (
        <div
            //set the background colour opacity instead of the separate opacity setting as this will prevent elements inside of the modal from having the separate opacity setting applied
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.2]"
            onClick={handleCloseModal}
        >
            <div
                className="p-6 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                // stopPropagation prevents any events within this div from activating the above setDeleteModal function
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Do you want to delete this post?
                </h2>
                <div className="flex justify-center">
                    <button
                        onClick={() => deletePost(postId)}
                        className="rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800 mr-4"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
