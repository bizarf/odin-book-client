import { useState } from "react";
import CommentEditor from "../modals/CommentEditor";
import DeleteCommentModal from "../modals/DeleteCommentModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    DotsHorizontalIcon,
    Pencil2Icon,
    TrashIcon,
} from "@radix-ui/react-icons";

type Props = {
    commentId: string;
    commentContent: string;
    postId: string | undefined;
};

const CommentControls = ({ commentId, commentContent, postId }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const openDeleteModal = () => {
        setDeleteModal((state) => !state);
    };

    const openEditPost = () => {
        setEdit((state) => !state);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <DotsHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={openEditPost}
                        aria-label="edit post"
                    >
                        <Pencil2Icon className="mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={openDeleteModal}
                        aria-label="delete post"
                    >
                        <TrashIcon className="mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {edit && (
                <CommentEditor
                    setEdit={setEdit}
                    commentId={commentId}
                    commentContent={commentContent}
                    postId={postId}
                />
            )}
            {deleteModal && (
                <DeleteCommentModal
                    setDeleteModal={setDeleteModal}
                    postId={postId}
                    commentId={commentId}
                />
            )}
        </>
    );
};

export default CommentControls;
