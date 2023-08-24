type PostType = {
    _id: string;
    user: {
        _id: string;
        firstname: string;
        lastname: string;
        username: string;
        type: string;
        photo: string;
    };
    postContent: string;
    timestamp: Date;
    likes: number;
    likedBy: Array<string>;
    edited: boolean;
    commentCount: number;
};

export default PostType;
