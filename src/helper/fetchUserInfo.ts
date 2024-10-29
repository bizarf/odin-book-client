import { jwtDecode } from "jwt-decode";
import JwtDecodeType from "../types/jwtDecode";

const fetchUserInfo = async (jwt: string) => {
    const decode: JwtDecodeType = jwtDecode(jwt);
    // this needs to be a variable so that I can pass on the status code to handle unauthorised users
    let response;
    // these helper functions should be in try catch blocks. if the fetch fails
    try {
        response = await fetch(
            `${import.meta.env.VITE_API_HOST}/api/profile/${decode.user}`,
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return { success: false, message: response };
    }
};

export default fetchUserInfo;
