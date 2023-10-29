import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./components/pages/Login";
import UserType from "./types/userType";
import SignUp from "./components/pages/SignUp";
import MainLayout from "./components/layouts/MainLayout";
import HomeFeed from "./components/pages/HomeFeed";
import SplashLayout from "./components/layouts/SplashLayout";
import HandleFacebookLogin from "./components/pages/HandleFacebookLogin";
import FriendsList from "./components/pages/FriendsList";
import PendingFriendsList from "./components/pages/PendingFriendsList";
import Post from "./components/pages/Post";
import Profile from "./components/pages/Profile";

const Router = ({}) => {
    const router = createHashRouter([
        {
            path: "/",
            element: <SplashLayout />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
