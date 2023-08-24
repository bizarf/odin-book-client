import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useState } from "react";
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
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import JwtDecodeType from "./types/jwtDecode";

const App = () => {
    // sets dark mode
    const [theme, setTheme] = useState<string>();
    // user object
    const [user, setUser] = useState<UserType>();
    // post editor modal
    const [editor, setEditor] = useState<boolean>(false);

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
        <HashRouter>
            <Routes>
                {/* use a shared layout for the opening splash page */}
                <Route
                    path="/"
                    element={<SplashLayout theme={theme} setTheme={setTheme} />}
                >
                    {/* main page for the "/" path is the login page */}
                    <Route
                        index
                        element={<Login getUserInfo={getUserInfo} />}
                    />
                    <Route
                        path="facebook-login"
                        element={
                            <HandleFacebookLogin getUserInfo={getUserInfo} />
                        }
                    />
                    {/* sign up page for user accounts */}
                    <Route path="sign-up" element={<SignUp user={user} />} />
                </Route>

                {/* use a shared layout for the main app */}
                <Route
                    path="/main"
                    element={
                        <MainLayout
                            theme={theme}
                            setTheme={setTheme}
                            user={user}
                            setUser={setUser}
                            editor={editor}
                            setEditor={setEditor}
                            getUserInfo={getUserInfo}
                        />
                    }
                >
                    <Route
                        index
                        element={<HomeFeed setEditor={setEditor} user={user} />}
                    />
                    <Route path="friends-list" element={<FriendsList />} />
                    <Route
                        path="pending-friends"
                        element={<PendingFriendsList user={user} />}
                    />
                    <Route path="post/:id" element={<Post user={user} />} />
                    <Route
                        path="profile/:userId"
                        element={<Profile user={user} />}
                    />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
