import { create } from 'zustand';
import type { AppSettings } from '@/types';
import { getFromStorage, setToStorage } from '@/utils/storage';

interface SettingsState {
  settings: AppSettings;
  setTheme: (theme: AppSettings['theme']) => void;
  setCurrency: (currency: string) => void;
  setDateFormat: (format: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const STORAGE_KEY = 'wuxi-settings';

const defaultSettings: AppSettings = {
  theme: 'light',
  currency: '¥',
  dateFormat: 'YYYY-MM-DD',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getFromStorage(STORAGE_KEY, defaultSettings),

  setTheme: (theme) => {
    set((state) => {
      const settings = { ...state.settings, theme };
      setToStorage(STORAGE_KEY, settings);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return { settings };
    });
  },

  setCurrency: (currency) => {
    set((state) => {
      const settings = { ...state.settings, currency };
      setToStorage(STORAGE_KEY, settings);
      return { settings };
    });
  },

  setDateFormat: (dateFormat) => {
    set((state) => {
      const settings = { ...state.settings, dateFormat };
      setToStorage(STORAGE_KEY, settings);
      return { settings };
    });
  },

  updateSettings: (updates) => {
    set((state) => {
      const settings = { ...state.settings, ...updates };
      setToStorage(STORAGE_KEY, settings);
      return { settings };
    });
  },
}));
