import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import MainLayout from "./components/layouts/MainLayout";
import HomeFeed from "./components/pages/HomeFeed";
import SplashLayout from "./components/layouts/SplashLayout";
import HandleFacebookLogin from "./components/pages/HandleFacebookLogin";
import FriendsList from "./components/pages/FriendsList";
import PendingFriendsList from "./components/pages/PendingFriendsList";
import Post from "./components/pages/Post";
import Profile from "./components/pages/Profile";

type Props = {
    getUserInfo: () => void;
};

const Router = ({ getUserInfo }: Props) => {
    const router = createHashRouter([
        {
            path: "/",
            element: <SplashLayout />,
            children: [
                {
                    index: true,
                    element: <Login getUserInfo={getUserInfo} />,
                },
                {
                    path: "github-login",
                    element: <HandleFacebookLogin getUserInfo={getUserInfo} />,
                },
                {
                    path: "sign-up",
                    element: <SignUp />,
                },
            ],
        },
        {
            path: "/main",
            element: <MainLayout getUserInfo={getUserInfo} />,
            children: [
                {
                    index: true,
                    element: <HomeFeed />,
                },
                {
                    path: "friends-list",
                    element: <FriendsList />,
                },
                {
                    path: "pending-friends",
                    element: <PendingFriendsList />,
                },
                {
                    path: "post/:id",
                    element: <Post />,
                },
                {
                    path: "profile/:userId",
                    element: <Profile />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
