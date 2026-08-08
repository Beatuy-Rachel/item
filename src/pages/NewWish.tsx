import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWishStore } from '@/store/useWishStore';
import { priorityConfig } from '@/data/categories';
import type { WishPriority } from '@/types';

export default function NewWish() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addWish, updateWish, getWish } = useWishStore();
  const isEdit = !!id;
  const existingWish = isEdit ? getWish(id) : null;

  const [form, setForm] = useState({
    name: '',
    targetPrice: '',
    currentSaved: '',
    priority: 'medium' as WishPriority,
    targetDate: '',
    notes: '',
  });

  useEffect(() => {
    if (existingWish) {
      setForm({
        name: existingWish.name,
        targetPrice: String(existingWish.targetPrice),
        currentSaved: String(existingWish.currentSaved),
        priority: existingWish.priority,
        targetDate: existingWish.targetDate || '',
        notes: existingWish.notes || '',
      });
    }
  }, [existingWish]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.targetPrice) {
      return;
    }
    if (isEdit && id) {
      updateWish(id, {
        name: form.name.trim(),
        targetPrice: parseFloat(form.targetPrice),
        currentSaved: form.currentSaved ? parseFloat(form.currentSaved) : 0,
        priority: form.priority,
        targetDate: form.targetDate || undefined,
        notes: form.notes.trim(),
      });
    } else {
      addWish({
        name: form.name.trim(),
        targetPrice: parseFloat(form.targetPrice),
        currentSaved: form.currentSaved ? parseFloat(form.currentSaved) : 0,
        priority: form.priority,
        targetDate: form.targetDate || undefined,
        notes: form.notes.trim(),
      });
    }
    navigate(-1);
  };

  const isDisabled = !form.name.trim() || !form.targetPrice;

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
            {isEdit ? '编辑心愿' : '新建心愿'}
          </h1>
          <div className="w-10" />
        </div>
      </div>
      
      <div className="px-4 mt-2">
        <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 space-y-5">
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">心愿名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="比如：新款相机"
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base"
              autoFocus={!isEdit}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-ink-500 dark:text-ink-400">目标价格 (元)</label>
              <input
                type="number"
                value={form.targetPrice}
                onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                placeholder="0.00"
                className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base font-medium"
              />
            </div>
            <div>
              <label className="text-sm text-ink-500 dark:text-ink-400">已存金额 (元)</label>
              <input
                type="number"
                value={form.currentSaved}
                onChange={(e) => setForm({ ...form, currentSaved: e.target.value })}
                placeholder="0.00"
                className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 outline-none text-base font-medium"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400 mb-2 block">优先级</label>
            <div className="flex gap-2">
              {(Object.keys(priorityConfig) as WishPriority[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, priority: key })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                    form.priority === key
                      ? 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800'
                      : 'bg-cream-50 dark:bg-ink-700/50 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  {priorityConfig[key].label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">目标日期 (选填)</label>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="w-full mt-2 px-4 h-12 bg-cream-50 dark:bg-ink-700/50 rounded-xl text-ink-800 dark:text-cream-100 outline-none text-base"
            />
          </div>
          
          <div>
            <label className="text-sm text-ink-500 dark:text-ink-400">为什么想要 (选填)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="写下你想要它的理由，给自己一些动力..."
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
          className={`w-full h-12 rounded-2xl font-medium transition-colors ${
            isDisabled
              ? 'bg-cream-200 dark:bg-ink-700 text-ink-400 dark:text-ink-500'
              : 'bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 active:scale-[0.98]'
          }`}
        >
          {isEdit ? '保存修改' : '保存心愿'}
        </button>
      </div>
    </div>
  );
}
