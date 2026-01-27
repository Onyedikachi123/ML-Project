import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  success: {
    iconBg: 'bg-risk-low-bg',
    iconColor: 'text-risk-low',
  },
  warning: {
    iconBg: 'bg-risk-medium-bg',
    iconColor: 'text-risk-medium',
  },
  danger: {
    iconBg: 'bg-risk-high-bg',
    iconColor: 'text-risk-high',
  },
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "bg-card rounded-lg border border-border shadow-card p-6 transition-shadow hover:shadow-card-hover",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={cn("p-3 rounded-lg", styles.iconBg)}>
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              trend.value >= 0 ? "text-risk-low" : "text-risk-high"
            )}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value.toFixed(1)}%
          </span>
          {trend.label && (
            <span className="text-sm text-muted-foreground">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
