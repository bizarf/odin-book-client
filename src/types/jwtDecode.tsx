import UserType from "./userType";

type JwtDecodeType = {
    exp: number;
    iat: number;
    user: UserType;
};

export default JwtDecodeType;
