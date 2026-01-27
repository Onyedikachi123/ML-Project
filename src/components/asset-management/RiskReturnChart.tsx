import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/data/mockAssetManagement';

interface RiskReturnChartProps {
  data: {
    name: string;
    risk: number;
    returns: number;
    value?: number;
  }[];
  className?: string;
}

export const RiskReturnChart = ({ data, className }: RiskReturnChartProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground">Risk Score: {item.risk}</p>
          <p className="text-sm text-muted-foreground">Returns: {item.returns.toFixed(1)}%</p>
          {item.value && (
            <p className="text-sm text-muted-foreground">Value: {formatCurrency(item.value)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="risk"
            name="Risk"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            label={{ value: 'Risk Score', position: 'bottom', offset: 0, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="returns"
            name="Returns"
            domain={[-10, 30]}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            label={{ value: 'Returns (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="value" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={data}
            fill="hsl(222, 47%, 35%)"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
