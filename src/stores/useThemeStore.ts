import { create } from "zustand";

// type definition for the store
interface ThemeState {
    theme: string | undefined;
    setTheme: (theme: string | undefined) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
    theme: undefined,
    setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;
