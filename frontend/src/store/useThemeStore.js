import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chirpLab-theme") || "sunset",
  setTheme: (theme) => {
    localStorage.setItem("chirpLab-theme", theme);
    set({ theme });
  },
}));