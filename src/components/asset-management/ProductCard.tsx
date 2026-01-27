import { InvestmentProduct } from '@/types/assetManagement';
import { RiskBadge } from '@/components/asset-management/RiskBadge';
import { formatNaira } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Clock, Droplets, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: InvestmentProduct;
  allocationPercentage?: number;
  investmentAmount?: number;
  reasoning?: string;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
}

export const ProductCard = ({
  product,
  allocationPercentage,
  investmentAmount,
  reasoning,
  onSelect,
  selected,
  className,
}: ProductCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border shadow-card p-5 transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:shadow-card-hover",
        onSelect && "cursor-pointer",
        className
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{product.name}</h4>
          <p className="text-sm text-muted-foreground">{product.type}</p>
        </div>
        <RiskBadge level={product.riskLevel} size="sm" />
      </div>

      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs">Returns</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {product.expectedReturnMin}-{product.expectedReturnMax}%
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Horizon</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{product.investmentHorizon}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span className="text-xs">Liquidity</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{product.liquidityLevel}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Min. Investment: <span className="font-medium text-foreground">{formatNaira(product.minimumInvestment)}</span>
        </p>
      </div>

      {(allocationPercentage !== undefined || investmentAmount !== undefined) && (
        <div className="mt-4 pt-4 border-t border-border bg-muted/30 -mx-5 -mb-5 px-5 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            {allocationPercentage !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">Allocation</p>
                <p className="text-lg font-bold text-primary">{allocationPercentage}%</p>
              </div>
            )}
            {investmentAmount !== undefined && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-lg font-bold text-foreground">{formatNaira(investmentAmount)}</p>
              </div>
            )}
          </div>
          {reasoning && (
            <p className="text-xs text-muted-foreground mt-2 italic">"{reasoning}"</p>
          )}
        </div>
      )}
    </div>
  );
};
