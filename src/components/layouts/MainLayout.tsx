import { useEffect } from "react";
import Header from "../Header";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Cookies from "universal-cookie";
import PostEditor from "../modals/PostEditor";
import useEditorStore from "../../stores/useEditorStore";
import useUserStore from "@/stores/useUserStore";
import fetchUserInfo from "@/helper/fetchUserInfo";

const MainLayout = () => {
    // editor state and editor setter
    const { editor } = useEditorStore();

    // user setter function
    const { setUser } = useUserStore();

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInCheck = async () => {
            const jwt = cookies.get("jwt_auth");
            if (!jwt) {
                navigate("/");
            } else {
                // this is for if the user refreshes while on the main layout
                const data = await fetchUserInfo(jwt);
                if (data.success) {
                    setUser(data.user);
                } else {
                    // specifically check if the 401 unauthorised code is returned. if so, then remove the invalid jwt from the cookie and send the user back to the homepage
                    if (data.message.status === 401) {
                        cookies.remove("jwt_auth");
                        navigate("/");
                    }
                }
            }
        };
        loggedInCheck();
    }, []);

    return (
        <div className="flex min-h-full flex-col dark:bg-slate-600 bg-slate-100">
            <div className="flex-[1_0_auto]">
                <Header />
                <Outlet />
                {editor && <PostEditor />}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
