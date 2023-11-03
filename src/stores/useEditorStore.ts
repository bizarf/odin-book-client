import { create } from "zustand";

// type definition for the store
interface EditorState {
    editor: boolean;
    setEditor: () => void;
    editMode: boolean;
    setEditMode: () => void;
}

const useEditorStore = create<EditorState>((set) => ({
    editor: false,
    setEditor: () => set((state) => ({ editor: !state.editor })),
    editMode: false,
    setEditMode: () => set((state) => ({ editMode: !state.editMode })),
}));

export default useEditorStore;
