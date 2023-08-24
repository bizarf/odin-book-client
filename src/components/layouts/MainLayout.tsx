import React, { useEffect, useState } from "react";
import Header from "../ui/Header";
import UserType from "../../types/userType";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
import Cookies from "universal-cookie";
import PostEditor from "../modals/PostEditor";

type Props = {
    theme: string | undefined;
    setTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
    user: UserType | undefined;
    setUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
    editor: boolean;
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
    getUserInfo: () => void;
};

const MainLayout = ({
    theme,
    setTheme,
    user,
    setUser,
    editor,
    setEditor,
    getUserInfo,
}: Props) => {
    // edit mode. this does nothing. just putting this here so that i don't have to make a separate post editor component just to make new posts
    const [editMode, setEditMode] = useState<boolean>(false);

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
                <Header
                    theme={theme}
                    setTheme={setTheme}
                    user={user}
                    setUser={setUser}
                    setEditor={setEditor}
                    getUserInfo={getUserInfo}
                />
                <Outlet />
                {editor && (
                    <PostEditor
                        setEditor={setEditor}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        postId={undefined}
                        currentPost={undefined}
                    />
                )}
            </div>
            <Footer theme={theme} />
        </div>
    );
};

export default MainLayout;
