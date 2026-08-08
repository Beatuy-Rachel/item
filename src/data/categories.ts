import type { CategoryConfig } from '@/types';

export const categories: CategoryConfig[] = [
  {
    id: 'digital',
    name: '数码产品',
    icon: '📱',
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  {
    id: 'home',
    name: '家居生活',
    icon: '🏠',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    id: 'clothing',
    name: '服饰穿搭',
    icon: '👕',
    color: '#EC4899',
    bgColor: '#FCE7F3',
  },
  {
    id: 'pet',
    name: '萌宠用品',
    icon: '🐱',
    color: '#F97316',
    bgColor: '#FFEDD5',
  },
  {
    id: 'other',
    name: '其他物品',
    icon: '📦',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
];

export const priorityConfig = {
  high: {
    label: '高优先级',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
  medium: {
    label: '中优先级',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  low: {
    label: '低优先级',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
};

export const statusConfig = {
  active: { label: '使用中', color: '#5E8569', dotColor: 'bg-ink-600' },
  idle: { label: '闲置中', color: '#D97706', dotColor: 'bg-amber-500' },
  sold: { label: '已出手', color: '#6B7280', dotColor: 'bg-ink-400' },
};
