import { create } from "zustand";

interface CurrentPostState {
    postId: string;
    currentPost: string;
    setPostId: (postId: string) => void;
    setCurrentPost: (currentPost: string) => void;
}

const useCurrentPostStore = create<CurrentPostState>((set) => ({
    postId: "",
    currentPost: "",
    setPostId: (postId: string) => set({ postId }),
    setCurrentPost: (currentPost: string) => set({ currentPost }),
}));

export default useCurrentPostStore;
