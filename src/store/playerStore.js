import { create } from "zustand";

export const usePlayerStore = create((set) => ({
    isPlaying: false,
    isShow: false,
    currentProgram: null,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentProgram: (currentProgram) => set({ currentProgram }),
    setIsShow: (isShow) => set({ isShow }), // Nueva acción para visibilidad
}));
