import { NavLink } from 'react-router-dom';
import { Package, Heart, BarChart3, User } from 'lucide-react';

const navItems = [
  { path: '/items', icon: Package, label: '好物' },
  { path: '/wishes', icon: Heart, label: '心愿' },
  { path: '/stats', icon: BarChart3, label: '趋势' },
  { path: '/settings', icon: User, label: '我的' },
];

export default function BottomNav() {
  return (
    <div className="bg-white dark:bg-ink-800 border-t border-cream-200 dark:border-ink-700 pointer-events-auto">
      <div className="flex items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center h-full transition-colors ${
                  isActive ? 'text-ink-800 dark:text-cream-100' : 'text-ink-400 dark:text-ink-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
