import { cn } from '@/lib/utils';
import { FeatureContribution } from '@/types/assetManagement';
import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';

interface ExplainabilityCardProps {
  title?: string;
  summary: string;
  factors: FeatureContribution[];
  className?: string;
}

export const ExplainabilityCard = ({ 
  title = "Why this investment profile?",
  summary,
  factors,
  className 
}: ExplainabilityCardProps) => {
  const sortedFactors = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <div className={cn("bg-card rounded-lg border border-border shadow-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      <p className="text-muted-foreground text-sm mb-6">{summary}</p>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Key Contributing Factors</h4>
        
        {sortedFactors.map((factor, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {factor.contribution > 0 ? (
                  <TrendingUp className="h-4 w-4 text-risk-low" />
                ) : factor.contribution < 0 ? (
                  <TrendingDown className="h-4 w-4 text-risk-high" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-sm text-foreground">{factor.feature}</span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  factor.contribution > 0 ? "text-risk-low" : factor.contribution < 0 ? "text-risk-high" : "text-muted-foreground"
                )}
              >
                {factor.contribution > 0 ? '+' : ''}{factor.contribution}%
              </span>
            </div>

            {/* Contribution bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  factor.contribution > 0 ? "bg-risk-low" : factor.contribution < 0 ? "bg-risk-high" : "bg-muted-foreground"
                )}
                style={{ width: `${Math.min(Math.abs(factor.contribution), 100)}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
