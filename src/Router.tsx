import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import MainLayout from "./components/layouts/MainLayout";
import HomeFeed from "./components/pages/HomeFeed";
import SplashLayout from "./components/layouts/SplashLayout";
import GitHubLogin from "./components/pages/GitHubLogin";
import FriendsList from "./components/pages/FriendsList";
import PendingFriendsList from "./components/pages/PendingFriendsList";
import Post from "./components/pages/Post";
import Profile from "./components/pages/Profile";

const Router = () => {
    const router = createHashRouter([
        {
            path: "/",
            element: <SplashLayout />,
            children: [
                {
                    // login page
                    index: true,
                    element: <Login />,
                },
                {
                    // github login callback page. element says facebook as this was originally used to handle facebook login, but it turns out this page also works for github login
                    path: "github-login",
                    element: <GitHubLogin />,
                },
                {
                    path: "sign-up",
                    element: <SignUp />,
                },
            ],
        },
        {
            path: "/main",
            element: <MainLayout />,
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
