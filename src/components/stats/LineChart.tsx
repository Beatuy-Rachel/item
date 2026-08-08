import type { MonthlyStat } from '@/types';
import { formatMonth } from '@/utils/date';
import { formatCurrency } from '@/utils/calculation';

interface LineChartProps {
  data: MonthlyStat[];
  height?: number;
}

export default function LineChart({ data, height = 180 }: LineChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = 100;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  
  const points = data.map((item, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * (chartWidth - padding.left - padding.right);
    const y = padding.top + chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y, ...item };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaD = `
    M ${padding.left} ${padding.top + chartHeight}
    ${pathD.substring(1)}
    L ${points[points.length - 1]?.x || 0} ${padding.top + chartHeight}
    Z
  `;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padding.top + chartHeight - ratio * chartHeight,
    value: maxValue * ratio,
  }));

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF8C42" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {yTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={chartWidth - padding.right}
              y2={tick.y}
              stroke="#E5E7EB"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x={padding.left - 5}
              y={tick.y + 3}
              textAnchor="end"
              fontSize="4"
              fill="#9CA3AF"
            >
              {formatCurrency(tick.value)}
            </text>
          </g>
        ))}
        
        <path d={areaD} fill="url(#areaGradient)" />
        
        <path
          d={pathD}
          fill="none"
          stroke="#FF8C42"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              stroke="#FF8C42"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="4"
              fill="#6B7280"
            >
              {formatMonth(point.month)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
