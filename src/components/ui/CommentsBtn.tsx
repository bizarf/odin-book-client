import { useNavigate } from "react-router-dom";

type Props = {
    postId: string;
};

const CommentsBtn = ({ postId }: Props) => {
    const navigate = useNavigate();

    const handlePostLoading = () => {
        navigate(`/main/post/${postId}`);
    };

    return (
        <>
            <button
                className="w-full hover:bg-slate-200 hover:dark:bg-slate-900 dark:border-slate-700 border-l-2"
                onClick={handlePostLoading}
            >
                Comments
            </button>
        </>
    );
};

export default CommentsBtn;
