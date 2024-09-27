import "./App.css";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import JwtDecodeType from "./types/jwtDecode";
import useUserStore from "./stores/useUserStore";
import Router from "./Router";

const App = () => {
    // user setter function
    const { setUser } = useUserStore();
    // initialise universal cookie
    const cookies = new Cookies();

    const getUserInfo = () => {
        // set this variable to the jwt if the cookies have a variable called jwt_auth
        const jwt = cookies.get("jwt_auth");
        // decode the jwt
        const decode: JwtDecodeType = jwtDecode(jwt);
        fetch(`${import.meta.env.VITE_API_HOST}/api/profile/${decode.user}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    setUser(data.user);
                }
            });
    };

    return (
        <>
            <Router getUserInfo={getUserInfo} />
        </>
    );
};

export default App;
