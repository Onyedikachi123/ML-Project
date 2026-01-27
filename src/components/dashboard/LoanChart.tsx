import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Applicant, getRiskLevel } from '@/data/mockApplicants';

interface LoanChartProps {
  applicants: Applicant[];
  maxItems?: number;
}

const riskColors = {
  low: 'hsl(152, 69%, 40%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 84%, 60%)',
};

export const LoanChart = ({ applicants, maxItems = 15 }: LoanChartProps) => {
  const chartData = useMemo(() => {
    return applicants
      .slice(0, maxItems)
      .map((a) => ({
        name: a.name.split(' ')[0],
        id: a.id,
        score: Math.round(a.risk_score * 100),
        riskLevel: getRiskLevel(a.risk_score),
        fullName: a.name,
      }));
  }, [applicants, maxItems]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">
            Risk Score: <span className="font-medium text-foreground">{data.score}%</span>
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            Level: <span
              className="font-medium"
              style={{ color: riskColors[data.riskLevel as keyof typeof riskColors] }}
            >
              {data.riskLevel}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="mb-5">
        <h3 className="font-semibold text-lg text-foreground">Probability of Default</h3>
        <p className="text-sm text-muted-foreground">Risk scores by applicant</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
            <Bar
              dataKey="score"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={riskColors[entry.riskLevel as keyof typeof riskColors]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: riskColors.low }} />
          <span className="text-sm text-muted-foreground">Low (&lt;33%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: riskColors.medium }} />
          <span className="text-sm text-muted-foreground">Medium (33-66%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: riskColors.high }} />
          <span className="text-sm text-muted-foreground">High (&gt;66%)</span>
        </div>
      </div>
    </div>
  );
};
