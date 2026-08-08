import { Package, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => navigate('/items/new')}
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl text-white shadow-soft hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Package size={24} />
        </div>
        <div className="text-left">
          <div className="font-bold text-base">添加物品</div>
          <div className="text-xs text-white/80">记录你的新宝贝</div>
        </div>
      </button>

      <button
        onClick={() => navigate('/wishes/new')}
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl text-white shadow-soft hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Heart size={24} />
        </div>
        <div className="text-left">
          <div className="font-bold text-base">添加心愿</div>
          <div className="text-xs text-white/80">许下新的愿望</div>
        </div>
      </button>
    </div>
  );
}
