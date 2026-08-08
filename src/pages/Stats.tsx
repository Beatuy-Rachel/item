import { useMemo, useState } from 'react';
import { useItemStore } from '@/store/useItemStore';
import { categories } from '@/data/categories';
import { calculateDailyCost, getCategoryStats, getMonthlyStats, getYearlyStats, getItemsSortedByDailyCost, getLastYears } from '@/utils/calculation';
import { getLast6Months } from '@/utils/date';
import { getEmojiForItem } from '@/utils/emoji';

export default function Stats() {
  const { items } = useItemStore();
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');

  const categoryStats = useMemo(() => getCategoryStats(items), [items]);
  
  const monthlyStats = useMemo(() => {
    const raw = getMonthlyStats(items);
    const last6Months = getLast6Months();
    return last6Months.map((month) => {
      const found = raw.find((r) => r.month === month);
      return { label: month.split('-')[1] + '月', value: found?.value || 0 };
    });
  }, [items]);

  const yearlyStats = useMemo(() => {
    const raw = getYearlyStats(items);
    const last3Years = getLastYears(3);
    return last3Years.map((year) => {
      const found = raw.find((r) => r.year === year);
      return { label: year + '年', value: found?.value || 0 };
    });
  }, [items]);

  const displayStats = timeRange === 'month' ? monthlyStats : yearlyStats;
  const maxValue = Math.max(...displayStats.map((m) => m.value), 1);
  
  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const avgDaily = totalValue > 0 ? totalValue / 365 : 0;
  const totalCurrentYear = yearlyStats.find(y => y.label === new Date().getFullYear() + '年')?.value || 0;
  const totalLast6Months = monthlyStats.reduce((s, m) => s + m.value, 0);

  const cheapest = items.length > 0 ? getItemsSortedByDailyCost(items, 'asc')[0] : null;
  const mostExpensive = items.length > 0 ? getItemsSortedByDailyCost(items, 'desc')[0] : null;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-20">
      <div className="safe-top px-4 pt-5">
        <p className="text-sm text-ink-400 dark:text-ink-500">数据趋势</p>
        <h1 className="text-3xl font-bold text-ink-800 dark:text-cream-100 mt-1.5 tracking-tight">消费分析</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-ink-400 dark:text-ink-500">累计消费</p>
            <p className="text-4xl font-bold text-ink-800 dark:text-cream-100 mt-2 tracking-tight">
              ¥{totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-ink-400 dark:text-ink-500 mt-1">
              {items.length} 件物品 · 日均 ¥{avgDaily.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-cream-100 dark:border-ink-700">
            <div className="text-center">
              <p className="text-xs text-ink-400 dark:text-ink-500">近6个月</p>
              <p className="text-lg font-bold text-ink-800 dark:text-cream-100 mt-1">
                ¥{totalLast6Months.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-ink-400 dark:text-ink-500">今年已花</p>
              <p className="text-lg font-bold text-ink-800 dark:text-cream-100 mt-1">
                ¥{totalCurrentYear.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {displayStats.some((m) => m.value > 0) && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink-800 dark:text-cream-100">
                {timeRange === 'month' ? '月度消费' : '年度消费'}
              </h3>
              <div className="flex bg-cream-100 dark:bg-ink-700 rounded-full p-0.5">
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    timeRange === 'month'
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium'
                      : 'text-ink-500 dark:text-ink-400'
                  }`}
                >
                  月度
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    timeRange === 'year'
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium'
                      : 'text-ink-500 dark:text-ink-400'
                  }`}
                >
                  年度
                </button>
              </div>
            </div>
            <div className="flex items-end justify-between gap-3 h-32">
              {displayStats.map((item, index) => {
                const height = (item.value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-ink-800 dark:bg-cream-100 rounded-t-lg transition-all"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <span className="text-xs text-ink-400 dark:text-ink-500">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-ink-800 dark:text-cream-100 mb-4">分类占比</h3>
            <div className="space-y-4">
              {categoryStats.map((stat) => {
                const cat = categories.find((c) => c.id === stat.category);
                return (
                  <div key={stat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-600 dark:text-ink-300">
                        {cat?.icon} {cat?.name}
                      </span>
                      <span className="font-medium text-ink-800 dark:text-cream-100">
                        {stat.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-cream-200 dark:bg-ink-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink-800 dark:bg-cream-100 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      {stat.count} 件 · ¥{stat.value.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="px-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-ink-400 dark:text-ink-500">日均最高</p>
              {mostExpensive && (
                <>
                  <div className="text-2xl mt-2">{getEmojiForItem(mostExpensive.name)}</div>
                  <p className="font-medium text-ink-800 dark:text-cream-100 mt-1 truncate">
                    {mostExpensive.name}
                  </p>
                  <p className="text-xl font-bold text-ink-800 dark:text-cream-100 mt-1">
                    ¥{calculateDailyCost(mostExpensive).toFixed(2)}
                    <span className="text-xs font-normal text-ink-400 dark:text-ink-500">/天</span>
                  </p>
                </>
              )}
            </div>
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-ink-400 dark:text-ink-500">日均最低</p>
              {cheapest && (
                <>
                  <div className="text-2xl mt-2">{getEmojiForItem(cheapest.name)}</div>
                  <p className="font-medium text-ink-800 dark:text-cream-100 mt-1 truncate">
                    {cheapest.name}
                  </p>
                  <p className="text-xl font-bold text-ink-800 dark:text-cream-100 mt-1">
                    ¥{calculateDailyCost(cheapest).toFixed(2)}
                    <span className="text-xs font-normal text-ink-400 dark:text-ink-500">/天</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="px-4 mt-4 mb-8">
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-ink-800 dark:text-cream-100 mb-4">性价比排行</h3>
            <div className="space-y-3">
              {getItemsSortedByDailyCost(items, 'asc').slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold ${
                    index === 0 ? 'text-lg text-ink-800 dark:text-cream-100' : 
                    index === 1 ? 'text-base text-ink-700 dark:text-ink-200' : 
                    index === 2 ? 'text-base text-ink-600 dark:text-ink-300' : 'text-sm text-ink-500 dark:text-ink-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="text-lg">{getEmojiForItem(item.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 dark:text-cream-100 truncate">{item.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink-800 dark:text-cream-100">
                    ¥{calculateDailyCost(item).toFixed(2)}/天
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
