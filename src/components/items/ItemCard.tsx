import { useNavigate } from 'react-router-dom';
import type { Item } from '@/types';
import { statusConfig } from '@/data/categories';
import { ownerConfig } from '@/data/owners';
import { calculateDailyCost } from '@/utils/calculation';
import { daysBetween } from '@/utils/date';
import { getEmojiForItem } from '@/utils/emoji';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[item.status];
  const dailyCost = calculateDailyCost(item);
  const daysUsed = daysBetween(item.purchaseDate);
  const emoji = getEmojiForItem(item.name);

  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      className="bg-white dark:bg-ink-800 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl">{emoji}</div>
        <div className="flex items-center gap-1.5">
          {item.owner && (
            <span className="text-xs">{ownerConfig[item.owner].emoji}</span>
          )}
          <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
          <span className="text-xs text-ink-400 dark:text-ink-500">{status.label}</span>
        </div>
      </div>
      <h3 className="mt-3 text-sm font-medium text-ink-800 dark:text-cream-100 truncate">
        {item.name}
      </h3>
      {item.brand && (
        <p className="mt-1 text-xs text-ink-400 dark:text-ink-500 truncate">
          {item.brand}
        </p>
      )}
      <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-400 dark:text-ink-500">
        <span>¥{item.price.toFixed(2)}</span>
        <span>·</span>
        <span>{daysUsed}天</span>
      </div>
      <div className="mt-3 pt-3 border-t border-cream-200 dark:border-ink-700">
        <p className="text-lg font-semibold text-ink-800 dark:text-cream-100">
          ¥{dailyCost.toFixed(2)}
          <span className="text-xs font-normal text-ink-400 dark:text-ink-500">/天</span>
        </p>
      </div>
    </div>
  );
}
