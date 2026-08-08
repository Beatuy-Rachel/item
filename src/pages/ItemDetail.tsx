import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useItemStore } from '@/store/useItemStore';
import { categories, statusConfig } from '@/data/categories';
import { ownerConfig } from '@/data/owners';
import { calculateDailyCost, calculateMonthlyCost } from '@/utils/calculation';
import { daysBetween, formatDate } from '@/utils/date';
import { getEmojiForItem } from '@/utils/emoji';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, deleteItem } = useItemStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const item = getItem(id || '');
  
  if (!item) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-ink-900 flex items-center justify-center">
        <p className="text-ink-500">物品不存在</p>
      </div>
    );
  }
  
  const category = categories.find((c) => c.id === item.category);
  const status = statusConfig[item.status];
  const dailyCost = calculateDailyCost(item);
  const monthlyCost = calculateMonthlyCost(item);
  const daysUsed = daysBetween(item.purchaseDate);
  const emoji = getEmojiForItem(item.name);

  const handleDelete = () => {
    deleteItem(item.id);
    navigate('/items');
  };

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
          <div className="w-10" />
        </div>
      </div>
      
      <div className="px-4">
        <div className="bg-white dark:bg-ink-800 rounded-3xl p-6 mt-2 shadow-sm">
          <div className="flex flex-col items-center text-center py-8">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-xl font-semibold text-ink-800 dark:text-cream-100">
              {item.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {category?.name}
              </span>
              <span className="text-cream-300 dark:text-ink-600">·</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                <span className="text-sm text-ink-500 dark:text-ink-400">
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-cream-100 dark:border-ink-700">
            <div className="text-center">
              <p className="text-sm text-ink-500 dark:text-ink-400">购买价格</p>
              <p className="text-xl font-bold text-ink-800 dark:text-cream-100 mt-1">
                ¥{item.price.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink-500 dark:text-ink-400">已使用</p>
              <p className="text-xl font-bold text-ink-800 dark:text-cream-100 mt-1">
                {daysUsed}天
              </p>
            </div>
          </div>
          
          <div className="py-6 text-center">
            <p className="text-sm text-ink-500 dark:text-ink-400">日均花费</p>
            <p className="text-4xl font-bold text-ink-800 dark:text-ink-500 mt-2">
              ¥{dailyCost.toFixed(2)}
            </p>
            <p className="text-sm text-ink-400 dark:text-ink-500 mt-1">
              月均 ¥{monthlyCost.toFixed(0)}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-ink-800 rounded-2xl mt-4 p-4 space-y-4 shadow-sm">
          {item.brand && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-ink-500 dark:text-ink-400">品牌</span>
              <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
                {item.brand}
              </span>
            </div>
          )}
          {item.owner && (
            <div className={`flex items-center justify-between py-2 ${item.brand ? 'border-t border-cream-50 dark:border-ink-700/50' : ''}`}>
              <span className="text-sm text-ink-500 dark:text-ink-400">所属人</span>
              <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
                {ownerConfig[item.owner].label} {ownerConfig[item.owner].emoji}
              </span>
            </div>
          )}
          {item.color && (
            <div className={`flex items-center justify-between py-2 ${item.brand || item.owner ? 'border-t border-cream-50 dark:border-ink-700/50' : ''}`}>
              <span className="text-sm text-ink-500 dark:text-ink-400">颜色/规格</span>
              <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
                {item.color}
              </span>
            </div>
          )}
          <div className={`flex items-center justify-between py-2 ${item.brand || item.owner || item.color ? 'border-t border-cream-50 dark:border-ink-700/50' : ''}`}>
            <span className="text-sm text-ink-500 dark:text-ink-400">购买日期</span>
            <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
              {formatDate(item.purchaseDate)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-cream-50 dark:border-ink-700/50">
            <span className="text-sm text-ink-500 dark:text-ink-400">使用状态</span>
            <span className="text-sm font-medium text-ink-800 dark:text-cream-100">
              {status.label}
            </span>
          </div>
        </div>
        
        {item.notes && (
          <div className="bg-white dark:bg-ink-800 rounded-2xl mt-4 p-4 shadow-sm">
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-2">备注</p>
            <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
              {item.notes}
            </p>
          </div>
        )}
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(`/items/${item.id}/edit`)}
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
              删除后无法恢复，确定要删除「{item.name}」吗？
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
    </div>
  );
}
