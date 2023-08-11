type PostType = {
    _id: string;
    user: {
        _id: string;
        firstname: string;
        lastname: string;
        username: string;
        type: string;
    };
    postContent: string;
    timestamp: Date;
    likes: number;
    likedBy: Array<string>;
    edited: boolean;
};

export default PostType;
