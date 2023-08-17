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

const App = () => {
    // sets dark mode
    const [theme, setTheme] = useState<string>();
    // user object
    const [user, setUser] = useState<UserType>();
    // post editor modal
    const [editor, setEditor] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [postId, setPostId] = useState<string>("");

    return (
        <HashRouter>
            <Routes>
                {/* use a shared layout for the opening splash page */}
                <Route
                    path="/"
                    element={<SplashLayout theme={theme} setTheme={setTheme} />}
                >
                    {/* main page for the "/" path is the login page */}
                    <Route index element={<Login setUser={setUser} />} />
                    <Route
                        path="facebook-login"
                        element={<HandleFacebookLogin setUser={setUser} />}
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
                        />
                    }
                >
                    <Route
                        index
                        element={
                            <HomeFeed
                                editor={editor}
                                setEditor={setEditor}
                                user={user}
                                deleteModal={deleteModal}
                                setDeleteModal={setDeleteModal}
                                postId={postId}
                                setPostId={setPostId}
                            />
                        }
                    />
                    <Route
                        path="friends-list"
                        element={
                            <FriendsList
                                editor={editor}
                                setEditor={setEditor}
                            />
                        }
                    />
                    <Route
                        path="pending-friends"
                        element={<PendingFriendsList />}
                    />
                    <Route path="post/:id" element={<Post user={user} />} />
                    <Route
                        path="profile/:userId"
                        element={
                            <Profile
                                user={user}
                                deleteModal={deleteModal}
                                setDeleteModal={setDeleteModal}
                                postId={postId}
                                setPostId={setPostId}
                            />
                        }
                    />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
