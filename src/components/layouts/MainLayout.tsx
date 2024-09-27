import { useEffect } from "react";
import Header from "../Header";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Cookies from "universal-cookie";
import PostEditor from "../modals/PostEditor";
import useEditorStore from "../../stores/useEditorStore";

type Props = {
    getUserInfo: () => void;
};

const MainLayout = ({ getUserInfo }: Props) => {
    // editor state and editor setter
    const { editor } = useEditorStore();

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = cookies.get("jwt_auth");
        if (!jwt) {
            navigate("/");
        }
    }, []);

    return (
        <div className="flex min-h-full flex-col dark:bg-slate-600 bg-slate-100">
            <div className="flex-[1_0_auto]">
                <Header getUserInfo={getUserInfo} />
                <Outlet />
                {editor && <PostEditor />}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
