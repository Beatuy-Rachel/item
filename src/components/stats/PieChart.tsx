import type { CategoryStat } from '@/types';
import { categories } from '@/data/categories';

interface PieChartProps {
  data: CategoryStat[];
  size?: number;
  strokeWidth?: number;
}

export default function PieChart({ data, size = 200, strokeWidth = 32 }: PieChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let totalPercentage = 0;
  
  const arcs = data.map((item, index) => {
    const category = categories.find((c) => c.id === item.category);
    const offset = (totalPercentage / 100) * circumference;
    totalPercentage += item.percentage;
    const arcLength = (item.percentage / 100) * circumference;
    
    return {
      ...item,
      color: category?.color || '#999',
      name: category?.name || '未知',
      offset,
      arcLength,
    };
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {arcs.map((arc, index) => (
            <circle
              key={arc.category}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.arcLength} ${circumference}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">总价值</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ¥{data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
