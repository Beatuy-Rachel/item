export type Category = 'digital' | 'home' | 'clothing' | 'pet' | 'other';
export type ItemStatus = 'active' | 'idle' | 'sold';
export type WishPriority = 'high' | 'medium' | 'low';
export type ItemOwner = 'me' | 'him' | 'both';

export interface Item {
  id: string;
  name: string;
  brand?: string;
  color?: string;
  owner?: ItemOwner;
  category: Category;
  price: number;
  purchaseDate: string;
  image?: string;
  notes?: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Wish {
  id: string;
  name: string;
  targetPrice: number;
  currentSaved: number;
  priority: WishPriority;
  targetDate?: string;
  image?: string;
  notes?: string;
  achieved: boolean;
  achievedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryConfig {
  id: Category;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  dateFormat: string;
}

export interface ItemStats {
  totalItems: number;
  totalValue: number;
  thisMonthItems: number;
  dailyCostAvg: number;
}

export interface CategoryStat {
  category: Category;
  count: number;
  value: number;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  value: number;
}
