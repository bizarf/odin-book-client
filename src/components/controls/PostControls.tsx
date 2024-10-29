import { useState } from "react";
import DeleteModal from "../modals/DeletePostModal";
import PostEditor from "../modals/PostEditor";
import useEditorStore from "../../stores/useEditorStore";
import useCurrentPostStore from "../../stores/useCurrentPostStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    HamburgerMenuIcon,
    Pencil2Icon,
    TrashIcon,
} from "@radix-ui/react-icons";

type Props = {
    postId: string;
    currentPost: string;
};

const PostControls = ({ postId, currentPost }: Props) => {
    // editor state, and editor setter
    const { editor, setEditor } = useEditorStore();
    // editMode setter
    const { setEditMode } = useEditorStore();
    // postId setter, and currentPost setter
    const { setPostId, setCurrentPost } = useCurrentPostStore();

    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const openDeleteModal = () => {
        setDeleteModal((state) => !state);
    };

    const openEditPost = () => {
        setPostId(postId);
        setCurrentPost(currentPost);
        setEditMode();
        setEditor();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <HamburgerMenuIcon />
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
            {deleteModal && (
                <DeleteModal setDeleteModal={setDeleteModal} postId={postId} />
            )}
            {editor && <PostEditor />}
        </>
    );
};

export default PostControls;
