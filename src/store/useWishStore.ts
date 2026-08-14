import { create } from 'zustand';
import type { Wish, WishPriority } from '@/types';
import {
  getWishes,
  addWish as dbAddWish,
  updateWish as dbUpdateWish,
  deleteWish as dbDeleteWish,
  initDB,
  resetDB,
} from '@/utils/db';
import { api } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface WishState {
  wishes: Wish[];
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  addWish: (wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt' | 'achieved' | 'currentSaved'> & { currentSaved?: number }) => Promise<void>;
  updateWish: (id: string, updates: Partial<Wish>) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  getWish: (id: string) => Wish | undefined;
  addSavings: (id: string, amount: number) => Promise<void>;
  markAchieved: (id: string) => Promise<void>;
  getActiveWishes: () => Wish[];
  getAchievedWishes: () => Wish[];
  getWishesByPriority: (priority: WishPriority) => Wish[];
  resetToDefault: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchWishes: (params?: Record<string, string>) => Promise<void>;
}

export const useWishStore = create<WishState>((set, get) => ({
  wishes: [],
  isLoading: true,
  error: null,

  init: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      await initDB();
      set({ wishes: getWishes(), isLoading: false });
    } else {
      await get().fetchWishes();
    }
  },

  fetchWishes: async (params) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ isLoading: false, error: '未登录' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.wishes.list(token, params);
      set({ wishes: res.wishes, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addWish: async (wish) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbAddWish({
        ...wish,
        achieved: false,
        currentSaved: wish.currentSaved || 0,
      } as Wish);
      set({ wishes: getWishes() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.wishes.create(token, {
          ...wish,
          currentSaved: wish.currentSaved || 0,
        });
        set((state) => ({ wishes: [res.wish, ...state.wishes] }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  updateWish: async (id, updates) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbUpdateWish(id, updates);
      set({ wishes: getWishes() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.wishes.update(token, id, updates);
        set((state) => ({
          wishes: state.wishes.map((w) => (w.id === id ? res.wish : w)),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  deleteWish: async (id) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbDeleteWish(id);
      set({ wishes: getWishes() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        await api.wishes.delete(token, id);
        set((state) => ({
          wishes: state.wishes.filter((w) => w.id !== id),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  getWish: (id) => {
    return get().wishes.find((wish) => wish.id === id);
  },

  addSavings: async (id, amount) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      const wish = get().wishes.find((w) => w.id === id);
      if (!wish) return;
      const newSaved = Math.min(wish.targetPrice, wish.currentSaved + amount);
      const achieved = newSaved >= wish.targetPrice;
      dbUpdateWish(id, {
        currentSaved: newSaved,
        achieved,
        achievedAt: achieved ? new Date().toISOString() : wish.achievedAt,
      });
      set({ wishes: getWishes() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.wishes.addSavings(token, id, amount);
        set((state) => ({
          wishes: state.wishes.map((w) => (w.id === id ? res.wish : w)),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  markAchieved: async (id) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      const wish = get().wishes.find((w) => w.id === id);
      if (!wish) return;
      dbUpdateWish(id, {
        achieved: true,
        currentSaved: wish.targetPrice,
        achievedAt: new Date().toISOString(),
      });
      set({ wishes: getWishes() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.wishes.markAchieved(token, id);
        set((state) => ({
          wishes: state.wishes.map((w) => (w.id === id ? res.wish : w)),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  getActiveWishes: () => {
    return get()
      .wishes.filter((w) => !w.achieved)
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  },

  getAchievedWishes: () => {
    return get()
      .wishes.filter((w) => w.achieved)
      .sort((a, b) => new Date(b.achievedAt || '').getTime() - new Date(a.achievedAt || '').getTime());
  },

  getWishesByPriority: (priority) => {
    return get().wishes.filter((w) => w.priority === priority && !w.achieved);
  },

  resetToDefault: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      resetDB();
      set({ wishes: getWishes() });
    }
  },

  refresh: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      set({ wishes: getWishes() });
    } else {
      await get().fetchWishes();
    }
  },
}));
