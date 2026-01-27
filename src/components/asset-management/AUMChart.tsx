import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatNaira } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AUMChartProps {
  data: { date: string; value: number }[];
  className?: string;
}

export const AUMChart = ({ data, className }: AUMChartProps) => {
  const formattedData = data.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground">{formatNaira(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            tickFormatter={(value) => `₦${(value / 1000000000).toFixed(1)}B`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(222, 47%, 35%)"
            strokeWidth={2}
            fill="url(#aumGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
