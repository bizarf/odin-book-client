type UserType = {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    provider: string;
    joinDate: Date;
    photo: string;
    friends: Array<string>;
    type: string;
};

export default UserType;
