import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'dark',
            setMode: (mode) => {
                set({ mode });
                
                // Apply theme to document
                if (mode === 'light') {
                    document.documentElement.classList.add('light-theme');
                    document.documentElement.classList.remove('dark-theme');
                } else {
                    document.documentElement.classList.add('dark-theme');
                    document.documentElement.classList.remove('light-theme');
                }
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);
