import { useNavigate } from 'react-router-dom';
import { Star, Target, Sparkles } from 'lucide-react';
import type { Wish } from '@/types';
import { priorityConfig } from '@/data/categories';
import { calculateWishProgress, formatCurrency } from '@/utils/calculation';

interface WishCardProps {
  wish: Wish;
  delay?: number;
  onAddSavings?: (id: string) => void;
}

export default function WishCard({ wish, delay = 0, onAddSavings }: WishCardProps) {
  const navigate = useNavigate();
  const priority = priorityConfig[wish.priority];
  const progress = calculateWishProgress(wish);
  const remaining = wish.targetPrice - wish.currentSaved;

  const handleAddSavings = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddSavings) {
      onAddSavings(wish.id);
    }
  };

  if (wish.achieved) {
    return (
      <div
        className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-2xl p-4 border border-accent-200 dark:border-accent-700 animate-slide-up cursor-pointer"
        style={{ animationDelay: `${delay}ms` }}
        onClick={() => navigate(`/wishes/${wish.id}`)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{wish.name}</h3>
            <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
              已达成 🎉
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer active:scale-[0.98] animate-slide-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/wishes/${wish.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl flex items-center justify-center text-2xl">
              💫
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{wish.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: priority.color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {priority.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddSavings}
            className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-xl flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">目标价格</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(wish.targetPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">还差</p>
              <p className="text-sm font-semibold text-primary-500">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse-soft" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              已存 {formatCurrency(wish.currentSaved)}
            </span>
            <span className="text-sm font-bold text-primary-500">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
