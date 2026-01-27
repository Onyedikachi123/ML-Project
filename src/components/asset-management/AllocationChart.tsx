import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AssetAllocation, ProductType } from '@/types/assetManagement';
import { formatNaira } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AllocationChartProps {
  allocations: AssetAllocation[];
  showLegend?: boolean;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const productColors: Record<ProductType, string> = {
  'Fixed Income': 'hsl(222, 47%, 35%)',
  'Money Market': 'hsl(152, 69%, 40%)',
  'Equities': 'hsl(38, 92%, 50%)',
  'Real Estate': 'hsl(262, 83%, 58%)',
  'Commodities': 'hsl(0, 84%, 60%)',
};

const sizeConfig = {
  sm: { outerRadius: 60, innerRadius: 35, height: 160 },
  md: { outerRadius: 90, innerRadius: 50, height: 220 },
  lg: { outerRadius: 120, innerRadius: 70, height: 300 },
};

export const AllocationChart = ({
  allocations,
  showLegend = true,
  showValues = false,
  size = 'md',
  className,
}: AllocationChartProps) => {
  const config = sizeConfig[size];

  const chartData = useMemo(() => {
    return allocations.map(a => ({
      name: a.productType,
      value: a.percentage,
      currentValue: a.currentValue,
      color: productColors[a.productType] || a.color,
    }));
  }, [allocations]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value.toFixed(1)}%</p>
          {showValues && data.currentValue > 0 && (
            <p className="text-sm font-medium text-foreground">{formatNaira(data.currentValue)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {chartData.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.name}</span>
          <span className="text-sm font-medium text-foreground">{entry.value.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={config.height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={config.innerRadius}
            outerRadius={config.outerRadius}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && renderCustomLegend()}
    </div>
  );
};
