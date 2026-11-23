import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types';
import i18n from '@/i18n/config';

interface SettingsState {
  language: Language;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: ((localStorage.getItem('mes_lang') as Language) || 'en'),
      theme: 'light',
      sidebarCollapsed: false,

      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'mes_settings' }
  )
);
