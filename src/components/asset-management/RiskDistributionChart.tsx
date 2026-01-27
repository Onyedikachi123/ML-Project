import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface RiskDistributionChartProps {
  data: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  className?: string;
}

const barColors = {
  Conservative: 'hsl(152, 69%, 40%)',
  Moderate: 'hsl(38, 92%, 50%)',
  Aggressive: 'hsl(0, 84%, 60%)',
};

export const RiskDistributionChart = ({ data, className }: RiskDistributionChartProps) => {
  const chartData = [
    { name: 'Conservative', value: data.conservative, color: barColors.Conservative },
    { name: 'Moderate', value: data.moderate, color: barColors.Moderate },
    { name: 'Aggressive', value: data.aggressive, color: barColors.Aggressive },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} investors</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-[250px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
