import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useItemStore } from '@/store/useItemStore';
import { categories, statusConfig } from '@/data/categories';
import { ownerList } from '@/data/owners';
import type { ItemOwner, ItemStatus, Category } from '@/types';
import { formatDateForInput } from '@/utils/date';

export default function NewItem() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem, updateItem, getItem } = useItemStore();
  const isEdit = !!id;
  const existingItem = isEdit ? getItem(id) : null;
  
  const [form, setForm] = useState({
    name: '',
    brand: '',
    color: '',
    price: '',
    category: 'digital' as Category,
    purchaseDate: formatDateForInput(new Date()),
    status: 'active' as ItemStatus,
    owner: undefined as ItemOwner | undefined,
    notes: '',
  });

  useEffect(() => {
    if (existingItem) {
      setForm({
        name: existingItem.name,
        brand: existingItem.brand || '',
        color: existingItem.color || '',
        price: String(existingItem.price),
        category: existingItem.category,
        purchaseDate: existingItem.purchaseDate,
        status: existingItem.status,
        owner: existingItem.owner,
        notes: existingItem.notes || '',
      });
    }
  }, [existingItem]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || !form.purchaseDate) {
      return;
    }
    if (isEdit && id) {
      updateItem(id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        color: form.color.trim(),
        price: parseFloat(form.price),
        category: form.category,
        purchaseDate: form.purchaseDate,
        status: form.status,
        owner: form.owner,
        notes: form.notes.trim(),
      });
    } else {
      addItem({
        name: form.name.trim(),
        brand: form.brand.trim(),
        color: form.color.trim(),
        price: parseFloat(form.price),
        category: form.category,
        purchaseDate: form.purchaseDate,
        status: form.status,
        owner: form.owner,
        notes: form.notes.trim(),
      });
    }
    navigate(-1);
  };

  const isDisabled = !form.name.trim() || !form.price || !form.purchaseDate;

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-32">
      <div className="safe-top sticky top-0 z-40 bg-cream-100 dark:bg-ink-900">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full -ml-2"
          >
            <ArrowLeft size={22} className="text-ink-700 dark:text-ink-300" />
          </button>
          <h1 className="text-base font-semibold text-ink-800 dark:text-cream-100">
            {isEdit ? '编辑物品' : '新建物品'}
          </h1>
          <div className="w-10" />
        </div>
      </div>
      
      <div className="px-4 mt-2">
        <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 space-y-5 shadow-sm">
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">物品名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="比如：iPhone 14 Pro"
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base"
              autoFocus={!isEdit}
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">品牌 (选填)</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="比如：Apple"
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base"
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">颜色/规格 (选填)</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="比如：深空灰 / 256GB"
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base"
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400 mb-2 block">所属人 (选填)</label>
            <div className="flex gap-2">
              {ownerList.map((owner) => (
                <button
                  key={owner.id}
                  onClick={() => setForm({ ...form, owner: form.owner === owner.id ? undefined : owner.id })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                    form.owner === owner.id
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                      : 'bg-cream-50 dark:bg-ink-700/50 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  {owner.label}{owner.emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">购买价格 (元)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base font-medium"
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400 mb-2 block">分类</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    form.category === cat.id
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                      : 'bg-cream-50 dark:bg-ink-700/50 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  <div className="text-2xl">{cat.icon}</div>
                  <div className="text-xs mt-1">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">购买日期</label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 outline-none text-base"
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400 mb-2 block">使用状态</label>
            <div className="flex gap-2">
              {(Object.keys(statusConfig) as ItemStatus[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, status: key })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                    form.status === key
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                      : 'bg-cream-50 dark:bg-ink-700/50 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  {statusConfig[key].label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">备注 (选填)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="记录一些关于这个物品的小故事..."
              rows={4}
              className="w-full mt-2 px-4 py-3 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base resize-none"
            />
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white dark:bg-ink-800 border-t border-cream-100 dark:border-ink-700 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full h-12 rounded-2xl font-medium transition-all ${
            isDisabled
              ? 'bg-cream-200 dark:bg-ink-700 text-ink-400 dark:text-ink-500'
              : 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 active:scale-[0.98]'
          }`}
        >
          {isEdit ? '保存修改' : '保存'}
        </button>
      </div>
    </div>
  );
}
