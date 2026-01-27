import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/assetManagement';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const riskConfig = {
  conservative: {
    label: 'Conservative',
    bgClass: 'bg-risk-low-bg',
    textClass: 'text-risk-low',
    icon: ShieldCheck,
  },
  moderate: {
    label: 'Moderate',
    bgClass: 'bg-risk-medium-bg',
    textClass: 'text-risk-medium',
    icon: Shield,
  },
  aggressive: {
    label: 'Aggressive',
    bgClass: 'bg-risk-high-bg',
    textClass: 'text-risk-high',
    icon: ShieldAlert,
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const RiskBadge = ({ level, showIcon = true, size = 'md', className }: RiskBadgeProps) => {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
};
