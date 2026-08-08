import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useWishStore } from '@/store/useWishStore';
import EmptyState from '@/components/common/EmptyState';
import { priorityConfig } from '@/data/categories';
import type { WishPriority } from '@/types';
import { calculateWishProgress } from '@/utils/calculation';
import { getEmojiForItem } from '@/utils/emoji';

export default function Wishes() {
  const navigate = useNavigate();
  const { wishes, addSavings, getActiveWishes, getAchievedWishes } = useWishStore();
  const [activeTab, setActiveTab] = useState<'active' | 'achieved'>('active');
  const [filterPriority, setFilterPriority] = useState<WishPriority | 'all'>('all');

  const activeWishes = getActiveWishes();
  const achievedWishes = getAchievedWishes();
  
  const displayedWishes = activeTab === 'active' 
    ? (filterPriority === 'all' 
        ? activeWishes 
        : activeWishes.filter(w => w.priority === filterPriority))
    : achievedWishes;

  const handleAddSavings = (id: string) => {
    const amount = prompt('输入存入金额', '100');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      addSavings(id, Number(amount));
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-20">
      <div className="safe-top sticky top-0 z-40 bg-cream-100 dark:bg-ink-900">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-ink-400 dark:text-ink-500">心愿清单</p>
              <p className="text-3xl font-bold text-ink-800 dark:text-cream-100 mt-1.5 tracking-tight">
                {activeWishes.length}
                <span className="text-lg font-normal text-ink-500 dark:text-ink-400 ml-1">个进行中</span>
              </p>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                已达成 <span className="font-medium text-ink-700 dark:text-ink-300">{achievedWishes.length}</span> 个
              </p>
            </div>
            <button
              onClick={() => navigate('/wishes/new')}
              className="flex items-center gap-1.5 px-4 h-11 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 rounded-2xl active:scale-95 transition-transform shadow-sm"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="text-sm font-medium">添加</span>
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white dark:bg-ink-800 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                activeTab === 'active'
                  ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium shadow-sm'
                  : 'text-ink-500 dark:text-ink-400'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setActiveTab('achieved')}
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                activeTab === 'achieved'
                  ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium'
                  : 'text-ink-500 dark:text-ink-400'
              }`}
            >
              已达成
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2">
        {displayedWishes.length > 0 ? (
          <div className="space-y-3">
            {displayedWishes.map((wish) => {
              const progress = calculateWishProgress(wish);
              const emoji = getEmojiForItem(wish.name);
              
              return (
                <div
                  key={wish.id}
                  className="bg-white dark:bg-ink-800 rounded-2xl p-4 cursor-pointer active:scale-[0.99] transition-transform shadow-sm"
                  onClick={() => navigate(`/wishes/${wish.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cream-100 dark:bg-ink-700 rounded-xl flex items-center justify-center text-2xl">
                      {wish.achieved ? '🎉' : emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-ink-800 dark:text-cream-100 truncate">
                          {wish.name}
                        </h3>
                        {!wish.achieved && (
                          <span className="text-xs text-ink-500 dark:text-ink-400 flex-shrink-0 ml-2">
                            {progress.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-ink-400 dark:text-ink-500">
                        <span>¥{wish.targetPrice.toLocaleString()}</span>
                        {!wish.achieved && (
                          <>
                            <span>·</span>
                            <span>还差 ¥{(wish.targetPrice - wish.currentSaved).toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {!wish.achieved && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSavings(wish.id);
                        }}
                        className="w-10 h-10 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                      >
                        <span className="text-xl font-bold leading-none">+</span>
                      </button>
                    )}
                  </div>
                  
                  {!wish.achieved && (
                    <div className="mt-3 h-1.5 bg-cream-200 dark:bg-ink-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink-800 dark:bg-cream-100 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<span className="text-4xl">💫</span>}
            title={activeTab === 'active' ? '还没有心愿' : '还没有达成的心愿'}
            description={activeTab === 'active' 
              ? '许下你的第一个心愿，为之努力吧~' 
              : '加油存钱，实现你的第一个心愿！'}
            action={activeTab === 'active' ? {
              label: '添加心愿',
              onClick: () => navigate('/wishes/new'),
            } : undefined}
          />
        )}
      </div>
    </div>
  );
}
