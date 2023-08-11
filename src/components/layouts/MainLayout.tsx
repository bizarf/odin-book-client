import React from "react";
import Header from "../Header";
import UserType from "../../types/userType";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";

type Props = {
    theme: string | undefined;
    setTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    editor: boolean;
    setEditor: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainLayout = ({
    theme,
    setTheme,
    user,
    setUser,
    editor,
    setEditor,
}: Props) => {
    return (
        <div className="flex min-h-full flex-col dark:bg-slate-600">
            <div className="flex-[1_0_auto]">
                <Header
                    theme={theme}
                    setTheme={setTheme}
                    user={user}
                    setUser={setUser}
                    editor={editor}
                    setEditor={setEditor}
                />
                <Outlet />
            </div>
            <Footer theme={theme} />
        </div>
    );
};

export default MainLayout;
