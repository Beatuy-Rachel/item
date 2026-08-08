import type { ItemOwner } from '@/types';

export const ownerConfig: Record<ItemOwner, { label: string; emoji: string }> = {
  me: { label: '大美女', emoji: '👧' },
  him: { label: '大帅哥', emoji: '👦' },
  both: { label: '共用', emoji: '🏠' },
};

export const ownerList: { id: ItemOwner; label: string; emoji: string }[] = [
  { id: 'me', label: '大美女', emoji: '👧' },
  { id: 'him', label: '大帅哥', emoji: '👦' },
  { id: 'both', label: '共用', emoji: '🏠' },
];
