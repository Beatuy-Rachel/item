import { useNavigate } from 'react-router-dom';
import { useItemStore } from '@/store/useItemStore';
import { useWishStore } from '@/store/useWishStore';
import ItemCard from '@/components/items/ItemCard';
import { calculateDailyCost } from '@/utils/calculation';
import { getGreeting } from '@/utils/date';

export default function Dashboard() {
  const navigate = useNavigate();
  const { items } = useItemStore();
  const { wishes, getActiveWishes } = useWishStore();

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const activeWishes = getActiveWishes();
  
  const avgDailyCost = items.length > 0
    ? items.reduce((sum, item) => sum + calculateDailyCost(item), 0) / items.length
    : 0;

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleAdd = () => {
    navigate('/items/new');
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pb-24">
      <div className="safe-top px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">有数</h1>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6">
          <div className="text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">累计拥有</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
              ¥{totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              {items.length} 件物品 · 日均 ¥{avgDailyCost.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{items.length}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">物品</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{activeWishes.length}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">心愿</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {wishes.filter(w => w.achieved).length}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">已达成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">最近添加</h2>
          <button
            onClick={() => navigate('/items')}
            className="text-sm text-neutral-500 dark:text-neutral-400"
          >
            查看全部
          </button>
        </div>
        
        {recentItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 text-center">
            <p className="text-neutral-400 dark:text-neutral-500">还没有物品</p>
          </div>
        )}
      </div>

      {activeWishes.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">心愿进度</h2>
            <button
              onClick={() => navigate('/wishes')}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              查看全部
            </button>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 space-y-4">
            {activeWishes.slice(0, 2).map((wish) => (
              <div key={wish.id} className="flex items-center gap-3">
                <div className="text-2xl">💫</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{wish.name}</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex-shrink-0">
                      {((wish.currentSaved / wish.targetPrice) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                      style={{ width: `${(wish.currentSaved / wish.targetPrice) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
