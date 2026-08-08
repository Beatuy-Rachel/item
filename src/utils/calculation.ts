import { daysBetween } from './date';
import type { Item, Wish } from '@/types';

export function calculateDailyCost(item: Item): number {
  const days = daysBetween(item.purchaseDate);
  return item.price / days;
}

export function calculateMonthlyCost(item: Item): number {
  return calculateDailyCost(item) * 30;
}

export function formatCurrency(amount: number, currency: string = '¥'): string {
  if (amount >= 10000) {
    return `${currency}${(amount / 10000).toFixed(1)}万`;
  }
  return `${currency}${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function formatPrice(price: number, currency: string = '¥'): string {
  return `${currency}${price.toFixed(2)}`;
}

export function calculateWishProgress(wish: Wish): number {
  if (wish.targetPrice === 0) return 0;
  return Math.min(100, (wish.currentSaved / wish.targetPrice) * 100);
}

export function getItemsSortedByDailyCost(items: Item[], order: 'asc' | 'desc' = 'desc'): Item[] {
  return [...items].sort((a, b) => {
    const costA = calculateDailyCost(a);
    const costB = calculateDailyCost(b);
    return order === 'desc' ? costB - costA : costA - costB;
  });
}

export function getCategoryStats(items: Item[]) {
  const stats: Record<string, { count: number; value: number }> = {};
  let totalValue = 0;
  
  items.forEach(item => {
    if (!stats[item.category]) {
      stats[item.category] = { count: 0, value: 0 };
    }
    stats[item.category].count++;
    stats[item.category].value += item.price;
    totalValue += item.price;
  });
  
  return Object.entries(stats).map(([category, data]) => ({
    category: category as any,
    count: data.count,
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
  }));
}

export function getMonthlyStats(items: Item[]) {
  const monthlyMap: Record<string, number> = {};
  
  items.forEach(item => {
    const monthKey = item.purchaseDate.substring(0, 7);
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + item.price;
  });
  
  return Object.entries(monthlyMap)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getYearlyStats(items: Item[]) {
  const yearlyMap: Record<string, number> = {};
  
  items.forEach(item => {
    const yearKey = item.purchaseDate.substring(0, 4);
    yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + item.price;
  });
  
  return Object.entries(yearlyMap)
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

export function getLastYears(count: number = 3): string[] {
  const years: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    years.push(String(now.getFullYear() - i));
  }
  return years;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
