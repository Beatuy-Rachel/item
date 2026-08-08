import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useWishStore } from '@/store/useWishStore';
import { priorityConfig } from '@/data/categories';
import { calculateWishProgress } from '@/utils/calculation';
import { formatDate } from '@/utils/date';
import { getEmojiForItem } from '@/utils/emoji';

export default function WishDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWish, deleteWish, addSavings, markAchieved } = useWishStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('');
  
  const wish = getWish(id || '');
  
  if (!wish) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-ink-900 flex items-center justify-center">
        <p className="text-ink-500">心愿不存在</p>
      </div>
    );
  }
  
  const priority = priorityConfig[wish.priority];
  const emoji = getEmojiForItem(wish.name);
  const progress = calculateWishProgress(wish);
  const remaining = wish.targetPrice - wish.currentSaved;

  const handleDelete = () => {
    deleteWish(wish.id);
    navigate('/wishes');
  };

  const handleAddSavings = () => {
    const amount = Number(savingsAmount);
    if (amount > 0) {
      addSavings(wish.id, amount);
      setShowSavingsModal(false);
      setSavingsAmount('');
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-8">
      <div className="safe-top sticky top-0 z-40 bg-cream-100 dark:bg-ink-900">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full -ml-2"
          >
            <ArrowLeft size={22} className="text-ink-700 dark:text-ink-300" />
          </button>
          <h1 className="text-base font-semibold text-ink-800 dark:text-cream-100">
            心愿详情
          </h1>
          <div className="w-10" />
        </div>
      </div>
      
      <div className="px-4 mt-2">
        <div className="bg-white dark:bg-ink-800 rounded-3xl p-6">
          <div className="flex flex-col items-center text-center py-6">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-xl font-semibold text-ink-800 dark:text-cream-100">
              {wish.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {priority.label}
              </span>
              {wish.achieved && (
                <>
                  <span className="text-ink-300 dark:text-ink-600">·</span>
                  <span className="text-sm text-ink-800 dark:text-cream-100 font-medium">
                    已达成
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="py-6 border-t border-b border-cream-100 dark:border-ink-700">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-ink-500 dark:text-ink-400">目标价格</p>
                <p className="text-2xl font-bold text-ink-800 dark:text-cream-100 mt-1">
                  ¥{wish.targetPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ink-500 dark:text-ink-400">还差</p>
                <p className="text-lg font-bold text-ink-800 dark:text-cream-100 mt-1">
                  ¥{remaining.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-4 h-2 bg-cream-100 dark:bg-ink-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-ink-800 dark:bg-cream-100 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-ink-500 dark:text-ink-400">
                已存 ¥{wish.currentSaved.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-ink-800 dark:text-cream-100">
                {progress.toFixed(1)}%
              </span>
            </div>
          </div>
          
          {!wish.achieved && (
            <button
              onClick={() => setShowSavingsModal(true)}
              className="w-full h-11 mt-6 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium rounded-2xl active:scale-[0.98] transition-transform"
            >
              存入一笔
            </button>
          )}
        </div>
        
        <div className="bg-white dark:bg-ink-800 rounded-2xl mt-4 p-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-ink-500 dark:text-ink-400">优先级</span>
            <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
              {priority.label}
            </span>
          </div>
          {wish.targetDate && (
            <div className="flex items-center justify-between py-2 border-t border-cream-50 dark:border-ink-700/50">
              <span className="text-sm text-ink-500 dark:text-ink-400">目标日期</span>
              <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
                {formatDate(wish.targetDate)}
              </span>
            </div>
          )}
          {wish.achieved && wish.achievedAt && (
            <div className="flex items-center justify-between py-2 border-t border-cream-50 dark:border-ink-700/50">
              <span className="text-sm text-ink-500 dark:text-ink-400">达成时间</span>
              <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
                {formatDate(wish.achievedAt)}
              </span>
            </div>
          )}
        </div>
        
        {wish.notes && (
          <div className="bg-white dark:bg-ink-800 rounded-2xl mt-4 p-4">
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-2">为什么想要</p>
            <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
              {wish.notes}
            </p>
          </div>
        )}
        
        {!wish.achieved && (
          <button
            onClick={() => {
              if (confirm('确定标记为已达成吗？')) {
                markAchieved(wish.id);
              }
            }}
            className="w-full h-12 mt-6 bg-white dark:bg-ink-800 text-ink-800 dark:text-cream-100 font-medium rounded-2xl border border-cream-200 dark:border-ink-700 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Check size={18} />
            我已经买到啦！
          </button>
        )}
        
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => navigate(`/wishes/${wish.id}/edit`)}
            className="flex-1 h-12 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 font-medium rounded-2xl border border-cream-200 dark:border-ink-700 active:scale-[0.98] transition-transform"
          >
            编辑
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 font-medium rounded-2xl active:scale-[0.98] transition-transform"
          >
            删除
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-ink-800 dark:text-cream-100 text-center">
              确认删除
            </h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 text-center mt-2">
              删除后无法恢复，确定要删除「{wish.name}」这个心愿吗？
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 bg-cream-100 dark:bg-ink-700 text-ink-700 dark:text-ink-200 font-medium rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-11 bg-red-500 text-white font-medium rounded-full"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {showSavingsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="bg-white dark:bg-ink-800 rounded-t-3xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-ink-800 dark:text-cream-100 text-center">
              存入一笔
            </h3>
            
            <div className="mt-5">
              <input
                type="number"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full h-14 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-2xl font-bold text-center text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none"
              />
              
              <div className="grid grid-cols-4 gap-2 mt-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSavingsAmount(String(amount))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      savingsAmount === String(amount)
                        ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                        : 'bg-cream-100 dark:bg-ink-700/50 text-ink-600 dark:text-ink-300'
                    }`}
                  >
                    ¥{amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSavingsModal(false)}
                className="flex-1 h-12 bg-cream-100 dark:bg-ink-700 text-ink-700 dark:text-ink-200 font-medium rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleAddSavings}
                disabled={!savingsAmount || Number(savingsAmount) <= 0}
                className="flex-1 h-12 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium rounded-full disabled:opacity-50"
              >
                确认存入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
