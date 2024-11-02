import React from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Props = {
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string | undefined;
    commentId: string;
};

const DeleteCommentModal = ({ setDeleteModal, postId, commentId }: Props) => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setDeleteModal((state) => !state);
    };

    const deleteComment = () => {
        // need to send the jwt as the route is protected
        const jwt = cookies.get("jwt_auth");

        fetch(
            `${import.meta.env.VITE_API_HOST}/api/post/${postId}/comments/${commentId}`,
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
                    navigate(0);
                } else {
                    console.log(data.message);
                }
            });
    };

    return (
        <div
            //set the background colour opacity instead of the separate opacity setting as this will prevent elements inside of the modal from having the separate opacity setting applied
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.7]"
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
                    <Button
                        className="text-base mr-4 px-8 bg-blue-600 hover:bg-blue-700 dark:text-white "
                        onClick={deleteComment}
                    >
                        Yes
                    </Button>
                    <Button
                        className="text-base px-8 bg-blue-600 hover:bg-blue-700 dark:text-white "
                        onClick={handleCloseModal}
                    >
                        No
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCommentModal;
