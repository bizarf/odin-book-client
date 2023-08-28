import { useState } from "react";
import DeleteModal from "../modals/DeletePostModal";
import PostEditor from "../modals/PostEditor";

type Props = {
    postId: string;
    currentPost: string;
};

const PostControls = ({ postId, currentPost }: Props) => {
    const [editor, setEditor] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const openDeleteModal = () => {
        setDeleteModal((state) => !state);
    };

    const openEditPost = () => {
        setEditMode((state) => !state);
        setEditor((state) => !state);
    };

    return (
        <div className="hs-dropdown relative inline-flex [--placement:left-top]">
            <button
                id="hs-dropdown-custom-icon-trigger"
                type="button"
                className="hs-dropdown-toggle transition-all rounded-full hover:dark:bg-slate-700 p-2 hover:bg-slate-300"
                aria-label="Dropdown menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 dark:text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                </svg>
            </button>
            <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700 min-w-fit"
                aria-labelledby="hs-dropdown-custom-icon-trigger"
            >
                <button
                    className="hover:dark:bg-slate-700 p-1 hover:bg-slate-300 gap-x-3.5 py-2 px-3 rounded-md text-md text-gray-800 focus:ring-2 focus:ring-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300 flex w-full items-center"
                    aria-label="edit post"
                    onClick={openEditPost}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 dark:text-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>
                    <span> Edit</span>
                </button>
                <button
                    className="hover:dark:bg-slate-700 p-1 hover:bg-slate-300 gap-x-3.5 py-2 px-3 rounded-md text-md text-gray-800 focus:ring-2 focus:ring-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300 flex w-full items-center"
                    aria-label="delete post"
                    onClick={openDeleteModal}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 dark:text-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                    <span> Delete</span>
                </button>
            </div>
            {deleteModal && (
                <DeleteModal setDeleteModal={setDeleteModal} postId={postId} />
            )}
            {editor && (
                <PostEditor
                    postId={postId}
                    setEditor={setEditor}
                    editMode={editMode}
                    currentPost={currentPost}
                    setEditMode={setEditMode}
                />
            )}
        </div>
    );
};

export default PostControls;
