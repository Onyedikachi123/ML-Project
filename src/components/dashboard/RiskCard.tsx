import { Link } from 'react-router-dom';
import { formatNaira } from '@/lib/utils';
import { ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Applicant, getRiskLevel, getRiskLabel } from '@/data/mockApplicants';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RiskCardProps {
  applicant: Applicant;
}

const riskColors = {
  low: {
    badge: 'bg-risk-low-bg text-risk-low border-risk-low/30',
    score: 'text-risk-low',
    bg: 'hover:border-risk-low/50',
  },
  medium: {
    badge: 'bg-risk-medium-bg text-risk-medium border-risk-medium/30',
    score: 'text-risk-medium',
    bg: 'hover:border-risk-medium/50',
  },
  high: {
    badge: 'bg-risk-high-bg text-risk-high border-risk-high/30',
    score: 'text-risk-high',
    bg: 'hover:border-risk-high/50',
  },
};

export const RiskCard = ({ applicant }: RiskCardProps) => {
  const riskLevel = getRiskLevel(applicant.risk_score);
  const colors = riskColors[riskLevel];

  return (
    <Link
      to={`/applicant/${applicant.id}`}
      className={cn(
        "block bg-card rounded-xl border border-border p-5 shadow-card transition-all duration-300 hover:shadow-card-hover group",
        colors.bg
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {applicant.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Age {applicant.age} • {applicant.education}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Income</p>
          <p className="font-semibold text-foreground">
            {formatNaira(applicant.income)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Recommended Loan</p>
          <p className="font-semibold text-foreground">
            {formatNaira(applicant.recommended_loan)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border cursor-help",
              colors.badge
            )}>
              {getRiskLabel(applicant.risk_score)} Risk
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              Risk score indicates probability of default.
              <br />
              <span className="text-muted-foreground">
                Low: &lt;33% | Medium: 33-66% | High: &gt;66%
              </span>
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("text-2xl font-bold cursor-help", colors.score)}>
              {(applicant.risk_score * 100).toFixed(0)}%
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Probability of Default: {(applicant.risk_score * 100).toFixed(1)}%</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </Link>
  );
};
