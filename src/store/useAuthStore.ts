import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  nickname: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  mode: 'local' | 'cloud';
  setMode: (mode: 'local' | 'cloud') => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      mode: 'local',

      setMode: (mode) => set({ mode }),

      login: (token, user) => set({ token, user, mode: 'cloud' }),

      logout: () => set({ token: null, user: null, mode: 'local' }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
