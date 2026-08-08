import { create } from 'zustand';
import type { Item, Category } from '@/types';
import { getItems, addItem as dbAddItem, updateItem as dbUpdateItem, deleteItem as dbDeleteItem, searchItems as dbSearchItems, resetDB, initDB } from '@/utils/db';

interface ItemState {
  items: Item[];
  isLoading: boolean;
  init: () => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Item['status'] }) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  getItemsByCategory: (category: Category) => Item[];
  searchItems: (query: string) => Item[];
  resetToDefault: () => void;
  refresh: () => void;
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  isLoading: true,

  init: async () => {
    await initDB();
    set({ items: getItems(), isLoading: false });
  },

  addItem: (item) => {
    dbAddItem(item);
    set({ items: getItems() });
  },

  updateItem: (id, updates) => {
    dbUpdateItem(id, updates);
    set({ items: getItems() });
  },

  deleteItem: (id) => {
    dbDeleteItem(id);
    set({ items: getItems() });
  },

  getItem: (id) => {
    return get().items.find((item) => item.id === id);
  },

  getItemsByCategory: (category) => {
    return get().items.filter((item) => item.category === category);
  },

  searchItems: (query) => {
    return dbSearchItems(query);
  },

  resetToDefault: () => {
    resetDB();
    set({ items: getItems() });
  },

  refresh: () => {
    set({ items: getItems() });
  },
}));
