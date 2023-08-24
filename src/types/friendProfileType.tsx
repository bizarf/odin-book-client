type FriendProfileType = {
    _id: string;
    firstname: string;
    lastname: string;
    joinDate: Date;
    photo: string;
    friends: Array<string>;
};

export default FriendProfileType;
