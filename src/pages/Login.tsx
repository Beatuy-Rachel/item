import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useItemStore } from '@/store/useItemStore';
import { useWishStore } from '@/store/useWishStore';

type Mode = 'login' | 'register';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const fetchItems = useItemStore((s) => s.fetchItems);
  const fetchWishes = useWishStore((s) => s.fetchWishes);

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.auth.login({ username, password });
        login(res.token, res.user);
        await Promise.all([fetchItems(), fetchWishes()]);
        navigate('/settings');
      } else {
        const res = await api.auth.register({ username, password, nickname });
        login(res.token, res.user);
        await Promise.all([fetchItems(), fetchWishes()]);
        navigate('/settings');
      }
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900">
      <div className="safe-top px-4 pt-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-ink-600 dark:text-ink-300"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-ink-800 dark:text-cream-100 ml-2">
          {mode === 'login' ? '登录' : '注册'}
        </h1>
      </div>

      <div className="px-6 pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-ink-800 dark:bg-cream-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
            🌿
          </div>
          <h2 className="text-xl font-bold text-ink-800 dark:text-cream-100">
            {mode === 'login' ? '欢迎回来' : '创建新账号'}
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            {mode === 'login' ? '登录后可同步多设备数据' : '注册账号开启云同步'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full h-12 px-4 bg-white dark:bg-ink-800 border border-cream-200 dark:border-ink-700 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 focus:outline-none focus:border-forest-500"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入昵称（选填）"
                className="w-full h-12 px-4 bg-white dark:bg-ink-800 border border-cream-200 dark:border-ink-700 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 focus:outline-none focus:border-forest-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full h-12 px-4 pr-12 bg-white dark:bg-ink-800 border border-cream-200 dark:border-ink-700 rounded-xl text-ink-800 dark:text-cream-100 placeholder-ink-400 focus:outline-none focus:border-forest-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium rounded-xl disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-sm text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-cream-100"
          >
            {mode === 'login' ? '还没有账号？立即注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
