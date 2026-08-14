import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Download, Upload, RotateCcw, ChevronRight, Database, Cloud, LogOut, User } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useItemStore } from '@/store/useItemStore';
import { useWishStore } from '@/store/useWishStore';
import { useAuthStore } from '@/store/useAuthStore';
import { exportToJSON, setToStorage } from '@/utils/storage';
import { exportDB, importDB } from '@/utils/db';

export default function Settings() {
  const navigate = useNavigate();
  const { settings, setTheme } = useSettingsStore();
  const { items, resetToDefault: resetItems } = useItemStore();
  const { wishes, resetToDefault: resetWishes } = useWishStore();
  const { user, mode, logout, setMode } = useAuthStore();
  const [showAbout, setShowAbout] = useState(false);

  const handleReset = async () => {
    if (confirm('确定要恢复默认示例数据吗？当前所有数据将被替换。')) {
      await resetItems();
      await resetWishes();
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？退出后将切换到本地模式。')) {
      logout();
      window.location.reload();
    }
  };

  const handleSwitchToLocal = () => {
    if (confirm('确定要切换到本地模式吗？本地数据不会与云端同步。')) {
      setMode('local');
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = {
      items,
      wishes,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    exportToJSON(data, `备份_${new Date().toLocaleDateString()}.json`);
  };

  const handleExportDB = () => {
    const data = exportDB();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `数据库_${new Date().toLocaleDateString()}.db`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDB = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.db,.sqlite,.sqlite3';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          if (confirm('确定要导入数据库文件吗？这将覆盖现有所有数据。')) {
            importDB(data);
            window.location.reload();
          }
        } catch {
          alert('数据库文件格式错误，请检查文件');
        }
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.items && confirm(`确定要导入 ${data.items.length} 个物品和 ${data.wishes?.length || 0} 个心愿吗？这将覆盖现有数据。`)) {
            setToStorage('wuxi-items', data.items);
            if (data.wishes) {
              setToStorage('wuxi-wishes', data.wishes);
            }
            if (data.settings) {
              setToStorage('wuxi-settings', data.settings);
            }
            window.location.reload();
          }
        } catch {
          alert('文件格式错误，请检查文件');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const SettingRow = ({ icon, label, value, onClick }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-white dark:bg-ink-800 hover:bg-cream-50 dark:hover:bg-ink-700 transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b border-cream-100 dark:border-ink-700/50 last:border-0"
    >
      <div className="w-9 h-9 bg-cream-100 dark:bg-ink-700 rounded-lg flex items-center justify-center text-ink-600 dark:text-ink-300 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-ink-800 dark:text-cream-100">{label}</p>
      </div>
      {value && (
        <span className="text-sm text-ink-500 dark:text-ink-400">{value}</span>
      )}
      <ChevronRight size={18} className="text-ink-300 dark:text-ink-600 flex-shrink-0" />
    </button>
  );

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-ink-900 pb-20">
      <div className="safe-top px-4 pt-4">
        <p className="text-sm text-ink-400 dark:text-ink-500">个人中心</p>
        <h1 className="text-xl font-bold text-ink-800 dark:text-cream-100 mt-0.5">我的</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-cream-100 dark:bg-ink-700 rounded-full flex items-center justify-center text-3xl">
              {mode === 'cloud' && user ? '👤' : '🌿'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink-800 dark:text-cream-100">
                {mode === 'cloud' && user ? user.nickname : '用心记录'}
              </h2>
              <p className="text-sm text-ink-400 dark:text-ink-500 mt-0.5">
                {mode === 'cloud' ? `已登录 · ${user.username}` : '本地模式 · 珍惜每一件好物'}
              </p>
            </div>
            {mode === 'cloud' ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-cream-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300 rounded-lg"
              >
                退出
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 text-sm bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 rounded-lg"
              >
                登录
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-cream-100 dark:border-ink-700">
            <div className="text-center">
              <p className="text-xl font-bold text-ink-800 dark:text-cream-100">{items.length}</p>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">件好物</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-ink-800 dark:text-cream-100">{wishes.filter(w => !w.achieved).length}</p>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">个心愿</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-ink-800 dark:text-cream-100">
                {wishes.filter(w => w.achieved).length}
              </p>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">已达成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-2 px-1">外观</p>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <SettingRow
            icon={<Moon size={18} />}
            label="深色模式"
            value={settings.theme === 'dark' ? '开启' : settings.theme === 'light' ? '关闭' : '跟随系统'}
            onClick={() => {
              const nextTheme = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'auto' : 'light';
              setTheme(nextTheme);
            }}
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-2 px-1">数据</p>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <SettingRow
            icon={<Download size={18} />}
            label="导出数据"
            value="JSON备份"
            onClick={handleExport}
          />
          <SettingRow
            icon={<Upload size={18} />}
            label="导入数据"
            value="从备份恢复"
            onClick={handleImport}
          />
          <SettingRow
            icon={<Database size={18} />}
            label="导出数据库"
            value=".db文件"
            onClick={handleExportDB}
          />
          <SettingRow
            icon={<Database size={18} />}
            label="导入数据库"
            value=".db文件"
            onClick={handleImportDB}
          />
          <SettingRow
            icon={<RotateCcw size={18} />}
            label="恢复默认示例"
            value="重新加载"
            onClick={handleReset}
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-2 px-1">云同步</p>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          {mode === 'local' ? (
            <SettingRow
              icon={<Cloud size={18} />}
              label="开启云同步"
              value="多设备数据同步"
              onClick={() => navigate('/login')}
            />
          ) : (
            <>
              <SettingRow
                icon={<User size={18} />}
                label="账号信息"
                value={user?.username}
              />
              <SettingRow
                icon={<LogOut size={18} />}
                label="退出登录"
                onClick={handleLogout}
              />
              <SettingRow
                icon={<Database size={18} />}
                label="切换到本地模式"
                value="仅本地存储"
                onClick={handleSwitchToLocal}
              />
            </>
          )}
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-2 px-1">关于</p>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <SettingRow
            icon={<span className="text-base">🌿</span>}
            label="关于应用"
            value="v1.0.0"
            onClick={() => setShowAbout(true)}
          />
        </div>
      </div>

      <div className="text-center mt-8 mb-4">
        <p className="text-xs text-ink-400 dark:text-ink-500">
          记录每一件好物，珍惜每一分花费
        </p>
      </div>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-ink-800 dark:bg-cream-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🌿
              </div>
              <h3 className="text-lg font-bold text-ink-800 dark:text-cream-100">好物记录</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">版本 1.0.0</p>
            </div>
            <div className="mt-5 space-y-2 text-sm text-ink-600 dark:text-ink-300">
              <p>一款个人物品价值管理与心愿清单应用。</p>
              <p>帮助你追踪每一件物品的真实使用成本，</p>
              <p>让每一分钱花得明明白白。</p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full h-11 mt-6 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium rounded-full"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
