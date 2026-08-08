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

interface WishState {
  wishes: Wish[];
  isLoading: boolean;
  init: () => Promise<void>;
  addWish: (wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt' | 'achieved' | 'currentSaved'> & { currentSaved?: number }) => void;
  updateWish: (id: string, updates: Partial<Wish>) => void;
  deleteWish: (id: string) => void;
  getWish: (id: string) => Wish | undefined;
  addSavings: (id: string, amount: number) => void;
  markAchieved: (id: string) => void;
  getActiveWishes: () => Wish[];
  getAchievedWishes: () => Wish[];
  getWishesByPriority: (priority: WishPriority) => Wish[];
  resetToDefault: () => void;
  refresh: () => void;
}

export const useWishStore = create<WishState>((set, get) => ({
  wishes: [],
  isLoading: true,

  init: async () => {
    await initDB();
    set({ wishes: getWishes(), isLoading: false });
  },

  addWish: (wish) => {
    dbAddWish({
      ...wish,
      achieved: false,
      currentSaved: wish.currentSaved || 0,
    } as Wish);
    set({ wishes: getWishes() });
  },

  updateWish: (id, updates) => {
    dbUpdateWish(id, updates);
    set({ wishes: getWishes() });
  },

  deleteWish: (id) => {
    dbDeleteWish(id);
    set({ wishes: getWishes() });
  },

  getWish: (id) => {
    return get().wishes.find((wish) => wish.id === id);
  },

  addSavings: (id, amount) => {
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
  },

  markAchieved: (id) => {
    const wish = get().wishes.find((w) => w.id === id);
    if (!wish) return;
    dbUpdateWish(id, {
      achieved: true,
      currentSaved: wish.targetPrice,
      achievedAt: new Date().toISOString(),
    });
    set({ wishes: getWishes() });
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

  resetToDefault: () => {
    resetDB();
    set({ wishes: getWishes() });
  },

  refresh: () => {
    set({ wishes: getWishes() });
  },
}));
