import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useItemStore } from '@/store/useItemStore';
import ItemCard from '@/components/items/ItemCard';
import EmptyState from '@/components/common/EmptyState';
import { categories } from '@/data/categories';
import { ownerList } from '@/data/owners';
import type { Category, ItemStatus, ItemOwner } from '@/types';

export default function Items() {
  const navigate = useNavigate();
  const { items, searchItems } = useItemStore();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<'all' | ItemStatus>('all');
  const [activeOwner, setActiveOwner] = useState<'all' | ItemOwner>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    items.forEach((item) => {
      years.add(item.purchaseDate.substring(0, 4));
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [items]);

  const hasActiveFilter = selectedYear !== 'all' || dateFrom || dateTo;

  const filteredItems = (() => {
    let result = items;
    
    if (searchQuery) {
      result = searchItems(searchQuery);
    }
    
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }
    
    if (activeStatus !== 'all') {
      result = result.filter((item) => item.status === activeStatus);
    }
    
    if (activeOwner !== 'all') {
      result = result.filter((item) => item.owner === activeOwner);
    }

    if (selectedYear !== 'all') {
      result = result.filter((item) => item.purchaseDate.startsWith(selectedYear));
    }

    if (dateFrom) {
      result = result.filter((item) => item.purchaseDate >= dateFrom);
    }

    if (dateTo) {
      result = result.filter((item) => item.purchaseDate <= dateTo);
    }
    
    return result.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  })();

  const resetDateFilter = () => {
    setSelectedYear('all');
    setDateFrom('');
    setDateTo('');
  };

  const statusTabs: { key: 'all' | ItemStatus; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'active', label: '使用中' },
    { key: 'idle', label: '闲置中' },
    { key: 'sold', label: '已出手' },
  ];

  const totalValue = filteredItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-20">
      <div className="safe-top sticky top-0 z-40 bg-cream-100 dark:bg-ink-900">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-ink-400 dark:text-ink-500">我的好物</p>
              <p className="text-3xl font-bold text-ink-800 dark:text-cream-100 mt-1.5 tracking-tight">
                ¥{totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                共 <span className="font-medium text-ink-700 dark:text-ink-300">{items.length}</span> 件物品
              </p>
            </div>
            <button
              onClick={() => navigate('/items/new')}
              className="flex items-center gap-1.5 px-4 h-11 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 rounded-2xl active:scale-95 transition-transform shadow-sm"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="text-sm font-medium">添加</span>
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 bg-white dark:bg-ink-800 rounded-full px-4 py-2.5 shadow-sm flex-1">
              <Search size={18} className="text-ink-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索物品..."
                className="flex-1 bg-transparent text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center justify-center w-11 h-11 rounded-full shadow-sm transition-all ${
                hasActiveFilter || showFilter
                  ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                  : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-400'
              }`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  activeStatus === tab.key
                    ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium shadow-sm'
                    : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveOwner('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                activeOwner === 'all'
                  ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium shadow-sm'
                  : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-400'
              }`}
            >
              全部
            </button>
            {ownerList.map((owner) => (
              <button
                key={owner.id}
                onClick={() => setActiveOwner(owner.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  activeOwner === owner.id
                    ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium shadow-sm'
                    : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-400'
                }`}
              >
                {owner.label}
              </button>
            ))}
          </div>
        </div>

        {showFilter && (
          <div className="px-4 pb-4">
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink-800 dark:text-cream-100 text-sm">购买时间</h3>
                {hasActiveFilter && (
                  <button
                    onClick={resetDateFilter}
                    className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1"
                  >
                    <X size={12} />
                    重置
                  </button>
                )}
              </div>
              
              <div>
                <p className="text-xs text-ink-500 dark:text-ink-400 mb-2">按年份</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      selectedYear === 'all'
                        ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium'
                        : 'bg-cream-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300'
                    }`}
                  >
                    全部
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedYear === year
                          ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium'
                          : 'bg-cream-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300'
                      }`}
                    >
                      {year}年
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-500 dark:text-ink-400 mb-2">按日期范围</p>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 bg-cream-100 dark:bg-ink-700 text-ink-800 dark:text-cream-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                  <span className="text-ink-400 text-sm">至</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 bg-cream-100 dark:bg-ink-700 text-ink-800 dark:text-cream-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={40} />}
            title="还没有物品"
            description="记录你的每一件好物，看看它们值不值~"
            action={{
              label: '添加第一件',
              onClick: () => navigate('/items/new'),
            }}
          />
        )}
      </div>
    </div>
  );
}
