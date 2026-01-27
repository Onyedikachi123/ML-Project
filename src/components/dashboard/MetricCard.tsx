import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-risk-low-bg border-risk-low/20',
  warning: 'bg-risk-medium-bg border-risk-medium/20',
  danger: 'bg-risk-high-bg border-risk-high/20',
};

const iconStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-risk-low/10 text-risk-low',
  warning: 'bg-risk-medium/10 text-risk-medium',
  danger: 'bg-risk-high/10 text-risk-high',
};

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: MetricCardProps) => {
  return (
    <div className={cn(
      "rounded-xl p-5 border shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-lg",
          iconStyles[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "bg-risk-low/10 text-risk-low" 
              : "bg-risk-high/10 text-risk-high"
          )}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className={cn(
          "text-sm font-medium mb-1",
          variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
        )}>
          {title}
        </p>
        <p className={cn(
          "text-2xl font-bold",
          variant === 'primary' ? 'text-primary-foreground' : 'text-foreground'
        )}>
          {value}
        </p>
        {subtitle && (
          <p className={cn(
            "text-xs mt-1",
            variant === 'primary' ? 'text-primary-foreground/60' : 'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
