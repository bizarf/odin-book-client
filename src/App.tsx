import "./App.css";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import JwtDecodeType from "./types/jwtDecode";
import useUserStore from "./stores/useUserStore";
import Router from "./Router";

const App = () => {
    // user setter function
    const { setUser } = useUserStore();

    const cookies = new Cookies();

    const getUserInfo = () => {
        const jwt = cookies.get("jwt_auth");
        const decode: JwtDecodeType = jwtDecode(jwt);
        fetch(
            `https://odin-book-api-5r5e.onrender.com/api/profile/${decode.user}`,
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
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
