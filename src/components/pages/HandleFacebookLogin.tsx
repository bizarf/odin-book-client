import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import JwtDecodeType from "../../types/jwtDecode";
import UserType from "../../types/userType";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const HandleFacebookLogin = ({ setUser }: Props) => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // get the jwt from the query params
        const params = location.search;
        const token = new URLSearchParams(params).get("token");

        // if there is a token we decode it, set the user object, create a cookie, and then navigate into the app
        if (token) {
            const decode: JwtDecodeType = jwtDecode(token);
            setUser(decode.user);
            cookies.set("jwt_auth", token, {
                // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                expires: new Date(decode.exp * 1000),
            });
            navigate("/main");
        } else {
            navigate("/");
        }
    }, []);

    return <LoadingSpinner />;
};

export default HandleFacebookLogin;
