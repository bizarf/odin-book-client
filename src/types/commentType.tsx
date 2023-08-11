type CommentType = {
    _id: string;
    user: string;
    comment: string;
    timestamp: Date;
    postId: string;
    likes: number;
    likedBy: Array<string>;
    edited: boolean;
};

export default CommentType;
