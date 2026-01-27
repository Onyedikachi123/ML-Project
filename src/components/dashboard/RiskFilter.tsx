import { cn } from '@/lib/utils';
import { RiskLevel } from '@/data/mockApplicants';

interface RiskFilterProps {
  currentFilter: RiskLevel | 'all';
  onFilterChange: (filter: RiskLevel | 'all') => void;
  counts: {
    all: number;
    low: number;
    medium: number;
    high: number;
  };
}

const filterOptions: { value: RiskLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
];

const filterStyles = {
  all: {
    active: 'bg-primary text-primary-foreground',
    inactive: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  },
  low: {
    active: 'bg-risk-low text-white',
    inactive: 'bg-risk-low-bg text-risk-low hover:bg-risk-low/20',
  },
  medium: {
    active: 'bg-risk-medium text-white',
    inactive: 'bg-risk-medium-bg text-risk-medium hover:bg-risk-medium/20',
  },
  high: {
    active: 'bg-risk-high text-white',
    inactive: 'bg-risk-high-bg text-risk-high hover:bg-risk-high/20',
  },
};

export const RiskFilter = ({ currentFilter, onFilterChange, counts }: RiskFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => {
        const isActive = currentFilter === option.value;
        const styles = filterStyles[option.value];
        const count = counts[option.value];

        return (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive ? styles.active : styles.inactive
            )}
          >
            <span>{option.label}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              isActive 
                ? "bg-white/20 text-current" 
                : "bg-current/10"
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
