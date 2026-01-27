import { cn } from '@/lib/utils';
import { PortfolioStatus } from '@/types/assetManagement';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: PortfolioStatus | 'healthy' | 'warning' | 'critical';
  className?: string;
}

const statusConfig = {
  stable: {
    label: 'Stable',
    bgClass: 'bg-risk-low-bg',
    textClass: 'text-risk-low',
    icon: CheckCircle2,
  },
  healthy: {
    label: 'Healthy',
    bgClass: 'bg-risk-low-bg',
    textClass: 'text-risk-low',
    icon: CheckCircle2,
  },
  'needs-rebalancing': {
    label: 'Needs Rebalancing',
    bgClass: 'bg-risk-medium-bg',
    textClass: 'text-risk-medium',
    icon: AlertTriangle,
  },
  warning: {
    label: 'Warning',
    bgClass: 'bg-risk-medium-bg',
    textClass: 'text-risk-medium',
    icon: AlertTriangle,
  },
  'over-exposed': {
    label: 'Over-exposed',
    bgClass: 'bg-risk-high-bg',
    textClass: 'text-risk-high',
    icon: AlertCircle,
  },
  critical: {
    label: 'Critical',
    bgClass: 'bg-risk-high-bg',
    textClass: 'text-risk-high',
    icon: AlertCircle,
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 font-medium text-sm rounded-full',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
};
