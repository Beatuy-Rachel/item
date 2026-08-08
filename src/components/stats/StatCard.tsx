import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  delay?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-primary-100 dark:bg-primary-900/30',
  iconColor = 'text-primary-500',
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trend.isUp ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
