import { useEffect } from "react";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import JwtDecodeType from "../../types/jwtDecode";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    getUserInfo: () => void;
};

const HandleFacebookLogin = ({ getUserInfo }: Props) => {
    // universal cookie initialisation
    const cookies = new Cookies();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // get the jwt from the query params
        const params = location.search;
        const token = new URLSearchParams(params).get("token");

        // if there is a token we decode it, create a cookie, fetch the user info from the db and then navigate into the app
        if (token) {
            const decode: JwtDecodeType = jwtDecode(token);
            cookies.set("jwt_auth", token, {
                // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                expires: new Date(decode.exp * 1000),
            });
            getUserInfo();
            navigate("/main");
        } else {
            navigate("/");
        }
    }, []);

    return <LoadingSpinner />;
};

export default HandleFacebookLogin;
