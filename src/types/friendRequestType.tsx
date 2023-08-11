type FriendRequestType = {
    _id: string;
    sender: string;
    receiver: string;
    status: string;
    createdAt: Date;
};

export default FriendRequestType;
