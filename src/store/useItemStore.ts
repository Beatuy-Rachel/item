import { create } from 'zustand';
import type { Item, Category } from '@/types';
import { getItems, addItem as dbAddItem, updateItem as dbUpdateItem, deleteItem as dbDeleteItem, searchItems as dbSearchItems, resetDB, initDB } from '@/utils/db';
import { api } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Item['status'] }) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => Item | undefined;
  getItemsByCategory: (category: Category) => Item[];
  searchItems: (query: string) => Item[];
  resetToDefault: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchItems: (params?: Record<string, string>) => Promise<void>;
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  isLoading: true,
  error: null,

  init: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      await initDB();
      set({ items: getItems(), isLoading: false });
    } else {
      await get().fetchItems();
    }
  },

  fetchItems: async (params) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ isLoading: false, error: '未登录' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.items.list(token, params);
      set({ items: res.items, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addItem: async (item) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbAddItem(item);
      set({ items: getItems() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.items.create(token, item);
        set((state) => ({ items: [res.item, ...state.items] }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  updateItem: async (id, updates) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbUpdateItem(id, updates);
      set({ items: getItems() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        const res = await api.items.update(token, id, updates);
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? res.item : item)),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  deleteItem: async (id) => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      dbDeleteItem(id);
      set({ items: getItems() });
    } else {
      const token = useAuthStore.getState().token;
      if (!token) return;

      try {
        await api.items.delete(token, id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      }
    }
  },

  getItem: (id) => {
    return get().items.find((item) => item.id === id);
  },

  getItemsByCategory: (category) => {
    return get().items.filter((item) => item.category === category);
  },

  searchItems: (query) => {
    const mode = useAuthStore.getState().mode;
    if (mode === 'local') {
      return dbSearchItems(query);
    }
    return get().items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand?.toLowerCase().includes(query.toLowerCase()) ||
        item.notes?.toLowerCase().includes(query.toLowerCase())
    );
  },

  resetToDefault: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      resetDB();
      set({ items: getItems() });
    }
  },

  refresh: async () => {
    const mode = useAuthStore.getState().mode;

    if (mode === 'local') {
      set({ items: getItems() });
    } else {
      await get().fetchItems();
    }
  },
}));
