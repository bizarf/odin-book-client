type FriendRequestType = {
    _id: string;
    sender: {
        _id: string;
        firstname: string;
        lastname: string;
        joinDate: string;
        photo: string;
    };
    receiver: {
        _id: string;
        firstname: string;
        lastname: string;
        joinDate: string;
        photo: string;
    };
    status: string;
    createdAt: Date;
};

export default FriendRequestType;
