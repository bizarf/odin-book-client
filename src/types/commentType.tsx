type CommentType = {
    _id: string;
    user: { firstname: string; lastname: string; _id: string };
    comment: string;
    timestamp: Date;
    postId: string;
    likes: number;
    likedBy: Array<string>;
    edited: boolean;
};

export default CommentType;
